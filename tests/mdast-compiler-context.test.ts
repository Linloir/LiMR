import { expect, it } from 'vitest';
import { fromMarkdown, type CompileContext, type Options } from 'mdast-util-from-markdown';
import { parse, postprocess, preprocess } from 'micromark';
import { createMarkdownCompiler } from '../src/core/micromark/mdast-compiler.js';
import { fromMarkdownBounded } from '../src/core/bounded-markdown';

const source = 'First **emphasis**.\n\nSecond [link](/url).\n\nThird.\n';
const captured = () => {
  const contexts: CompileContext[] = [], values: string[] = [], later: (() => string)[] = [];
  const options: Options = { mdastExtensions: [{ enter: { paragraph(token) {
    contexts.push(this); values.push(this.sliceSerialize(token)); later.push(() => this.sliceSerialize(token));
    this.enter({ type: 'paragraph', children: [] }, token);
  } } }] };
  return { contexts, values, later, options };
};
it('keeps fresh stable hook contexts by default and for foreign parser extensions', () => {
  for (const method of ['compiler', 'adapter'] as const) {
    const { contexts, values, later, options } = captured();
    const actual = method === 'compiler'
      ? createMarkdownCompiler(options).compile(postprocess(parse(options).document().write(preprocess()(source, undefined, true))))
      : fromMarkdownBounded(source, options, { targetSize: 1 });
    expect(actual).toStrictEqual(fromMarkdown(source));
    expect(contexts).toHaveLength(3); expect(new Set(contexts).size).toBe(3);
    expect(later.map(read => read())).toStrictEqual(values);
  }
});
it('reuses the hook wrapper only under the explicit audited-handler opt-in', () => {
  const { contexts, options } = captured();
  const compiler = createMarkdownCompiler(options, true);
  const actual = compiler.transform(compiler.compile(postprocess(parse(options).document().write(preprocess()(source, undefined, true)))));
  expect(actual).toStrictEqual(fromMarkdown(source));
  expect(contexts).toHaveLength(3); expect(new Set(contexts).size).toBe(1);
});
