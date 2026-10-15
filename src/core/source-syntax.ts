import type { Extension } from 'micromark-util-types';

const autolinks = new WeakMap<Extension, Map<number, Extension>>();

/** Register only the bundled GFM tokenizer. Third-party tokenizer objects and
 * their compiler hooks retain the complete token stream they supplied. */
export function sourceAwareAutolinks<T extends Extension>(extension: T): T {
  autolinks.set(extension, new Map([[7, extension]]));
  return extension;
}

/** Literal autolinks require these exact characters in the undecoded input.
 * Without them, GFM's email tokenizer still retries on every ASCII word. Omit
 * only attempts that cannot succeed; mdast's decoded-text transform is retained
 * so character references and escapes keep their ordinary GFM semantics. */
export function syntaxForSource(extension: Extension, source: string): Extension {
  const variants = autolinks.get(extension);
  if (!variants) return extension;
  const mask = (source.includes('@') ? 1 : 0) | (/www\./i.test(source) ? 2 : 0) | (/https?:\/\//i.test(source) ? 4 : 0);
  const cached = variants.get(mask);
  if (cached) return cached;
  const text: NonNullable<Extension['text']> = {};
  for (const [code, constructs] of Object.entries(extension.text ?? {})) {
    if (!constructs) continue;
    const retained = (Array.isArray(constructs) ? constructs : [constructs]).filter(construct => {
      switch (construct?.name) {
        case 'emailAutolink': return !!(mask & 1);
        case 'wwwAutolink': return !!(mask & 2);
        case 'protocolAutolink': return !!(mask & 4);
        default: return true;
      }
    });
    if (retained.length) text[code] = retained;
  }
  const result = { ...extension, text };
  variants.set(mask, result);
  return result;
}
