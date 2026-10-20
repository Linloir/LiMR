# Extension development

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/extensions) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/extensions.md)

Start with [built-in modules](integration.md#modules-and-configuration) for module objects, factories, names, Markdown tags, and the difference between `extensions` and `plugins`.

## Choose an interface

| Need | Interface |
| --- | --- |
| A new block with Markdown content | defineBlock |
| A standalone annotation type | defineAnnotation |
| Combined syntax, annotations, actions, and parameters | defineExtension / RendererExtension |
| A different view for existing nodes or a matching subset | components / rendererOverrides |
| Disable or replace table layout calculation | parameters.tableLayout: false or { algorithm }; see [table layout](table-layout.md) |
| Code folding, wrapping and line-number defaults | parameters.codeBlock / codeHighlight(options); see [code controls](syntax.md#code-block-controls) |
| New parsing rules | micromark + mdast, with transform when needed |
| Visual changes only | CSS theme package + appearance |

These APIs are publicly exported from @linloir/limr. Third-party packages must not import src/dist internals or non-public helpers such as useRuntime. See [plugin packages](extensions.md#package-and-integrate) for a complete standalone starter.

Check existing parameters and CSS variables first; use components / rendererOverrides when the view must change. Add a plugin for new content forms, reusable cards or actions. Export reusable capabilities as factories while keeping files, services and persistence in the host. A plugin supplying only `parameters.codeBlock` is still a RendererExtension and needs neither a new parser nor Worker registration.

## Append, remove, and replace defaults

```tsx
import { Reader, standard, replaceExtension, video, defineBlock } from '@linloir/limr';

const extensions = replaceExtension(standard(), video({ loading: 'click' }));
const plugins = [defineBlock({
  name: 'reading-tip',
  component: ({ children }) => <aside className="reading-tip">{children}</aside>,
})];

export function Article({ source }: { source: string }) {
  return <Reader source={source} extensions={extensions} plugins={plugins} />;
}
```

Filter by name to remove a module. Extension names, tag names, and directive names must each be unique; duplicates throw. Do not append a second citation or video through plugins. replaceExtension replaces a matching name or appends if absent. Keep configurations stable to avoid rebuilding the parser during streaming.

## Custom content blocks

```tsx
import { defineBlock } from '@linloir/limr';

export const notice = defineBlock({
  name: 'notice',
  component: ({ children, renderAttribute }) => <aside className="notice">
    <header>{renderAttribute('title')}</header>
    {children}
  </aside>,
});
```

This supports `<notice title="Tip">…</notice>`, paired `::notice{title="Tip"}` / `::`, and `:::` containers. name becomes the tag and directive name unless tags/directives overrides them. defineBlock defaults to display: block, selection: content, and scope: local.

| NodeRendererProps | Use |
| --- | --- |
| node | AST node and static attributes |
| children | Already-rendered subtree; reuse it where possible |
| source | Source for **this node**, not the entire document |
| pending | Whether its tail block is still streaming |
| incomplete | Whether this particular syntax node is unclosed |
| renderChildren(nodes, { trailing? }) | Rearrange an existing subtree or append an action-only marker |
| renderValue(tokens?, { lines? }) | Render literals/tokens while preserving selection and annotation insertion |
| renderAttribute(name) | Render attribute text with original source coordinates |

Do not stringify/reparse children or render only node.value when source mapping is required. Use selection: atomic for charts/media without character correspondence, and data-limr-selection-surface for a visual boundary. Public InlineMarker supports action-only markers without creating annotations.

Use `parameters.codeBlock` for built-in folding, wrapping and line numbers; see [code controls](syntax.md#code-block-controls). A custom code renderer can call `renderValue(tokens, { lines: true })` for source-bound line containers. They retain actual newlines; CSS draws gutter numbers without adding them to copied text.

## Plugins own card presentation

```tsx
import { AnnotationCard, AnnotationMarkdown, defineAnnotation, ToolIcon, useLiMR, useLocale,
  type AnnotationContentProps } from '@linloir/limr';

function NoteContent({ annotation, data, loading, error, retry }: AnnotationContentProps<{ text: string }>) {
  const commands = useLiMR(), locale = useLocale();
  return <>
    {loading ? <p>Loading…</p> : error ? <button onClick={retry}>Retry</button>
      : <AnnotationMarkdown source={data?.text ?? ''} />}
    {commands.canEditAnnotation(annotation.id) && <div className="limr-annotation-actions">
      <button type="button" className="limr-annotation-delete" onClick={() => commands.removeAnnotation(annotation.id)}>
        <ToolIcon name="trash" /><span className="limr-underline">{locale.deleteAnnotations}</span>
      </button>
    </div>}
  </>;
}

export const note = defineAnnotation<{ text: string }>({
  type: 'example:note',
  label: 'Note',
  icon: <ToolIcon name="note" />,
  color: '#6B9BD2',
  Content: NoteContent,
  sidebar: {
    Preview: ({ data }) => data?.text ? <span>{data.text}</span> : null,
    previewLines: 2,
  },
  overlay: {
    Card: props => <AnnotationCard {...props} title="Note" />,
    previewWidth: 320,
    expand: { placement: 'center', width: 640, maxHeight: '80dvh' },
  },
});
```

Content handles presentation (preview / expanded / sidebar), editing, data, and resource state. overlay.Card owns title, body, and controls; use AnnotationCard or render everything yourself. children contains the shared loaded content. LiMR owns positioning, portals, focus, animation, and exit lifecycle. Keep the plugin's semantic title.

Expansion is opt-in. placement accepts anchor / center, sizes accept pixels or CSS lengths, and a resolver can vary the policy by annotation. sidebar.Preview reads local data only; do not fetch for a summary. Preview: false or returning null hides it. The first type in an occurrence owns grouped appearance and summary; annotations provides the group.

sidebar also accepts previewLines, previewColor, color, borderColor, titleColor, textColor, excerptColor, and collapseOnContentClick. Do not repeat card padding at the content root. Use --limr-sidebar-padding-inline and manage internal paragraph spacing.

## Selection actions

```tsx
import { defineExtension, ToolIcon } from '@linloir/limr';

export const savePassage = defineExtension({
  name: 'example:save-passage',
  actions: [{
    id: 'example:save-passage', label: 'Save passage', icon: <ToolIcon name="note" />,
    visible: ({ selection }) => selection.settled && selection.quality !== 'unmapped',
    run(context) {
      const id = `example-note-${crypto.randomUUID()}`;
      context.addAnnotation({
        id, type: 'example:note', data: { text: context.selection.text },
        anchors: context.selection.syntax.ranges.map(range => ({
          range, documentId: context.document.id,
          quote: context.document.source.slice(range.start, range.end),
        })),
      });
      context.activateAnnotation(id);
      context.clearSelection();
    },
  }],
});
```

Install this alongside the note extension above. SelectionAction requires id, label, and icon, and can define visible, disabled, run, onHover, renderExpanded, or render. Use context.run for panel operations to share toolbar busy/error handling. Context contains the selection, full snapshot, annotations/highlight for the fragment, locale, cancellation signal, and commands. Later actions override matching IDs; explicit host actions take final precedence.

## Modules writing source

Modules do not need another editor component or filesystem API. Both `useLiMR()` and selection action contexts expose `editSource([{ range, text }], { revision })`; check `canEditSource()` before offering editing. Every edit uses UTF-16 coordinates in the same original revision. Validation finishes before the host's onSourceChange callback runs. The default task renderer uses this capability to change only the checked character.

Annotation UI continues to use addAnnotation / updateAnnotation / removeAnnotation / removeAnnotationsAt. Ordinary addAnnotation stores external data; `{ target: 'source' }` selects source, which the default highlight action chooses when editing is enabled. The sourceAnnotations module in standard supplies a generic serializer. Modules override serialization for custom formats with `RendererExtension.sourceEditing.annotations(change, document)`. change is `{ added, updated: [{ previous, annotation }], removed }`. Return SourceEdit[] for the entire atomic command, or undefined to delegate to an earlier handler. Later plugins can override earlier serializers. Handlers must be pure: do not write files or invoke callbacks themselves. previous.source locates every original definition, including duplicate IDs, so deletion cannot resurrect an older definition.

The default public editSourceAnnotations serializer writes paired `::%%limr%%{<#id}` / `::%%limr%%{>#id}` boundaries and `:::limr-annotation` definitions. It supports `{ body: string, ...scalarAttributes }`; highlights use color/style/hidden. Type plugins using this data do not need to reinstall a serializer. sourceAnnotations does not register a particular content type or question card. Complex custom data requires a module serializer, and unsupported data is rejected rather than silently lost. The annotation type's Content still owns its editor UI. Use canEditAnnotation(id) and editAnnotation(id) for capability and shared edit state. After updateAnnotation accepts the saved data, call commitAnnotationEdit(id). Use cancelAnnotationEdit(id) for explicit cancellation: a newly created annotation and the highlight created with it are removed; existing or shared highlights remain. Existing annotations retain their saved content when their editor cancels; the plugin restores or discards its own draft first. A false return from updateAnnotation or cancelAnnotationEdit means the host rejected the change, so retain the draft and keep editing. Enabling source editing does not migrate existing external annotations.

The public `AnnotationEditor` component supplies a controlled borderless input that grows with its content and available width, plus cancel/submit buttons. Its caller owns value, drafts, persistence and undo through onChange/onSubmit/onCancel. Optional onBlur fires only when focus leaves the entire editor container; moving focus to its buttons does not trigger it. The supplied note editors cancel an empty new draft when it loses focus, including an outside click before typing. Cancellation removes the new annotation and only otherwise unused highlights created with it; existing or shared highlights remain. Source-body editors save other draft changes on blur; ordinary reading notes retain them until submission. The selection toolbar stays hidden while the active annotation is being edited. Escape cancels and Ctrl/Cmd+Enter submits, except during IME composition. The ordinary reading-note example and source-body editor share this UI while retaining their own state and persistence policies; the component itself neither saves annotations nor accesses files. Plugin-owned actions use the right-aligned limr-annotation-actions container; expose a single-annotation Delete action when canEditAnnotation(id) permits mutation. The source editor, reading notes, assistant and citation modules preserve this capability boundary; authored formats without a source serializer remain read-only.

Accepting a source edit and successfully saving a file are separate events. The host synchronously accepts edits and owns its save queue, undo, errors and conflict UI. See [local file integration](integration.md#source-editing-and-local-files).

## Parameters

```tsx
import { defineExtension, useRendererParameter } from '@linloir/limr';

declare module '@linloir/limr' {
  interface RendererParameters { exampleDetail?: 'short' | 'full' }
}

export const glossary = defineExtension({
  name: 'example:glossary', tags: ['glossary'], scope: 'local',
  parameters: { exampleDetail: 'short' },
  components: {
    glossary: ({ children }) => <aside data-detail={useRendererParameter('exampleDetail')}>
      {children}
    </aside>,
  },
});
```

The host overrides defaults with parameters={{ exampleDetail: 'full' }}. Parameter updates affect views without reparsing; later defaults win. A standalone package must include declaration merging in its exported .d.ts.

## Parsing and streaming constraints

SyntaxExtension supports micromark, mdast, tags, directives, display, selection, literal, preprocess, transform, and scope. Transforms default to document scope. Declare scope: local only if the transform depends on the current subtree and never revises earlier content or needs document-wide semantics. context.source is the original whole document; positions remain original UTF-16 offsets. Plugins must not regex-rewrite source before parsing.

`preprocess(context, extensions)` returns source spans to omit before Markdown tokenization. Each span uses original whole-document UTF-16 offsets, must be within the document, and must not overlap another span. The engine handles omission and coordinate restoration, retaining mapping metadata in `context.sourceOmissions` and `node.sourceOmissions`. `sourceAnnotations()` uses this for paired boundaries across paragraphs and inside code. Changing the omitted spans triggers a full reparse; use this interface only when syntax must cross Markdown boundaries.

Unknown custom tags display their complete original text, including Markdown inside. Unknown directives in the default configuration render their inner Markdown without outer directive markers; with no directive extension installed, basic Markdown parsing applies. Removing a module reparses the unchanged source with the remaining syntax capabilities. Unregistered annotation types keep their data but have no markers, cards, or editing UI; reinstalling the module restores them. See [annotations](annotations.md#missing-plugins) for selection and persistence behavior. Registered incomplete tags and containers carry node.incomplete and are retried on append; unfinished headers stay hidden or use the module loading view. Invalid JSX can still fall back with diagnostics. Finish with finish() or streaming=false. Transform exceptions become diagnostics. Client renderer boundaries can fall back to source, but React error boundaries do not catch server-rendering exceptions.

Validate tags/directives, Chinese/emoji, offsets, equivalence between finalized streams and one-shot parsing, SSR, and browser behavior for new interactions. For distribution, test actual packed consumption as described in [plugin packages](extensions.md#package-and-integrate).

## Plugin localization

From 1.0.0, components can read the merged locale through useLocale() and select their own dictionary by locale.language. AnnotationType.label accepts a string or `(locale) => string`; actions use context.locale. Citation titles switch between Citation and 引用. A stable plugin instance can update labels without rewriting source. Saved user notes are never translated.

## Streaming presentation

`pending` describes a growing top-level block; `incomplete` describes this particular unclosed syntax node. Every registered tag also accepts component directive syntax. `defineBlock` accepts `streaming.Loading`; omit it to render progressively, using `incomplete` in your component. Component identity is retained while children grow. Default definition, question, extras, video, figure and callout directives use a small themed ring; Mermaid waits for closure before asynchronously drawing. Code, math, GFM and translations show usable partial content. Blockquote-style callouts can grow progressively once their header is complete. Unclosed citation definitions do not register incomplete data.

```tsx
import { defineBlock, defineExtension } from '@linloir/limr';

export const chart = defineBlock({
  name: 'chart',
  component: ({ children }) => <section>{children}</section>,
  streaming: { Loading: () => <span role="status">Preparing chart…</span> },
});
export const streamMotion = defineExtension({
  name: 'example:stream-motion',
  streaming: {
    effect: {
      className: 'my-stream-increment',
      keyframes: [{ opacity: 0.25 }, { opacity: 1 }],
      timing: { duration: 320, easing: 'ease-out' },
    },
  },
});
```

The last extension providing `streaming.effect` wins. The reader's `streamEffect` overrides it; `false` disables the effect. Keyframes and timing use the Web Animations API. Reduced-motion preferences suppress new animations. Default text/block entrances change opacity without adding a background tint. Text wrappers are compacted after completion, once the native selection leaves them. Use `children`, `renderChildren` and `renderValue` to retain this behavior; a plugin that replaces its own DOM owns its selection and animation behavior.

`SyntaxExtension.literal` protects directive bodies from Markdown/JSX interpretation. Literal modules read their original `source` or transform the resulting component. It does not execute attribute expressions, YAML or JavaScript.

## Conditional component replacement

A module's `rendererOverrides` can restrict replacement by node type, language, ancestors or streaming state. Rules apply only inside that Reader. The last matching rule wins; Reader rules take precedence over extension rules and component mappings. Unmatched nodes retain their existing renderer.

```tsx
import { defineExtension, type NodeRenderer } from '@linloir/limr';

const JavaScriptCode: NodeRenderer = ({ renderValue }) => <pre>{renderValue()}</pre>;
export const customCode = defineExtension({
  name: 'example:javascript-code',
  rendererOverrides: [{
    type: 'code',
    when: (node, context) => node.lang === 'js' && !context.incomplete,
    component: JavaScriptCode,
  }],
});
```

`when` also receives `pending` and `ancestors`. An explicit replacement owns its intermediate rendering while retaining LiMR's source wrapper, atomic selection and error boundary. Use `renderValue`, `renderAttribute` and `renderChildren` to preserve mappings. These restrictions scope rendering rules; they are not a JavaScript security sandbox.

## Workers and windowed views

Syntax and presentation are independent capabilities. Components, annotation types and actions can stay on the host. Custom parser hooks need matching versioned host/worker registrations and validated structured-cloneable configuration. Unregistered syntax takes the exact configured fallback or errors; plugins are never dropped to make loading faster. `scope: 'local'` alone proves neither independent packet transport nor safe preview parsing; `independentProseExtensions` and `provisionalPreviewExtensions` each require an explicit semantic guarantee from the worker author.

Custom views can declare `virtualization: { copyText, searchText?, keepAlive? }` for selection/search projections and DOM retention. A contract belongs to the actual matching renderer override. Prefer `useNodeState` across offscreen unmounts and reserve keepAlive for opaque editors or media. If outside state changes visible text, call `invalidatePresentation()` to refresh TOC/search. Unknown views and oversized indivisible blocks cause an explicit fallback reported by `onVirtualizationChange`.

During progressive loading, the preview sets `readOnly` to prevent writes and `provisional` to block operations requiring complete content. Mark an action `readOnly: true` only when it really avoids mutations. Use public navigation and print commands rather than assuming the entire DOM is mounted. See [large documents](large-documents.md) for worker examples, progress APIs and limits.

## Package and integrate

A plugin exports a factory returning RendererExtension. Consumers append it through plugins. One package can provide syntax, annotations, actions, and parameters, with a separate CSS export, without editing LiMR itself.

### Copyable starter

The complete [plugin-template](../../skills/limr-plugin-development/assets/plugin-template/README.md) includes TypeScript, declaration output, CSS, package.json, and tsup configuration. It demonstrates a reading-tip block, an example:note card, and a save-selection action.

After installing LiMR, run from your application:

```sh
mkdir -p packages/limr-reading-tools
cp -R node_modules/@linloir/limr/skills/limr-plugin-development/assets/plugin-template/. packages/limr-reading-tools/
cd packages/limr-reading-tools
npm install
npm run typecheck
npm run build
npm pack
```

In a source checkout, use skills/limr-plugin-development/assets/plugin-template. Replace the @example name, extension/type/action IDs, and implement your data/UI. The starter's private: true prevents accidental publication under an example name and still permits local packing.

### Package contract

| Field | Requirement |
| --- | --- |
| type | module |
| exports["."] | import points to ESM; types points to .d.ts |
| exports["./styles.css"] | Explicit export when the plugin needs CSS |
| files | Built output and usage instructions |
| sideEffects | ["**/*.css"] to retain imported styles |
| peerDependencies | @linloir/limr and react; add react-dom when directly using it |
| Build external | LiMR, React, react/jsx-runtime, and any React DOM entry used |

Bundling another copy of LiMR or React breaks shared contexts/hooks. Externalize host dependencies and avoid internal deep imports. Ship parameter declaration merging with exported types.

### Import into an application

The @example package below is the starter, not a published npm package. Install the generated local archive; use the actual filename printed by npm pack:

```sh
npm install ./packages/limr-reading-tools/example-limr-reading-tools-0.1.0.tgz
```

```tsx
import { Reader } from '@linloir/limr';
import { readingTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@example/limr-reading-tools/styles.css';

const plugins = [readingTools({ label: 'Reading note' })];

export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} />;
}
```

Use the real name and peer version requirements for a third-party package. Replace default modules through extensions + replaceExtension; do not register the same tag twice. Hosts still configure fonts, math CSS, persistence, and application services.

### Validate distribution

After type checking, install the actual tgz into an independent consumer. Check public imports, SSR, CSS resources, preserved defaults, and new interactions. Packages supporting React 18/19 should verify both. Syntax plugins should compare finalized streams with one-shot parsing. Interactive plugins should cover desktop sidebars, narrow overlays, keyboard behavior, cancellation, and both themes.

The repository also includes packable [reading-tools](../../examples/packages/reading-tools/index.js) and [paper-theme](../../examples/packages/paper-theme/index.css) examples. The [plugin development Skill](ai-skills.md) includes a portable template and references that do not require this repository.

### Loading and large-document compatibility

Plugins relying on 1.3.0 loading controls or windowing capabilities should declare that minimum peer version and validate workers, provisional/readOnly behavior, copy/search and offscreen state in a real package consumer. Simple examples using older APIs can retain their compatible peer range. CSS themes should also check light/dark image-preview portals and uniformly sized toolbar buttons. See [workers and windowed views](extensions.md#workers-and-windowed-views) and [large-document integration](large-documents.md).

Plugins using `CodeBlockOptions`, `parameters.codeBlock` or the line-grouping argument of `renderValue` require LiMR 1.3.8 or later as their minimum peer. Templates using older APIs can retain their compatible minimum; verify numbered copy, per-block overrides and windowed state in a real 1.3.8 package consumer.
