import { directive } from 'micromark-extension-directive';
import { classifyCharacter } from 'micromark-util-classify-character';
import type { Construct, Extension, State } from 'micromark-util-types';

/** Reject unknown names before directive parsing can claim ordinary text
 * (http:www.example.com, 12:30, etc.). The upstream grammar still owns labels,
 * attributes and containers. Use the same whitelist in annotation discovery. */
export function registeredDirectives(names: ReadonlySet<string>): Extension {
  const syntax = directive();
  const maxLength = Math.max(0, ...[...names].map(name => name.length));
  const nameCheck: Construct = { partial: true, tokenize(effects, ok, nok) {
    let name = '';
    const start: State = code => {
      if (code === 58) { effects.consume(code); return start; }
      return inside(code);
    };
    const inside: State = code => {
      if (code !== null && (classifyCharacter(code) === undefined || code === 45 || code === 95)) {
        name += String.fromCharCode(code);
        if (name.length > maxLength) return nok(code);
        effects.consume(code);
        return inside;
      }
      if (!names.has(name)) return nok(code);
      effects.exit('data');
      return ok(code);
    };
    return code => { effects.enter('data'); return start(code); };
  } };
  const guard = (construct: Construct): Construct => ({ ...construct, tokenize(effects, ok, nok) {
    return effects.check(nameCheck, code => construct.tokenize.call(this, effects, ok, nok)(code), nok);
  } });
  for (const hook of ['text', 'flow'] as const) {
    const constructs = syntax[hook]![58]!;
    syntax[hook] = { ...syntax[hook], 58: (Array.isArray(constructs) ? constructs : [constructs]).map(guard) };
  }
  return syntax;
}
