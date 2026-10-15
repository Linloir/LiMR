import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

// Linux counters are optional. Unsupported hosts still retain Node resource
// usage; an exited renderer or an inaccessible procfs produces null fields.
const clockTicksPerSecond = (() => {
  try { return Number(execFileSync('getconf', ['CLK_TCK'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()) || null; }
  catch { return null; }
})();
async function read(path: string) {
  try { return await readFile(path, 'utf8'); } catch { return null; }
}
function stat(text: string | null) {
  if (!text) return null;
  const fields = text.slice(text.lastIndexOf(')') + 2).split(' ');
  return { minflt: Number(fields[7]), majflt: Number(fields[9]), utime: Number(fields[11]), stime: Number(fields[12]) };
}
function selected(text: string | null, pattern: RegExp) {
  return text === null ? null : Object.fromEntries(text.split('\n').filter(line => pattern.test(line)).map(line => line.split(/:\s*/)));
}

/** Outside page timing: covers the complete run, including trailing rAFs and
 * adjacent CDP metric requests. Process CPU includes workers; mainThread does
 * not. System counters cover the host, so correlation is not attribution. */
export async function hostState(rendererIds: number[] = []) {
  const startedAt = new Date().toISOString();
  const [vmstat, meminfo, cpuPressure, memoryPressure, cgroupEvents, cgroupCurrent, ...renderers] = await Promise.all([
    read('/proc/vmstat'), read('/proc/meminfo'), read('/proc/pressure/cpu'), read('/proc/pressure/memory'),
    read('/sys/fs/cgroup/memory.events'), read('/sys/fs/cgroup/memory.current'),
    ...rendererIds.map(async pid => {
      const [processStat, threadStat, status] = await Promise.all([
        read(`/proc/${pid}/stat`), read(`/proc/${pid}/task/${pid}/stat`), read(`/proc/${pid}/status`),
      ]);
      return { pid, process: stat(processStat), mainThread: stat(threadStat),
        status: selected(status, /^(VmRSS|VmSwap|RssAnon|RssFile|VmSize|voluntary_ctxt_switches|nonvoluntary_ctxt_switches):/) };
    }),
  ]);
  return { startedAt, at: new Date().toISOString(), clockTicksPerSecond,
    node: { pid: process.pid, ...process.memoryUsage(), usage: process.resourceUsage() },
    vmstat: vmstat === null ? null : Object.fromEntries(vmstat.split('\n')
      .filter(line => /^(pgmajfault|pgfault|pgscan_|pgsteal_|pswp|compact_|allocstall_|thp_fault_|thp_collapse_|thp_split_)/.test(line))
      .map(line => { const [key, value] = line.split(' '); return [key, Number(value)]; })),
    meminfo: selected(meminfo, /^(MemAvailable|MemFree|SwapFree|SwapTotal|AnonHugePages|AnonPages|Committed_AS|CommitLimit|Cached|SReclaimable):/),
    cpuPressure, memoryPressure, cgroupEvents, cgroupCurrent: cgroupCurrent === null ? null : Number(cgroupCurrent), renderers };
}
