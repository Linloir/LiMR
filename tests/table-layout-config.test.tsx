import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown, MarkdownTable, defineExtension, type NodeRenderer, type RendererParameters } from '../src';

const source = '| Name | Value |\n| :--- | ---: |\n| **Alpha** | 42 |';
const native = defineExtension({ name: 'native-tables', parameters: { tableLayout: false } });

describe('table layout configuration', () => {
  it('retains measured layout by default and with existing numeric options', () => {
    for (const tableLayout of [undefined, {}, { maxColumnWidth: 280 }]) {
      const html = renderToStaticMarkup(<Markdown source={source} parameters={{ tableLayout }} />);
      expect(html).toContain('limr-table-layout');
      expect(html).toContain('limr-table-marker-measure');
    }
  });
  it('renders native semantic tables with source content and alignment intact', () => {
    const html = renderToStaticMarkup(<Markdown source={source} parameters={{ tableLayout: false }} />);
    expect(html).toContain('data-table-layout="native"');
    expect(html).toContain('<thead>');
    expect(html).toContain('scope="col"');
    expect(html).toContain('text-align:right');
    expect(html).toContain('Alpha');
    expect(html).not.toContain('limr-table-cell-window');
    expect(html).not.toContain('limr-table-marker-measure');
    expect(html).not.toContain('<colgroup>');
  });
  it('uses the last plugin default, with explicit host overrides taking priority', () => {
    const adaptive = defineExtension({ name: 'adaptive-tables', parameters: { tableLayout: {} } });
    const render = (plugins = [native], parameters?: RendererParameters) => renderToStaticMarkup(<Markdown source={source} plugins={plugins} parameters={parameters} />);
    expect(render()).toContain('data-table-layout="native"');
    expect(render([adaptive, native])).toContain('data-table-layout="native"');
    expect(render([native, adaptive])).toContain('limr-table-layout');
    expect(render([native], { tableLayout: {} })).toContain('limr-table-layout');
    expect(render([adaptive], { tableLayout: false })).toContain('data-table-layout="native"');
  });
  it('lets a per-table renderer override both host and plugin configuration', () => {
    const Native: NodeRenderer = props => <MarkdownTable {...props} options={false} />;
    const Adaptive: NodeRenderer = props => <MarkdownTable {...props} options={{}} />;
    expect(renderToStaticMarkup(<Markdown source={source} components={{ table: Native }} />)).toContain('data-table-layout="native"');
    expect(renderToStaticMarkup(<Markdown source={source} plugins={[native]} parameters={{ tableLayout: false }} components={{ table: Adaptive }} />)).toContain('limr-table-layout');
  });
  it('does not call a measured planner during SSR', () => {
    const algorithm = vi.fn(() => { throw new Error('Browser measurements required'); });
    const html = renderToStaticMarkup(<Markdown source={source} parameters={{ tableLayout: { algorithm } }} />);
    expect(html).toContain('Alpha');
    expect(algorithm).not.toHaveBeenCalled();
  });
});
