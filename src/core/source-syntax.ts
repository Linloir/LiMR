import type { Construct, Extension } from 'micromark-util-types';

interface BundledSyntax { variants: Map<number, Extension>; tables: ReadonlySet<Construct> }
const bundledSyntax = new WeakMap<Extension, BundledSyntax>();

/** Register only the bundled GFM tokenizer. Third-party tokenizer objects and
 * their compiler hooks retain the complete token stream they supplied. */
export function sourceAwareAutolinks<T extends Extension>(extension: T): T {
  const flow = extension.flow?.null;
  const tables = new Set<Construct>();
  // Registration is only called for the shipped GFM object. Preserve the
  // actual construct identities: later objects named 'table' are not ours.
  for (const construct of Array.isArray(flow) ? flow : flow ? [flow] : []) {
    if (construct.name === 'table') tables.add(construct);
  }
  bundledSyntax.set(extension, { variants: new Map([[15, extension]]), tables });
  return extension;
}

/** Literal autolinks require these exact characters in the undecoded input.
 * Without them, GFM's email tokenizer still retries on every ASCII word. Omit
 * only attempts that cannot succeed; mdast's decoded-text transform is retained
 * so character references and escapes keep their ordinary GFM semantics. */
export function syntaxForSource(extension: Extension, source: string): Extension {
  const registered = bundledSyntax.get(extension);
  if (!registered) return extension;
  const { variants, tables } = registered;
  // A GFM delimiter needs a pipe or a colon touching its hyphen filler.
  // In particular, pipe-free single-column tables must remain possible.
  const tablePossible = source.includes('|') || source.includes(':-') || source.includes('-:');
  const mask = (source.includes('@') ? 1 : 0) | (/www\./i.test(source) ? 2 : 0) | (/https?:\/\//i.test(source) ? 4 : 0) | (tablePossible ? 8 : 0);
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
  let flow = extension.flow;
  if (!(mask & 8) && tables.size && flow?.null) {
    const constructs = flow.null;
    const retained = (Array.isArray(constructs) ? constructs : [constructs]).filter(construct => !tables.has(construct));
    flow = { ...flow };
    if (retained.length) flow.null = retained;
    else delete flow.null;
  }
  const result = { ...extension, text, flow };
  variants.set(mask, result);
  return result;
}
