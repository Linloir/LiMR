import { createHash } from 'node:crypto';

/** Ordered graph fingerprint: own-key order, holes, Maps and shared node
 * identity are part of parity, in addition to every source-position field.
 * The traversal Map is released before returning any benchmark evidence. */
export function parserGraphFingerprint(value: unknown): { sha256: string; objects: number; aliases: number } {
  const hash = createHash('sha256'), seen = new Map<object, number>();
  let aliases = 0;
  const visit = (item: unknown): void => {
    if (item === null || typeof item !== 'object') {
      const scalar = typeof item === 'bigint' || typeof item === 'symbol' || typeof item === 'function' ? String(item)
        : typeof item === 'number' && (!Number.isFinite(item) || Object.is(item, -0)) ? String(Object.is(item, -0) ? '-0' : item) : item;
      hash.update(JSON.stringify([typeof item, scalar])); return;
    }
    const known = seen.get(item);
    if (known !== undefined) { hash.update(JSON.stringify(['ref', known])); aliases++; return; }
    const id = seen.size; seen.set(item, id);
    if (item instanceof Map) {
      hash.update(JSON.stringify(['map', id, item.size]));
      for (const [key, entry] of item) { visit(key); visit(entry); }
      return;
    }
    if (item instanceof Set) {
      hash.update(JSON.stringify(['set', id, item.size])); for (const entry of item) visit(entry); return;
    }
    const keys = Object.keys(item);
    hash.update(JSON.stringify([Array.isArray(item) ? 'array' : 'object', id, Array.isArray(item) ? item.length : undefined, keys]));
    for (const key of keys) visit((item as Record<string, unknown>)[key]);
  };
  visit(value);
  const result = { sha256: hash.digest('hex'), objects: seen.size, aliases };
  seen.clear();
  return result;
}
