import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createDocument, walk, rangeOf } from '../src/core';
import { Markdown, standard, useRendererParameter, type RendererExtension } from '../src';
import { defaultFigureLimits, figureColumns } from '../src/extensions/figure-layout';

declare module '@linloir/limr' { interface RendererParameters { exampleDensity?: number } }

describe('figure layout', () => {
  const square = { ratio: 1, limits: defaultFigureLimits };
  it('waits until a saturated column and another minimum-sized image fit', () => {
    expect(figureColumns(700, [square, square, square], 16)).toBe(1);
    expect(figureColumns(716, [square, square, square], 16)).toBe(2);
    expect(figureColumns(1212, [square, square, square], 16)).toBe(3);
  });
  it('protects the minimum height of wide figures and releases forced columns on narrow containers', () => {
    const wide = { ratio: 3, limits: defaultFigureLimits };
    expect(figureColumns(700, [wide, wide], 16, 2)).toBe(1);
    expect(figureColumns(736, [wide, wide], 16, 2)).toBe(2);
    expect(figureColumns(300, [wide, wide], 16, 2, false)).toBe(2);
  });
  it('preserves one column with no upper limits unless a grid is requested', () => {
    const free = { ratio: 1, limits: { ...defaultFigureLimits, maxWidth: Infinity, maxHeight: Infinity } };
    expect(figureColumns(2000, [free, free], 16)).toBe(1);
    expect(figureColumns(2000, [free, free], 16, 2)).toBe(2);
  });
});

describe('default media and translations modules', () => {
  it('wraps standalone HTML images as figures while preserving their whole atomic source', () => {
    const source = '<img src="media/limr-icon.png" alt="LiMR" width="96" />';
    const snapshot = createDocument(source, { extensions: standard() }).getSnapshot();
    const figure = snapshot.blocks[0].node, image = figure.children![0];
    expect(figure.name).toBe('figure');
    expect(image.name).toBe('img');
    expect(image.selection).toBe('atomic');
    expect(source.slice(rangeOf(image).start, rangeOf(image).end)).toBe(source);
    const html = renderToString(<Markdown source={source} />);
    expect(html).toContain('--limr-figure-width:96px');
    expect(html).toContain('width="96"');
    expect(html).toContain('limr-figure-copy');
    for (const text of ['Before ' + source + ' after.', '<figure>\n\n' + source + '\n\n</figure>']) {
      const rendered = renderToString(<Markdown source={text} />);
      expect(rendered.match(/class="limr-figure"/g)?.length ?? 0).toBe(text.startsWith('Before') ? 0 : 1);
      expect(rendered).toContain('width="96"');
    }
  });

  const source = '<figures columns="2">\n\n<figure src="/one.png" caption="Mapped caption" />\n\n<figure>\n\n![Two](/two.png)\n\n<figcaption>**Second** caption.</figcaption>\n\n</figure>\n\n</figures>\n\n<translations default="both">\n\n<origin>\n\nOriginal **text**.\n\n</origin>\n\n<translation>\n\n翻译 **正文**。\n\n</translation>\n\n</translations>';
  it('parses figures, captions and both language trees without losing source offsets', () => {
    const snapshot = createDocument(source, { extensions: standard() }).getSnapshot();
    expect(snapshot.diagnostics).toEqual([]);
    const texts: string[] = [];
    for (const block of snapshot.blocks) walk(block.node, node => { if (node.type === 'text') { const range = rangeOf(node); texts.push(source.slice(range.start, range.end)); } });
    expect(texts).toEqual(expect.arrayContaining(['Original ', 'text', '翻译 ', '正文', 'Second']));
    expect(snapshot.annotations).toEqual([]);
    expect(snapshot.occurrences).toEqual([]);
    const html = renderToString(<Markdown source={source} />);
    expect(html).toContain('limr-figures-grid');
    expect(html).toContain('Mapped caption');
    expect(html).toContain('data-mode="both"');
    expect(html.indexOf('翻译 ')).toBeLessThan(html.indexOf('Original '));
    expect(html).toContain('Copy image');
    expect(html).not.toContain('limr-literal');
  });
  it('keeps default and overridden parameters isolated between documents', () => {
    const Density = () => <span>density:{useRendererParameter('exampleDensity')}</span>;
    const plugin: RendererExtension = { name: 'density', tags: ['density'], parameters: { exampleDensity: 2 }, components: { density: Density } };
    expect(renderToString(<Markdown source="<density />" plugins={[plugin]} />)).toContain('density:<!-- -->2');
    expect(renderToString(<Markdown source="<density />" plugins={[plugin]} parameters={{ exampleDensity: 7 }} />)).toContain('density:<!-- -->7');
    const html = renderToString(<Markdown source={source} parameters={{ translationMode: 'translation' }} />);
    expect(html).toContain('data-mode="translation"');
    expect(html).toContain('controlled by display settings');
  });
  it('supports directive forms and recovers complete streaming output', () => {
    const input = ':::figures{columns="2"}\n::figure{src="/one.png" caption="One"}\n::figure{src="/two.png"}\n:::\n\n:::translations{default="translation"}\n::origin[Original]\n::translation[译文]\n:::';
    const extensions = standard();
    const stream = createDocument('', { extensions, streaming: true });
    for (let at = 0; at < input.length; at += 9) stream.update(input.slice(0, at + 9), { streaming: true });
    expect(stream.finish().blocks.map(block => block.node)).toEqual(createDocument(input, { extensions }).getSnapshot().blocks.map(block => block.node));
    const html = renderToString(<Markdown source={input} />);
    expect(html).toContain('limr-figures-grid');
    expect(html).toContain('data-mode="translation"');
  });
  it('keeps the switch accessible when a completed language section is empty', () => {
    const html = renderToString(<Markdown source={'<translations>\n\n<origin></origin>\n\n<translation>Available text.</translation>\n\n</translations>'} />);
    expect(html).toContain('data-translation-switch');
  });
});
