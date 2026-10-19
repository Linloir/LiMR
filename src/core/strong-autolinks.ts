import type { Construct, ConstructRecord, Effects, Extension, TokenizeContext } from 'micromark-util-types';

/** Is there an unmatched asterisk run that can supply a strong closer?
 * Only consulted when a URL's punctuation lookahead actually swallowed **.
 * Match the attention resolver's rule of three, including single-star nesting.
 * Already resolved links/spans no longer contain attentionSequence events. */
function hasOpenStrong(context: TokenizeContext, end: number): boolean {
  const stack: { size: number; close: boolean }[] = [];
  for (let index = 0; index < end; index++) {
    const [kind, token] = context.events[index];
    if (kind !== 'exit' || token.type !== 'attentionSequence' || context.sliceSerialize(token).charCodeAt(0) !== 42) continue;
    let size = token.end.offset - token.start.offset;
    if (token._close) for (let open = stack.length - 1; open >= 0 && size; open--) {
      const candidate = stack[open];
      if ((candidate.close || token._open) && size % 3 && (candidate.size + size) % 3 === 0) continue;
      const used = Math.min(candidate.size, size);
      size -= used;
      candidate.size -= used;
      // Intervening unmatched openers are inside the resolved span.
      stack.length = open + (candidate.size ? 1 : 0);
    }
    if (size && token._open) stack.push({ size, close: !!token._close });
  }
  return stack.some(candidate => candidate.size >= 2);
}

/** GFM checks whether URL punctuation is trailing. When that check consumed
 * ** and then rejected adjacent prose, accept the trail if it closes strong.
 * The original domain/path/trailing-punctuation grammar and its token positions
 * remain authoritative, including Unicode domains and balanced parentheses. */
export function strongAutolinks(extension: Extension): Extension {
  const guarded = new WeakMap<Construct, Construct>();
  const checked = new WeakMap<Construct, Construct>();
  const adapt = (construct: Construct, check = false): Construct => {
    const cache = check ? checked : guarded;
    const cached = cache.get(construct);
    if (cached) return cached;
    const result: Construct = { ...construct, tokenize(effects, ok, nok) {
      const start = this.now(), eventStart = this.events.length;
      const nested: Effects = { ...effects,
        attempt: (constructs, yes, no) => effects.attempt(map(constructs), yes, no),
        check: (constructs, yes, no) => effects.check(map(constructs, true), yes, no),
      };
      return construct.tokenize.call(this, nested, ok, check ? code => {
        const consumed = this.sliceSerialize({ start, end: this.now() });
        return consumed.includes('**') && hasOpenStrong(this, eventStart) ? ok(code) : nok(code);
      } : nok);
    } };
    cache.set(construct, result);
    return result;
  };
  const map = (constructs: Parameters<Effects['attempt']>[0], check = false): Parameters<Effects['attempt']>[0] => {
    if (Array.isArray(constructs)) return constructs.map(construct => adapt(construct, check));
    if ('tokenize' in constructs) return adapt(constructs as Construct, check);
    const result: ConstructRecord = {};
    for (const [code, value] of Object.entries(constructs)) {
      if (value) result[code] = Array.isArray(value) ? value.map(construct => adapt(construct, check)) : adapt(value, check);
    }
    return result;
  };
  const text: NonNullable<Extension['text']> = {};
  for (const [code, constructs] of Object.entries(extension.text ?? {})) {
    if (!constructs) continue;
    text[code] = (Array.isArray(constructs) ? constructs : [constructs]).map(construct =>
      construct.name === 'protocolAutolink' || construct.name === 'wwwAutolink' ? adapt(construct) : construct);
  }
  return { ...extension, text };
}
