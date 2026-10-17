import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDocument, Markdown, standard } from '../src';
import { Image } from '../src/components/Image';
import { ImagePreview } from '../src/components/ImagePreview';

describe('shared image components', () => {
  it('preserves ordinary, reference and figure image source bindings and attributes', () => {
    const source = '![普通😀](a%20b.png "Image title")\n\n![Reference][picture]\n\n[picture]: diagram.svg "Reference title"\n\n<figure src="figure.png" alt="Figure" caption="Caption" />\n\n<img src="inline.png" alt="Inline image" title="Inline title" />\n';
    const html = renderToStaticMarkup(<Markdown source={source} />);
    expect(html).toContain('src="a%20b.png"');
    expect(html).toContain('alt="普通😀"');
    expect(html).toContain('title="Image title"');
    expect(html).toContain('src="diagram.svg"');
    expect(html).toContain('title="Reference title"');
    expect(html).toContain('src="figure.png"');
    expect(html).toContain('Caption');
    expect(html).toContain('src="inline.png"');
    expect(html).toContain('title="Inline title"');
    const snapshot = createDocument(source, { extensions: standard() }).getSnapshot();
    expect(snapshot.source).toBe(source);
    expect(snapshot.annotations).toEqual([]);
    expect(html).toContain('limr-atomic-image');
    expect(html).toContain('data-limr-image-preview="true"');
    expect(html).not.toContain('<dialog');
    expect(html).not.toContain('role="button"');
  });

  it('supports standalone SSR, opt-out and missing/unsafe image URLs', () => {
    const html = renderToStaticMarkup(<><Image src="photo.png" alt="Standalone" preview={false} /><Markdown source={'![Unresolved][missing]\n\n![Unsafe](javascript:alert)\n\n<img src="javascript:alert" alt="Unsafe tag" />'} /></>);
    expect(html).toContain('alt="Standalone"');
    expect(html).toContain('data-limr-image-preview="false"');
    expect(html).toContain('Unresolved');
    expect(html).not.toContain('src="javascript:');
    expect(html).not.toContain('role="button"');
    expect(renderToStaticMarkup(<ImagePreview image={{ src: 'photo.png', width: 100, height: 100 }} onClose={() => {}} />)).toBe('');
  });
});
