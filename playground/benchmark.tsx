import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Markdown, gfm } from '../src';
import { fixture } from '../benchmarks/fixture';

declare global {
  interface Window { limrBenchmark: (options: { renderer: 'limr' | 'react-markdown'; sections: number; stream?: boolean }) => Promise<{ characters: number; updates: number; totalMs: number; p95Ms: number; maxMs: number; elements: number }> }
}
const extensions = [gfm()];
export function BenchmarkFixture() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.limrBenchmark = async ({ renderer, sections, stream = false }) => {
      const root = createRoot(host.current!);
      const source = fixture(sections);
      const samples: number[] = [];
      const render = (value: string, streaming: boolean) => {
        const start = performance.now();
        flushSync(() => root.render(renderer === 'limr'
          ? <Markdown source={value} streaming={streaming} extensions={extensions} documentId="benchmark" />
          : <article className="limr-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown></article>));
        host.current!.getBoundingClientRect();
        samples.push(performance.now() - start);
      };
      if (stream) {
        render('', true);
        for (let i = 256; i < source.length + 256; i += 256) {
          render(source.slice(0, i), i < source.length);
          await new Promise(requestAnimationFrame);
        }
      } else render(source, false);
      const result = { characters: source.length, updates: samples.length, totalMs: samples.reduce((sum, value) => sum + value, 0), p95Ms: samples.sort((a, b) => a - b)[Math.floor(samples.length * .95)], maxMs: Math.max(...samples), elements: host.current!.querySelectorAll('*').length };
      await new Promise(requestAnimationFrame);
      flushSync(() => root.unmount());
      await new Promise(requestAnimationFrame);
      return result;
    };
  }, []);
  return <div className="demo-page" style={{ maxWidth: 900, margin: 'auto' }} ref={host} />;
}
