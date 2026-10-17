import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import type { Heading } from '../core';
import { BlockHeightIndex } from '../core/height-index';
import { useIsomorphicLayoutEffect } from '../react/context';

export interface ContentsWindowHandle { follow(id: string, inset: number): void }

/** Variable-height TOC rows retain wrapped titles, source order and keyboard
 * access to every heading while bounding both visible and collapsed TOC DOM. */
export function WindowedContents({ headings, container, handle, render }: {
  headings: readonly Heading[];
  container: RefObject<HTMLDivElement | null>;
  handle: RefObject<ContentsWindowHandle | null>;
  render(heading: Heading): ReactNode;
}) {
  const measured = useRef(new Map<string, number>());
  const heights = useMemo(() => {
    const retained = new Map<string, number>();
    const values = headings.map(heading => {
      const height = measured.current.get(heading.id);
      if (height !== undefined) retained.set(heading.id, height);
      return height ?? 32;
    });
    measured.current = retained;
    return new BlockHeightIndex(values);
  }, [headings]);
  const ids = useMemo(() => new Map(headings.map((heading, index) => [heading.id, index])), [headings]);
  const [window, setWindow] = useState({ start: 0, end: 32, version: 0 });
  const [focused, setFocused] = useState<string | null>(null);
  const pendingFocus = useRef<string | null>(null);
  const pendingFollow = useRef<{ id: string; inset: number } | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const viewport = useRef({ width: 0, height: 0 });
  const update = (changed = false) => {
    const host = container.current;
    if (!host) return;
    const start = heights.at(Math.max(0, host.scrollTop - 400));
    const end = Math.min(headings.length, heights.at(host.scrollTop + (host.clientHeight || 600) + 400) + 1);
    setWindow(previous => previous.start === start && previous.end === end && !changed ? previous
      : { start, end, version: previous.version + 1 });
  };
  const measure = () => {
    const host = container.current;
    if (!host?.clientWidth) return;
    const resized = viewport.current.width !== host.clientWidth || viewport.current.height !== host.clientHeight;
    viewport.current = { width: host.clientWidth, height: host.clientHeight };
    if (resized && host.contains(document.activeElement)) {
      pendingFocus.current = (document.activeElement as HTMLElement)?.dataset.heading ?? null;
    }
    const anchor = heights.at(host.scrollTop), before = heights.offset(anchor);
    let changed = false;
    for (const row of list.current?.querySelectorAll<HTMLElement>('[data-toc-index]') ?? []) {
      const index = Number(row.dataset.tocIndex), height = row.getBoundingClientRect().height + 2;
      if (height > 2 && Math.abs(height - heights.height(index)) > .25) {
        measured.current.set(headings[index].id, height);
        heights.set(index, height); changed = true;
      }
    }
    if (changed) host.scrollTop += heights.offset(anchor) - before;
    update(changed || resized);
    return changed;
  };
  useIsomorphicLayoutEffect(() => {
    const host = container.current;
    if (!host) return;
    let frame = 0;
    const scroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };
    const resize = new ResizeObserver(measure);
    resize.observe(host);
    for (const row of list.current?.children ?? []) resize.observe(row);
    host.addEventListener('scroll', scroll, { passive: true });
    const changed = measure();
    if (pendingFocus.current) {
      const link = Array.from(list.current?.querySelectorAll<HTMLAnchorElement>('a[data-heading]') ?? []).find(link => link.dataset.heading === pendingFocus.current);
      if (link) {
        const index = ids.get(pendingFocus.current)!;
        const top = heights.offset(index), bottom = heights.offset(index + 1);
        if (top < host.scrollTop) host.scrollTop = top;
        else if (bottom > host.scrollTop + host.clientHeight) host.scrollTop = bottom - host.clientHeight;
        link.focus({ preventScroll: true });
        // Estimated rows before the destination can grow on the first render.
        // Repeat after their committed offsets settle, keeping focus visible.
        if (!changed) pendingFocus.current = null;
        update();
      }
    }
    if (pendingFollow.current) {
      const index = ids.get(pendingFollow.current.id);
      if (index !== undefined) host.scrollTop = Math.max(0, heights.offset(index) - pendingFollow.current.inset);
      if (!changed) pendingFollow.current = null;
      update();
    }
    handle.current = { follow(id, inset) {
      const index = ids.get(id);
      if (index !== undefined) {
        // A long smooth scroll would measure every intervening estimated row
        // and move its own destination. Reveal the target, then settle locally.
        pendingFollow.current = { id, inset };
        host.scrollTop = Math.max(0, heights.offset(index) - inset); update(true);
      }
    } };
    return () => { cancelAnimationFrame(frame); resize.disconnect(); host.removeEventListener('scroll', scroll); handle.current = null; };
  });
  const move = (index: number) => {
    const host = container.current;
    if (!host || index < 0 || index >= headings.length) return;
    const top = heights.offset(index), bottom = heights.offset(index + 1);
    if (top < host.scrollTop) host.scrollTop = top;
    else if (bottom > host.scrollTop + host.clientHeight) host.scrollTop = Math.max(0, bottom - host.clientHeight);
    pendingFocus.current = headings[index].id; setFocused(headings[index].id); update();
  };
  const key = (event: KeyboardEvent<HTMLOListElement>) => {
    const link = (event.target as HTMLElement).closest<HTMLElement>('[data-heading]');
    const current = link ? ids.get(link.dataset.heading!) : undefined;
    let target: number | undefined;
    if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = headings.length - 1;
    else if (event.key === 'ArrowDown') target = Math.min(headings.length - 1, (current ?? window.start - 1) + 1);
    else if (event.key === 'ArrowUp') target = Math.max(0, (current ?? window.start + 1) - 1);
    else if (event.key === 'PageDown' || event.key === 'PageUp') {
      const host = container.current;
      if (host) target = heights.at(heights.offset(current ?? window.start) + host.clientHeight * (event.key === 'PageDown' ? 1 : -1));
    } else if (event.key === 'Tab' && current !== undefined) {
      const next = current + (event.shiftKey ? -1 : 1);
      if (next >= 0 && next < headings.length) target = next;
    }
    if (target !== undefined && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); move(target); }
  };
  const indexes = Array.from({ length: Math.max(0, Math.min(window.end, headings.length) - window.start) }, (_, index) => window.start + index);
  const focusIndex = focused ? ids.get(focused) : undefined;
  if (focusIndex !== undefined && !indexes.includes(focusIndex)) indexes.push(focusIndex);
  indexes.sort((a, b) => a - b);
  return <ol ref={list} data-limr-toc-windowed="" style={{ position: 'relative', height: heights.total }} onKeyDown={key}
    onFocusCapture={event => setFocused((event.target as HTMLElement).closest<HTMLElement>('[data-heading]')?.dataset.heading ?? null)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(null); }}>
    {indexes.map(index => <li key={headings[index].id} data-toc-index={index} aria-posinset={index + 1} aria-setsize={headings.length}
      style={{ position: 'absolute', top: heights.offset(index), insetInline: 0 }}>{render(headings[index])}</li>)}
  </ol>;
}
