# Extension development

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/extensions) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/extensions.md)

Start with [built-in modules](modules.md) for module objects, factories, names, Markdown tags, and the difference between `extensions` and `plugins`.

## Choose an interface

| Need | Interface |
| --- | --- |
| A new block with Markdown content | defineBlock |
| A standalone annotation type | defineAnnotation |
| Combined syntax, annotations, actions, and parameters | defineExtension / RendererExtension |
| A different view for an existing node | components |
| New parsing rules | micromark + mdast, with transform when needed |
| Visual changes only | CSS theme package + appearance |

These APIs are publicly exported from @linloir/limr. Third-party packages must not import src/dist internals or non-public helpers such as useRuntime. See [plugin packages](plugin-packages.md) for a complete standalone starter.

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

This supports `<notice title="Tip">…</notice>` and `:::notice{title="Tip"}`. name becomes the tag and directive name unless tags/directives overrides them. defineBlock defaults to display: block, selection: content, and scope: local.

| NodeRendererProps | Use |
| --- | --- |
| node | AST node and static attributes |
| children | Already-rendered subtree; reuse it where possible |
| source | Source for **this node**, not the entire document |
| pending | Whether its tail block is still streaming |
| renderChildren(nodes, { trailing? }) | Rearrange an existing subtree or append an action-only marker |
| renderValue(tokens?) | Render literals/tokens while preserving selection and annotation insertion |
| renderAttribute(name) | Render attribute text with original source coordinates |

Do not stringify/reparse children or render only node.value when source mapping is required. Use selection: atomic for charts/media without character correspondence, and data-limr-selection-surface for a visual boundary. Public InlineMarker supports action-only markers without creating annotations.

## Plugins own card presentation

```tsx
import { AnnotationCard, AnnotationMarkdown, defineAnnotation, ToolIcon } from '@linloir/limr';

export const note = defineAnnotation<{ text: string }>({
  type: 'example:note',
  label: 'Note',
  icon: <ToolIcon name="note" />,
  color: '#6B9BD2',
  Content: ({ data, loading, error, retry }) => loading ? <p>Loading…</p>
    : error ? <button onClick={retry}>Retry</button>
    : <AnnotationMarkdown source={data?.text ?? ''} />,
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

SyntaxExtension supports micromark, mdast, tags, directives, display, selection, transform, and scope. Transforms default to document scope. Declare scope: local only if the transform depends on the current subtree and never revises earlier content or needs document-wide semantics. context.source is the original whole document; positions remain original UTF-16 offsets. Do not regex-rewrite source before parsing.

Unknown custom tags display their complete original text, including Markdown inside. Unknown directives in the default configuration render their inner Markdown without outer directive markers; with no directive extension installed, basic Markdown parsing applies. Incomplete tags fall back with diagnostics and retry on append. Finish with finish() or streaming=false. Transform exceptions become diagnostics. Client renderer boundaries can fall back to source, but React error boundaries do not catch server-rendering exceptions.

Validate tags/directives, Chinese/emoji, offsets, equivalence between finalized streams and one-shot parsing, SSR, and browser behavior for new interactions. For distribution, test actual packed consumption as described in [plugin packages](plugin-packages.md).

## Plugin localization

From 1.0.0, components can read the merged locale through useLocale() and select their own dictionary by locale.language. AnnotationType.label accepts a string or `(locale) => string`; actions use context.locale. Citation titles switch between Citation and 引用. A stable plugin instance can update labels without rewriting source. Saved user notes are never translated.
