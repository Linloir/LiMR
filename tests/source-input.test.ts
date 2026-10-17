import { describe, expect, it, vi } from 'vitest';
import { decodeDocumentInput } from '../src/core/source-input';

describe('cooperative and dedicated-worker decoding', () => {
  it('preserves malformed UTF-8, BOM, CRLF, astral text and checkpoints with either schedule', async () => {
    const bytes = new Uint8Array(256 * 1024 + 32).fill(65);
    bytes.set(new TextEncoder().encode('\uFEFFFirst\r\n'));
    bytes.set(new TextEncoder().encode('中文🪶\r\n'), 256 * 1024 - 4);
    bytes.set([0xf0, 0x9f, 0xff, 0x80, 66, 0xe2, 0x82], bytes.length - 7);
    const original = bytes.slice();
    const regular = await decodeDocumentInput(bytes);
    const worker = await decodeDocumentInput(bytes, undefined, undefined, { cooperative: false });
    expect(worker).toEqual(regular);
    expect(worker.source).toBe(new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes));
    expect(worker.sourceIndex!.checkpoints).toHaveLength(3);
    expect(bytes).toEqual(original);
  });

  it('omits decoding timers only when the caller explicitly owns off-thread scheduling', async () => {
    const bytes = new Uint8Array(300_000).fill(65), timer = vi.spyOn(globalThis, 'setTimeout');
    try {
      await decodeDocumentInput(bytes, undefined, undefined, { cooperative: false });
      expect(timer).not.toHaveBeenCalled();
      await decodeDocumentInput(bytes);
      expect(timer).toHaveBeenCalledTimes(2);
    } finally { timer.mockRestore(); }
  });

  it('keeps default decoding interruptible between chunks', async () => {
    const bytes = new Uint8Array(1024 * 1024).fill(65), controller = new AbortController();
    const progress: number[] = [];
    const timer = setTimeout(() => controller.abort(), 0);
    try {
      await expect(decodeDocumentInput(bytes, controller.signal, value => progress.push(value.loaded))).rejects.toMatchObject({ name: 'AbortError' });
      expect(progress).toEqual([256 * 1024]);
      expect(bytes.length).toBe(1024 * 1024); expect(bytes[0]).toBe(65);
    } finally { clearTimeout(timer); }
  });

  it('still checks cancellation before input and after progress callbacks without yielding', async () => {
    const bytes = new Uint8Array(300_000).fill(65), controller = new AbortController();
    await expect(decodeDocumentInput(bytes, controller.signal, () => controller.abort(), { cooperative: false })).rejects.toMatchObject({ name: 'AbortError' });
    const progress = vi.fn();
    await expect(decodeDocumentInput(bytes, controller.signal, progress, { cooperative: false })).rejects.toMatchObject({ name: 'AbortError' });
    expect(progress).not.toHaveBeenCalled();
  });
});
