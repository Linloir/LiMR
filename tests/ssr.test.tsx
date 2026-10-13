import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { forwardRef, memo } from 'react';
import { Markdown, Reader, DocumentProvider, TableOfContents, defineBlock, standard, preloadMath } from '../src';

describe('server rendering and plugin isolation', () => {
  it('supports opt-in justification on readers, standalone Markdown and shared providers', () => {
    expect(renderToString(<Markdown source="Paragraph" />)).toContain('data-limr-justify="false"');
    expect(renderToString(<Markdown source="Paragraph" justify />)).toContain('data-limr-justify="true"');
    expect(renderToString(<Reader source="Paragraph" justify />)).toContain('data-limr-justify="true"');
    expect(renderToString(<DocumentProvider source="Paragraph" justify><Markdown /></DocumentProvider>)).toContain('data-limr-justify="true"');
    expect(renderToString(<DocumentProvider source="Paragraph" justify><Markdown justify={false} /></DocumentProvider>)).toContain('data-limr-justify="false"');
  });
  it('renders Markdown and shared TOC without a browser', () => {
    const html = renderToString(<DocumentProvider source={'# Hello\n\n**world**'} documentId="server"><TableOfContents /><Markdown /></DocumentProvider>);
    expect(html).toContain('server-hello'); expect(html).toContain('<strong>'); expect(html).toContain('world');
  });
  it('supports custom tag components through the public API', () => {
    const extensions = [...standard(), defineBlock({ name: 'notice', component: ({ children }) => <aside data-custom="true">{children}</aside> })];
    const html = renderToString(<Markdown source={'<notice>\n\n**Inside**\n\n</notice>'} extensions={extensions} />);
    expect(html).toContain('data-custom="true"'); expect(html).toContain('<strong>');
  });
  it('treats unknown HTML as inert text and rejects dangerous URLs', () => {
    const html = renderToString(<Markdown source={'<script>alert(1)</script>\n\n[link](javascript:alert%281%29)'} />);
    expect(html).not.toContain('<script>'); expect(html).not.toContain('href="javascript:');
  });
  it('renders full accessible math in synchronous SSR after optional preload', async () => {
    await preloadMath();
    const html = renderToString(<Markdown source={'$x^2$\n\n$$\nx^2\n$$'} />);
    expect(html).toContain('katex-mathml');
    expect(html).toContain('Copy LaTeX');
  });
  it('accepts memo and forwardRef icon components for custom annotation types', () => {
    const Icon = memo(forwardRef<SVGSVGElement>((_, ref) => <svg ref={ref} data-custom-icon="true" />));
    const html = renderToString(<Markdown source="Text" annotations={[{ id: 'a', type: 'custom', range: { start: 0, end: 4 } }]} annotationTypes={[{ type: 'custom', label: 'Custom', icon: Icon }]} />);
    expect(html).toContain('data-custom-icon="true"');
  });
});
