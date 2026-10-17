import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Browser-only metadata. Node parsing/SSR/solver environment() stays unchanged.
// No tracing, launch-policy override, focus action or window resize is performed.
const errorText = error => error?.stack ?? String(error);
async function bounded(promise, name, milliseconds = 5000) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} exceeded ${milliseconds} ms`)), milliseconds); })]); }
  finally { clearTimeout(timer); }
}
async function attempt(action) {
  try { return { observed: true, value: await action() }; }
  catch (error) { return { observed: false, error: errorText(error) }; }
}
async function hashFile(file) {
  const hash = createHash('sha256');
  for await (const bytes of createReadStream(file)) hash.update(bytes);
  return hash.digest('hex');
}
async function playwrightVersion() {
  let directory = dirname(fileURLToPath(import.meta.resolve('@playwright/test')));
  for (;;) {
    try { const value = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8')); if (value.name === '@playwright/test') return value.version; } catch { /* Try the package parent. */ }
    const parent = dirname(directory); if (parent === directory) throw new Error('Cannot resolve @playwright/test package version'); directory = parent;
  }
}

export function browserSettings(env = process.env) {
  const mode = env.BENCH_BROWSER_MODE ?? 'headless';
  if (!['headless', 'headed'].includes(mode)) throw new Error('BENCH_BROWSER_MODE accepts headless or headed');
  const executablePath = env.BENCH_BROWSER_EXECUTABLE;
  if (executablePath !== undefined && (!executablePath || !isAbsolute(executablePath))) throw new Error('BENCH_BROWSER_EXECUTABLE must be an absolute executable path');
  return { mode, modeExplicit: env.BENCH_BROWSER_MODE !== undefined,
    executablePolicy: executablePath ? 'explicit' : 'playwright-default', executablePath: executablePath ?? null,
    requestedGPU: 'default; no explicit GPU/backend flags',
    launchOptions: { headless: mode === 'headless', ...(executablePath ? { executablePath } : {}) } };
}

export function browserOutputPath(defaultPath, settings, override = process.env.BENCH_OUTPUT) {
  if (override !== undefined) return resolve(override);
  return settings.mode === 'headed' ? defaultPath.replace(/(?:\.json)?$/, '-headed.json') : defaultPath;
}

export async function inspectBrowserIdentity(browser, settings) {
  const identity = { requested: settings, startedAt: new Date().toISOString(), browserVersion: browser.version() };
  let session;
  try {
    session = await browser.newBrowserCDPSession();
    identity.protocol = await attempt(() => bounded(session.send('Browser.getVersion'), 'Browser.getVersion'));
    identity.playwright = await attempt(playwrightVersion);
    identity.commandLine = await attempt(async () => {
      const value = await bounded(session.send('Browser.getBrowserCommandLine'), 'Browser.getBrowserCommandLine');
      if (!Array.isArray(value.arguments) || !value.arguments.length || value.arguments.some(argument => typeof argument !== 'string')) throw new Error('No complete browser command-line arguments were observed');
      return value;
    });
    if (identity.commandLine.observed) identity.commandLine.source = 'Browser.getBrowserCommandLine';
    else {
      const originalError = identity.commandLine.error;
      const fallback = await attempt(() => bounded(session.send('SystemInfo.getInfo'), 'SystemInfo.getInfo command-line fallback'));
      const value = fallback.value?.commandLine;
      identity.commandLine = typeof value === 'string' && value.length > 0
        ? { observed: true, source: 'SystemInfo.getInfo.commandLine', value, originalError }
        : { observed: false, source: 'SystemInfo.getInfo.commandLine', originalError, error: fallback.error ?? 'No commandLine string in SystemInfo reply' };
    }
    // The protocol returns argv only in Browser.getBrowserCommandLine. Keep
    // SystemInfo's string intact; never split it into invented argv tokens.
    if (identity.commandLine.observed) {
      identity.commandLine.hasDisableGPU = identity.commandLine.source === 'Browser.getBrowserCommandLine'
        ? identity.commandLine.value.arguments.some(value => value === '--disable-gpu' || value.startsWith('--disable-gpu='))
        : /(?:^|\s)--disable-gpu(?:=|\s|$)/.test(identity.commandLine.value);
    }
    const expected = settings.executablePath ? await attempt(async () => {
      const file = await realpath(settings.executablePath); return { path: file, sha256: await hashFile(file) };
    }) : { observed: false, reason: 'Playwright default binary was not explicitly selected' };
    identity.requestedExecutable = expected;
    if (process.platform === 'linux') {
      identity.actualExecutable = await attempt(async () => {
        const processes = await bounded(session.send('SystemInfo.getProcessInfo'), 'SystemInfo.getProcessInfo');
        const candidates = processes.processInfo.filter(process => process.type === 'browser');
        if (candidates.length !== 1 || !Number.isSafeInteger(candidates[0].id) || candidates[0].id <= 0) throw new Error('No unique owned browser process identity');
        const pid = candidates[0].id;
        const readIdentity = async () => {
          const file = await realpath(`/proc/${pid}/exe`), stat = await readFile(`/proc/${pid}/stat`, 'utf8');
          const startTicks = stat.slice(stat.lastIndexOf(')') + 2).trim().split(/\s+/)[19];
          if (!/^\d+$/.test(startTicks)) throw new Error('Missing browser process start time');
          return { pid, path: file, startTicks };
        };
        const before = await readIdentity();
        const sha256 = expected.observed && expected.value.path === before.path ? expected.value.sha256 : await hashFile(before.path);
        const after = await readIdentity();
        if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Browser process identity changed during binary hashing');
        if (expected.observed && expected.value.path !== before.path) throw new Error('Observed browser executable differs from requested executable');
        return { ...before, sha256, source: 'SystemInfo browser PID plus procfs executable/start time' };
      });
    } else identity.actualExecutable = { observed: false, reason: 'OS executable verification is only available through Linux procfs in this helper' };
  } catch (error) { identity.error = errorText(error); }
  finally { await session?.detach().catch(() => {}); identity.finishedAt = new Date().toISOString(); }
  return identity;
}

export async function capturePageGeometry(page) {
  return attempt(() => bounded(page.evaluate(() => ({
    inner: { width: innerWidth, height: innerHeight }, outer: { width: outerWidth, height: outerHeight },
    dpr: devicePixelRatio, screen: { width: screen.width, height: screen.height, availWidth: screen.availWidth, availHeight: screen.availHeight },
    visibility: document.visibilityState, focused: document.hasFocus(), scrollTop: scrollY,
    reader: document.querySelector('.limr-reader')?.getBoundingClientRect().toJSON() ?? null,
    content: document.querySelector('.limr-reader-content')?.getBoundingClientRect().toJSON() ?? null,
  })), 'page geometry'));
}

async function snapshot(browser, page, label) {
  const result = { label, startedAt: new Date().toISOString(), expectedViewport: page.viewportSize() };
  let session, target;
  try {
    session = await browser.newBrowserCDPSession();
    result.gpu = await attempt(() => bounded(session.send('SystemInfo.getInfo'), 'SystemInfo.getInfo'));
    const gpu = result.gpu.value?.gpu;
    if (result.gpu.observed && (!gpu || !Array.isArray(gpu.devices)
        || !['gpu_compositing', 'rasterization'].every(key => typeof gpu.featureStatus?.[key] === 'string' && gpu.featureStatus[key].trim())
        || typeof gpu.auxAttributes?.glRenderer !== 'string' || !gpu.auxAttributes.glRenderer.trim())) {
      result.gpu.observed = false; result.gpu.error = 'SystemInfo reply lacks GPU devices, renderer or compositing/rasterization status';
    }
    result.window = await attempt(async () => {
      target = await page.context().newCDPSession(page);
      const info = await bounded(target.send('Target.getTargetInfo'), 'Target.getTargetInfo');
      const window = await bounded(session.send('Browser.getWindowForTarget', { targetId: info.targetInfo.targetId }), 'Browser.getWindowForTarget');
      return { ...window, ...(await bounded(session.send('Browser.getWindowBounds', { windowId: window.windowId }), 'Browser.getWindowBounds')) };
    });
    result.geometry = await capturePageGeometry(page);
  } catch (error) { result.error = errorText(error); }
  finally { await target?.detach().catch(() => {}); await session?.detach().catch(() => {}); result.finishedAt = new Date().toISOString(); }
  return result;
}

export async function beginBrowserCase(browser, page) {
  const visibility = await attempt(() => bounded(page.evaluate(() => {
    const prior = window.__limrBenchmarkBrowserEnvironment;
    if (prior) document.removeEventListener('visibilitychange', prior.listen);
    const state = { changes: [], listen: () => state.changes.push({ at: performance.now(), state: document.visibilityState }) };
    window.__limrBenchmarkBrowserEnvironment = state; document.addEventListener('visibilitychange', state.listen);
  }), 'visibility observer setup'));
  return { visibility, before: await snapshot(browser, page, 'before-loading') };
}

function gpuKey(value) {
  const gpu = value.gpu, aux = gpu.auxAttributes ?? {};
  return JSON.stringify({ devices: gpu.devices, status: Object.fromEntries(Object.entries(gpu.featureStatus).sort(([a], [b]) => a.localeCompare(b))),
    glRenderer: aux.glRenderer, glVendor: aux.glVendor, glVersion: aux.glVersion, glImplementationParts: aux.glImplementationParts,
    processCrashCount: aux.processCrashCount });
}

export async function finishBrowserCase(browser, page, state, settings, identity) {
  const after = await snapshot(browser, page, 'after-probes');
  const visibility = await attempt(() => bounded(page.evaluate(() => {
    const state = window.__limrBenchmarkBrowserEnvironment;
    if (!state) throw new Error('Visibility observer state is absent');
    document.removeEventListener('visibilitychange', state.listen); delete window.__limrBenchmarkBrowserEnvironment; return state.changes;
  }), 'visibility observer readback'));
  const issues = [];
  if (!identity.commandLine?.observed) issues.push('Browser command line was not observed');
  if (identity.commandLine?.hasDisableGPU) issues.push('Observed browser command line disables GPU despite requested default policy');
  if (identity.requested.executablePolicy === 'explicit' && !identity.requestedExecutable?.observed) issues.push('Requested browser executable was not fingerprinted');
  if (process.platform === 'linux' && !identity.actualExecutable?.observed) issues.push('Actual Linux browser executable was not verified');
  for (const observation of [state.before, after]) {
    if (!observation.gpu?.observed) issues.push(`${observation.label}: GPU status was not observed`);
    if (!observation.geometry?.observed) issues.push(`${observation.label}: page geometry was not observed`);
    else {
      const geometry = observation.geometry.value, expected = observation.expectedViewport;
      if (geometry.visibility !== 'visible') issues.push(`${observation.label}: page was not visible`);
      if (settings.mode === 'headed' && !geometry.focused) issues.push(`${observation.label}: headed page was not focused`);
      if (expected && (geometry.inner.width !== expected.width || geometry.inner.height !== expected.height)) issues.push(`${observation.label}: actual CSS viewport differs from requested viewport`);
    }
    if (settings.mode === 'headed' && (!observation.window?.observed || !(observation.window.value.bounds.width > 0) || !(observation.window.value.bounds.height > 0))) issues.push(`${observation.label}: native window bounds were not observed`);
  }
  if (!state.visibility.observed || !visibility.observed) issues.push('Visibility changes were not observed');
  else if (visibility.value.some(change => change.state !== 'visible')) issues.push('Page was hidden during the case');
  if (state.before.gpu?.observed && after.gpu?.observed && gpuKey(state.before.gpu.value) !== gpuKey(after.gpu.value)) issues.push('Observed GPU devices/backend/status/crash count changed during the case');
  return { ...state, after, visibility, performanceEnvironmentVerified: issues.length === 0, issues,
    interpretation: 'GPU status is observed, not inferred from launch mode. Headless/headed or distinct observed backends must not be pooled. rAF is not physical presentation latency.' };
}
