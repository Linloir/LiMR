import { useState } from 'react';
import { Markdown, Reader, chinese, english, standard, type Annotation, type SelectionSnapshot, type TranslationMode } from '../src';
import { readingNotes } from '../examples/notes';

const photo = `${import.meta.env.BASE_URL}papers/feature-channel.png`;
// This fixture also exercises the optional traditional endnote navigation.
const mediaExtensions = standard().filter(module => module.name !== 'footnotes');
export const mediaSource = `# Figures and translations

[Jump to figure](#target-figure) · Footnote[^note]

<figures id="auto-grid">

<figure src="${photo}" caption="First panel" />
<figure src="${photo}" caption="Second panel" />
<figure src="${photo}" caption="Third panel" />

<figcaption>A group caption with **Markdown**.</figcaption>

</figures>

<figures id="manual-grid" columns="3" rows="1">

<figure src="${photo}" />
<figure src="${photo}" />
<figure src="${photo}" />

</figures>

<figures id="fixed-grid" columns="3" responsive="false">

<figure src="${photo}" />
<figure src="${photo}" />
<figure src="${photo}" />

</figures>

<translations default="origin">

<origin>

Original **source-mapped text** with a [link](#target-figure).

</origin>

<translation>

译文包含 **可选择的内容**。

另一段译文，用于观察展开时下方正文的移动。

</translation>

</translations>

## Following paragraph

${Array.from({ length: 12 }, () => 'Following text makes a longer reading surface. '.repeat(8)).join('\n\n')}

<figure id="target-figure" max-height="180" src="${photo}" caption="Destination" />

[^note]: A footnote destination.
`;
export function MediaFixture() {
  const [width, setWidth] = useState(900);
  const [mode, setMode] = useState<TranslationMode | undefined>();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const nested = new URLSearchParams(location.search).has('nested');
  return <>
    <div><label>Width<input aria-label="Reader width" type="number" value={width} onChange={event => setWidth(Number(event.target.value))} /></label><select aria-label="Translation mode" value={mode ?? 'local'} onChange={event => setMode(event.target.value === 'local' ? undefined : event.target.value as TranslationMode)}><option value="local">Local</option><option value="origin">Origin</option><option value="translation">Translation</option><option value="both">Both</option></select></div>
    <div ref={nested ? setRoot : undefined} data-testid="media-scroll" style={{ width: '100%', height: nested ? 520 : undefined, overflow: nested ? 'auto' : undefined }}>
      <div style={{ width, maxWidth: '100%', margin: '0 auto' }}><Reader source={mediaSource} extensions={mediaExtensions} scrollRoot={nested ? root : null} toc={false} sidebar={false} parameters={{ translationMode: mode, onTranslationModeChange: setMode }} /></div>
    </div>
    <div data-testid="isolated"><Markdown source={'<translations>\n\n<origin>Isolated original</origin>\n\n<translation>独立译文</translation>\n\n</translations>'} /></div>
  </>;
}

export function TranslationDetailsFixture() {
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const source = '<translations>\n\n<origin>\n\n## Original heading\n\n<ref id="paired">Original **selectable** words.</ref>\n\n</origin>\n\n<translation>\n\n## 译文标题\n\n<ref id="paired">中文 **可选择** 内容。</ref>\n\n</translation>\n\n</translations>\n\n<citation id="paired" title="Paired reference" description="Only visible occurrences belong in the sidebar." />';
  return <><Reader source={source} onSelectionChange={setSelection} /><output data-testid="translation-selection" hidden>{JSON.stringify(selection)}</output></>;
}

const translationSelectionSource = `Before the translation, ordinary text remains selectable.

Another ordinary paragraph before the boundary.

<translations default="both">

<origin>

First original paragraph has **mapped English words**.

</origin>

<translation>

第一段中文译文包含**可选择的文字**。

同一区域内的第二段译文也可以选择。

</translation>

</translations>

<translations default="both">

<translation>

第二段中文译文使用不同的源码顺序。

</translation>

<origin>

Second original paragraph uses the other source order.

</origin>

</translations>

After the translation, ordinary text remains selectable.

Another ordinary paragraph after the boundary.`;
const crossTranslationHighlight: Annotation = {
  id: 'cross-translation', type: 'highlight',
  range: { start: translationSelectionSource.indexOf('First original'), end: translationSelectionSource.indexOf('同一区域') + '同一区域'.length },
  data: { color: '#F2C744', style: 'background' },
};
export function TranslationSelectionFixture() {
  const params = new URLSearchParams(location.search);
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const [annotations, setAnnotations] = useState<readonly Annotation[]>(params.has('annotated') ? [crossTranslationHighlight] : []);
  const [mode, setMode] = useState<TranslationMode>('both');
  const [boundary, setBoundary] = useState<boolean | undefined>();
  return <div style={{ maxWidth: 800, margin: '24px auto' }}>
    <button onClick={() => setAnnotations([crossTranslationHighlight])}>Add crossing annotation</button>
    <label><input type="checkbox" aria-label="Translation selection boundary" checked={boundary !== false} onChange={event => setBoundary(event.target.checked)} />Translation selection boundary</label>
    <select aria-label="Translation mode" value={mode} onChange={event => setMode(event.target.value as TranslationMode)}><option value="both">Both</option><option value="origin">Origin</option><option value="translation">Translation</option></select>
    <Reader source={translationSelectionSource} locale={params.has('english') ? english : chinese} toc={false} sidebar={false} typography={params.has('kp') ? 'knuth-plass' : 'normal'} parameters={{ translationMode: mode, translationSelectionBoundary: boundary }} annotations={annotations} onAnnotationsChange={setAnnotations} onSelectionChange={setSelection} />
    <output data-testid="translation-selection" hidden>{JSON.stringify(selection)}</output>
    <output data-testid="translation-annotations" hidden>{JSON.stringify(annotations)}</output>
  </div>;
}

const mediaNotes = [readingNotes()];
const annotationSource = `Before the figures.

<figures id="annotation-grid" columns="2" responsive="false" max-width="300" max-height="300" min-width="80" min-height="60">

<figure id="first-panel" src="${import.meta.env.BASE_URL}papers/feature-channel.png" caption="First panel caption." />

<figure id="second-panel">

![Wide panel](${import.meta.env.BASE_URL}papers/feature-diversity.png)

<figcaption>Second **panel caption**.</figcaption>

</figure>

<figcaption>Overall **group caption**.</figcaption>

</figures>

<figure id="attribute-order" caption="Caption before source." src="${import.meta.env.BASE_URL}papers/feature-neuron.png" max-height="120" />

After the figures.

$$
x^* = \\arg\\max_x a_c(x)
$$

标记应当紧跟前面的文字，最后一个字符和多个角标一起换行。

English markers follow the final word.

<translations>

<origin>Translation controls follow the final word.</origin>

<translation>译文状态的图标同样跟随末尾文字。</translation>

</translations>`;
export function MediaAnnotationFixture() {
  const [width, setWidth] = useState(800);
  const [count, setCount] = useState(1);
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const seeded: Annotation[] = ['一起换行。', 'final word.'].flatMap((text, paragraph) => {
    const start = annotationSource.indexOf(text);
    return Array.from({ length: count }, (_, index) => ({ id: `line-${paragraph}-${index}`, type: 'citation', range: { start, end: start + text.length }, data: { title: `Line note ${index + 1}` } }));
  });
  return <>
    <div><label>Width<input aria-label="Reader width" type="number" value={width} onChange={event => setWidth(Number(event.target.value))} /></label><label>Markers<input aria-label="Marker count" type="number" value={count} onChange={event => setCount(Number(event.target.value))} /></label></div>
    <div style={{ width, maxWidth: '100%', marginInline: 'auto' }}><Reader documentId="media-annotations" source={annotationSource} locale={chinese} plugins={mediaNotes} toc={false} sidebar={false} annotations={[...seeded, ...annotations]} onAnnotationsChange={value => setAnnotations(value.filter(item => !item.id.startsWith('line-')))} onSelectionChange={setSelection} /></div>
    <output data-testid="media-selection" hidden>{JSON.stringify(selection)}</output>
    <output data-testid="media-annotations" hidden>{JSON.stringify(annotations)}</output>
  </>;
}
