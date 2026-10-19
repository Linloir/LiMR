import { attention } from 'micromark-core-commonmark';
import { classifyCharacter } from 'micromark-util-classify-character';
import type { Construct, Extension } from 'micromark-util-types';

/** LiMR's explicit **strong** runs may touch punctuation in any script.
 * Reuse CommonMark's delimiter resolver (nesting, rule of three, escapes and
 * leftover markers), changing only the flanking test for multi-asterisk runs.
 * Whitespace still prevents opening/closing; single * and _ keep their rules.
 * No source rewriting: every token retains its original UTF-16 coordinates. */
const strongAttention: Construct = {
  ...attention,
  tokenize(effects, ok, nok) {
    const previous = this.previous;
    return attention.tokenize.call(this, effects, code => {
      const token = this.events.at(-1)![1];
      if (token.end.offset - token.start.offset >= 2) {
        token._open = classifyCharacter(code) !== 1;
        token._close = classifyCharacter(previous) !== 1;
      }
      return ok(code);
    }, nok);
  },
};

export const strongSyntax: Extension = { text: { 42: strongAttention } };
