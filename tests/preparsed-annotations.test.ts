import { describe, expect, it } from 'vitest';
import { createDocument } from '../src/core';
import { standard } from '../src/extensions';

// Foreign grammar hooks deliberately bypass raw-tree reuse. Compare complete
// semantic snapshots, including original UTF-16 positions and hidden syntax.
const compare = (source: string, streaming = false) => {
  const extensions = standard();
  const optimized = createDocument(source, { id: 'cache-parity', extensions, streaming }).getSnapshot();
  const ordinary = createDocument(source, { id: 'cache-parity', extensions: [...extensions, { name: 'foreign-grammar', micromark: [{}] }], streaming }).getSnapshot();
  expect(optimized).toEqual(ordinary);
};
const definition = '\n\n:::limr-annotation{id="note" type="footnote"}\nA **complete** note.\n:::\n';

describe('annotation grammar preparse reuse', () => {
  it('preserves cross-block ranges, nested formatting and reference definitions', () => {
    compare('::%%limr%%{<#note}First **paragraph**.\n\n- Second [link][target].\n- 中文 😀\n\nLast.::%%limr%%{>#note}' + definition + '\n[target]: https://example.test/\n');
  });
  it('keeps unauthorized and escaped boundaries literal', () => {
    compare('::%%limr%%{<#note}Valid::%%limr%%{>#note}\n\n::%%limr%%{<#missing}Not removed::%%limr%%{>#missing}\n\\::%%limr%%{<#note}' + definition);
  });
  it('does not authorize definitions inside code or unknown JSX', () => {
    compare('::%%limr%%{<#note}Literal::%%limr%%{>#note}\n\n```md' + definition + '\n```');
    compare('::%%limr%%{<#note}Literal::%%limr%%{>#note}\n\n<unknown>' + definition + '\n</unknown>');
  });
  it('preserves complete and incomplete streaming pairs', () => {
    compare('::%%limr%%{<#note}Streaming text::%%limr%%{>#note}' + definition, true);
    compare('::%%limr%%{<#note}Streaming text::%%limr%%{>#note}' + definition.slice(0, -4), true);
  });
});
