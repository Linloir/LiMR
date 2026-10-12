import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Markdown, codeHighlight, gfm, type SelectionSnapshot } from '../src';
import { fixture } from '../benchmarks/fixture';

declare global {
  interface Window { selectionProbe: { updates: number; dragging: number; last: SelectionSnapshot | null } }
}
const extensions = [gfm(), codeHighlight()];

/** Isolated interaction benchmark: no app re-render on each selection event. */
export function SelectionBenchmarkFixture() {
  const params = new URLSearchParams(location.search);
  const count = Math.min(5000, Math.max(1, Number(params.get('sections') ?? 1000)));
  const code = params.get('kind') === 'code';
  const source = useMemo(() => code
    ? `# Code selection\n\n\`\`\`typescript\n${Array.from({ length: count }, (_, i) => `const value${i} = calculate(${i}, "Text 中文");`).join('\n')}\n\`\`\``
    : fixture(count), [code, count]);
  window.selectionProbe ??= { updates: 0, dragging: 0, last: null };
  const record = (selection: SelectionSnapshot | null) => {
    window.selectionProbe.updates++;
    if (selection && !selection.settled) window.selectionProbe.dragging++;
    window.selectionProbe.last = selection;
  };
  return <main style={{ maxWidth: 780, margin: '40px auto', padding: 24 }}>
    {params.get('renderer') === 'react-markdown'
      ? <article className="limr-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown></article>
      : <Markdown source={source} extensions={extensions} onSelectionChange={record} documentId="selection-benchmark" />}
  </main>;
}
