/** Browser probes deliberately keep frame intervals in chronological order. */
export async function measureScroll(page, kind) {
  return page.evaluate(async kind => {
    window.limrReadingEvents = [];
    const frames = [];
    let previous = performance.now(), start = previous, steps = 0, emptySamples = 0;
    let misalignedSlotSamples = 0, maxVisibleSlotGap = 0, maxVisibleSlotOverlap = 0;
    const covered = () => {
      const article = document.querySelector('.limr-reader-content > article');
      if (!article) return false;
      const slots = [...article.querySelectorAll('[data-window-slot]:not([data-window-parked])')].map(element => ({
        index: Number(element.dataset.windowSlot), box: element.getBoundingClientRect(),
      })).sort((a, b) => a.index - b.index);
      let misaligned = false;
      for (let index = 1; index < slots.length; index++) {
        const previous = slots[index - 1], next = slots[index];
        if (next.index !== previous.index + 1 || previous.box.bottom < 0 || next.box.top > innerHeight) continue;
        const gap = next.box.top - previous.box.bottom;
        maxVisibleSlotGap = Math.max(maxVisibleSlotGap, gap);
        maxVisibleSlotOverlap = Math.max(maxVisibleSlotOverlap, -gap);
        if (Math.abs(gap) > 1) misaligned = true;
      }
      if (misaligned) misalignedSlotSamples++;
      const box = article.getBoundingClientRect();
      return [.2, .5, .8].some(y => document.elementsFromPoint(box.x + box.width / 2, innerHeight * y).some(element => {
        const block = element.closest('[data-limr-block]');
        return block && article.contains(block) && !block.closest('[inert]') && (block.textContent.trim() || block.querySelector('img,svg'));
      }));
    };
    while (kind === 'steady' ? performance.now() - start < 3000 : steps < 120) {
      await new Promise(requestAnimationFrame);
      const now = performance.now(), elapsed = now - previous;
      frames.push(elapsed); previous = now;
      // Inspect the viewport reached by the previous frame's scroll, before
      // requesting the next position. This also covers windowed block mounts.
      if (steps % 12 === 0 && !covered()) emptySamples++;
      const next = kind === 'steady' ? scrollY + 480 * elapsed / 1000 : kind === 'fast' ? scrollY + 120
        : (steps < 60 ? steps / 60 : (120 - steps) / 60) * (document.documentElement.scrollHeight - innerHeight);
      scrollTo(0, next);
      steps++;
    }
    await new Promise(resolve => setTimeout(resolve, 0));
    return { frames, longtasks: window.limrReadingEvents.filter(task => task.start >= start), emptySamples,
      misalignedSlotSamples, maxVisibleSlotGap, maxVisibleSlotOverlap, finalScroll: scrollY };
  }, kind);
}

export async function prepareTranslation(page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const found = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('[data-translation-switch]')].filter(element => !element.closest('[inert],[data-window-parked]'));
      const visible = buttons.find(element => { const box = element.getBoundingClientRect(); return box.height > 0 && box.bottom > 0 && box.top < innerHeight; });
      const button = visible ?? buttons[0];
      button?.scrollIntoView({ block: 'center' });
      return !!button;
    });
    if (!found) return false;
    await page.waitForTimeout(350);
    const visible = await page.evaluate(() => [...document.querySelectorAll('[data-translation-switch]')].some(element => {
      const box = element.getBoundingClientRect();
      return !element.closest('[inert],[data-window-parked]') && box.height > 0 && box.bottom > 0 && box.top < innerHeight;
    }));
    if (visible) return true;
  }
  return false;
}

export async function measureTranslation(page, scrolling = false) {
  return page.evaluate(async scrolling => {
    window.limrReadingEvents = [];
    const button = [...document.querySelectorAll('[data-translation-switch]')].filter(element => {
      const box = element.getBoundingClientRect();
      return !element.closest('[inert],[data-window-parked]') && box.height > 0 && box.bottom > 0 && box.top < innerHeight;
    }).sort((a, b) => Math.abs(a.getBoundingClientRect().top - innerHeight / 2) - Math.abs(b.getBoundingClientRect().top - innerHeight / 2))[0];
    if (!button) throw new Error('No visible translation switch');
    const buttonRect = button.getBoundingClientRect().toJSON();
    const block = button.closest('.limr-translations'), originalMode = block.dataset.mode;
    const frames = [], start = performance.now();
    let previous = start, committed = null;
    const observer = new MutationObserver(() => {
      if (committed === null && block.dataset.mode !== originalMode) committed = performance.now() - start;
    });
    observer.observe(block, { attributes: true, attributeFilter: ['data-mode'] });
    button.click();
    while (performance.now() - start < 800) {
      await new Promise(requestAnimationFrame);
      const now = performance.now(), elapsed = now - previous;
      frames.push(elapsed); previous = now;
      if (scrolling) scrollTo(0, scrollY + 480 * elapsed / 1000);
    }
    observer.disconnect();
    await new Promise(resolve => setTimeout(resolve, 0));
    return { frames, longtasks: window.limrReadingEvents.filter(task => task.start >= start), committed,
      modeChanged: block.dataset.mode !== originalMode, scrolling, buttonRect, visibleAtStart: buttonRect.bottom > 0 && buttonRect.top < innerHeight };
  }, scrolling);
}

export async function measureResize(page, width) {
  await page.evaluate(() => {
    window.limrReadingEvents = [];
    window.limrReadingResize = { start: performance.now(), frames: [], last: performance.now(), lastChange: performance.now(), finished: false };
    const tick = () => {
      const state = window.limrReadingResize, now = performance.now();
      state.frames.push(now - state.last); state.last = now;
      const paragraphs = [...document.querySelectorAll('.limr-reader-content p,.limr-reader-content li')].filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < innerHeight && !element.closest('[inert],[data-window-parked]');
      });
      const signature = paragraphs.map(element => {
        const rect = element.getBoundingClientRect();
        return `${rect.x.toFixed(1)},${rect.y.toFixed(1)},${rect.width.toFixed(1)},${rect.height.toFixed(1)},${element.dataset.limrKp ?? ''},${element.dataset.limrKpLines ?? ''},${element.querySelectorAll('[data-limr-kp-run],.limr-kp-glue').length}`;
      }).join('|');
      if (signature !== state.signature) { state.signature = signature; state.lastChange = now; }
      const stale = paragraphs.some(element => element.hasAttribute('data-limr-kp-stale'));
      if (now - state.start > 200 && !stale && now - state.lastChange >= 150 || now - state.start > 5000) {
        Object.assign(state, { finished: true, stable: now - state.start, stale, timeout: now - state.start > 5000,
          contentWidth: document.querySelector('.limr-reader-content').getBoundingClientRect().width });
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.setViewportSize({ width, height: 1000 });
  await page.waitForFunction(() => window.limrReadingResize.finished);
  return { width, ...await page.evaluate(() => ({ ...window.limrReadingResize,
    longtasks: window.limrReadingEvents.filter(task => task.start >= window.limrReadingResize.start),
  })) };
}

export async function completeness(page) {
  return page.evaluate(() => ({
    sourceBlocks: document.querySelectorAll('.limr-reader-content [data-limr-block]').length,
    sidebarCards: document.querySelectorAll('.limr-sidebar-card').length,
    windowed: !!document.querySelector('[data-limr-windowed]'),
    mountedSlots: document.querySelectorAll('[data-window-slot]').length,
    contentWidth: document.querySelector('.limr-reader-content')?.getBoundingClientRect().width ?? 0,
    images: [...document.images].map(image => ({ source: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 })),
    visibleStale: [...document.querySelectorAll('[data-limr-kp-stale]')].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight && !element.closest('[inert],[data-window-parked]');
    }).length,
  }));
}
