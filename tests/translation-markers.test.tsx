import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown, chinese, english, standard, type RendererExtension } from '../src';
import { TranslationBlock, type TranslationMode } from '../src/extensions/translations';

const pair = (body: string, mode: TranslationMode = 'origin') => `<translations default="${mode}">\n\n<origin>\n\n${body}\n\n</origin>\n\n<translation>\n\n${body.replaceAll('Final', '最后')}\n\n</translation>\n\n</translations>`;

describe('translation trailing markers', () => {
  it.each([
    ['tight list', '- First\n- Final'],
    ['ordered list', '1. First\n2. Final'],
    ['loose list', '- First\n\n- Final'],
    ['nested list', '- First\n  - Final'],
    ['task list', '- [ ] First\n- [x] Final'],
    ['loose task list', '- [ ] First\n\n- [x] Final'],
    ['nested blockquote', '> - First\n> - Final'],
  ])('places the switch inside the last item of a %s', (_name, body) => {
    const html = renderToStaticMarkup(<Markdown source={pair(body)} />);
    const text = html.lastIndexOf('Final'), marker = html.indexOf('data-translation-switch');
    expect(marker).toBeGreaterThan(text);
    expect(marker).toBeLessThan(html.indexOf('</li>', text));
    expect(html.match(/data-translation-switch/g)).toHaveLength(1);
    if (body.includes('[x]')) expect(html.lastIndexOf('</label>', marker)).toBeGreaterThan(text);
  });

  it.each(['- Final **word**', '- Final [link](https://example.com)', '- Final `code`'])('keeps the marker outside inline syntax: %s', body => {
    const html = renderToStaticMarkup(<Markdown source={pair(body)} />), marker = html.indexOf('data-translation-switch');
    const closing = body.includes('**') ? '</strong>' : body.includes('[link]') ? '</a>' : '</code>';
    expect(html.lastIndexOf(closing, marker)).toBeGreaterThan(html.lastIndexOf('Final'));
    expect(marker).toBeLessThan(html.indexOf('</li>', html.lastIndexOf('Final')));
  });

  it('keeps blockquotes, empty sections and block-only fallbacks usable', () => {
    const quote = renderToStaticMarkup(<Markdown source={pair('> Final')} />);
    expect(quote.indexOf('data-translation-switch')).toBeLessThan(quote.indexOf('</p>', quote.lastIndexOf('Final')));
    const code = renderToStaticMarkup(<Markdown source={pair('```\nFinal\n```')} />);
    expect(code.indexOf('data-translation-switch')).toBeGreaterThan(code.lastIndexOf('</pre>'));
    expect(renderToStaticMarkup(<Markdown source={pair('')} />)).toContain('data-translation-switch');
  });

  it('supports controlled blocks and locale templates without changing the source', () => {
    const source = pair('- Final');
    const controlled: RendererExtension = { name: 'controlled-translations', components: { translations: props => <TranslationBlock {...props} mode="translation" onModeChange={() => {}} /> } };
    const html = renderToStaticMarkup(<Markdown source={source} locale={english} extensions={[...standard(), controlled]} parameters={{ translationMode: 'both' }} />);
    expect(html).toContain('data-mode="translation"');
    expect(html).toContain('Showing translation; switch to bilingual');
    expect(html).not.toContain('disabled=""');
    expect(renderToStaticMarkup(<Markdown source={source} locale={chinese} />)).toContain('当前原文，切换到译文');
    expect(renderToStaticMarkup(<Markdown source={source} locale={{ translationSwitchLabel: '{next} after {mode}' }} />)).toContain('translation after original');
    const locked = renderToStaticMarkup(<Markdown source={source} locale={english} parameters={{ translationMode: 'both' }} />);
    expect(locked).toContain('Showing bilingual; controlled by display settings');
    expect(locked).toContain('disabled=""');
  });
  it('uses the same persistent per-block mode as unmounted reading and permits host updates', () => {
    const source = pair('- Final');
    const parameters = { translationMode: 'origin' as const, translationModeForNode: () => 'translation' as const };
    const locked = renderToStaticMarkup(<Markdown source={source} parameters={parameters} />);
    expect(locked).toContain('data-mode="translation"');
    expect(locked).toContain('disabled=""');
    const controlled = renderToStaticMarkup(<Markdown source={source} parameters={{ ...parameters, onTranslationBlockModeChange: () => {} }} />);
    expect(controlled).toContain('data-mode="translation"');
    expect(controlled).not.toContain('disabled=""');
  });
});
