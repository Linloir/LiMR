import type { Extension, State, Tokenizer } from 'micromark-util-types';
import { tableLocalSyntax } from '../core/incremental-table';

/** Unresolved boundaries are literal data. Consume their reserved prefix before
 * MDX can interpret its '<' as a JSX opener. The one-colon form also covers the
 * remaining text after Markdown has decoded an escaped initial colon. */
const tokenize: Tokenizer = (effects, ok, nok) => {
  const suffix = '%%limr%%{';
  let index = 0;
  return start;
  function start(code: number | null) {
    if (code !== 58) return nok(code);
    effects.enter('data'); effects.consume(code);
    return second;
  }
  function second(code: number | null) {
    if (code === 58) { effects.consume(code); return prefix; }
    return prefix(code);
  }
  function prefix(code: number | null): ReturnType<State> {
    if (index < suffix.length) {
      if (code !== suffix.charCodeAt(index++)) return nok(code);
      effects.consume(code); return prefix;
    }
    if (code !== 60 && code !== 62) return nok(code);
    effects.consume(code); effects.exit('data'); return ok;
  }
};

export const sourceAnnotationTokenizer: Extension = tableLocalSyntax({ text: { 58: { name: 'limrAnnotationBoundary', tokenize,
  // Share directive-text's boundary rule: micromark chooses a break if *any*
  // colon construct accepts the previous character, then tries the whole list.
  previous(code) { return code !== 58 || this.events.at(-1)?.[1].type === 'characterEscape'; },
} } });
