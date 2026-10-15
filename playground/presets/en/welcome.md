# Take your time reading

LiMR brings the text, table of contents, references, and selection into one reading experience. Select this **important passage** to copy it, highlight it, or leave a thought beside it. The interface keeps your place as you read.

## Typography and small details

Some ideas deserve a little time. Clear paragraphs, comfortable spacing, and quiet colors help the words hold your attention. A document can mix prose, emoji 🌱, and inline code such as `const reader = createDocument(source)`.

> Reading is more than collecting information. It is a way of finding connections between ideas.

<ref cite-from-ids='["commonmark"]'>A shared Markdown syntax lets the same content travel between different applications.</ref>

<citation cite-id="commonmark" title="CommonMark Specification" url="https://spec.commonmark.org/" desc="Markdown syntax and reference examples, with support for **rich text** descriptions." />

### Tables and lists

| Capability | Included by default | Replaceable |
| :--- | :---: | :---: |
| Reference markers | ✓ | ✓ |
| Custom syntax | ✓ | ✓ |
| Highlights and selection | ✓ | ✓ |

- [x] Original Markdown coordinates
- [x] Long documents and streaming
- [ ] Room for another idea

## Mathematics and code

Inline mathematics such as $E = mc^2$ uses the same rendering support as a display equation:

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

```typescript
import { Reader, standard, defineBlock } from '@linloir/limr';

const extensions = [
  ...standard(),
  defineBlock({ name: 'notice', component: Notice }),
];
```

## Custom blocks

<definition title="Progressive rendering">

<content>

Reuse blocks that have settled, and update the part that is still arriving. When a new reference definition changes an earlier passage, revisit the affected content.

</content>

</definition>

<question title="Which component displays the document body?">

<question-content>Choose one component.</question-content>

<question-sel-grp answer="[0]">

<question-sel>Markdown</question-sel>
<question-sel>TableOfContents</question-sel>

</question-sel-grp>

<question-hint>It can also be used on its own.</question-hint>
<question-answer>**Markdown** displays the body. Other components subscribe to the document state they need.</question-answer>

</question>

<extras>

<extra title="Read CommonMark" url="https://spec.commonmark.org/" desc="Explore the foundations of Markdown syntax." />

</extras>

## Make it your own

An extensible reader should let the application decide what it becomes. Plugins can provide menu actions; cards can hold reference material or an interactive tool of your own.[^design]

[^design]: Plugin content can itself use LiMR, with an independent table of contents and selection scope.

## Several thoughts on the same passage

When a sentence makes you pause, you do not have to decide immediately what kind of note it deserves. Add a little color first, then a question. Or write a margin note to give your future self a place to return. Notes, questions, footnotes, and highlights can share one passage while keeping their own content.

Hover over the color swatch on the left of the selection toolbar to choose a color and highlight style. A background tint can mark something to remember; an underline can emphasize a claim. Dotted and wavy lines can hold questions that remain open. Hiding a highlight does not remove the notes attached to it.

## From sentences to paragraphs

A short sentence delivers an idea quickly. A longer paragraph gives a thought room to develop. A reading interface needs both rhythms: headings offer direction, paragraphs carry an argument, and references and footnotes let you leave the main thread and return to your place.

When a passage combines a fact, an explanation, and a judgment, try selecting them separately and leaving a different annotation on each. The exercise can reveal which claims belong to the author and which conclusions you supplied yourself.

> Sometimes understanding improves when two questions that seemed inseparable finally become distinct.

## Let a note keep growing

Choose a note action in the selection toolbar to open its editor. On a wide screen, it appears beside the text; on a phone, it stays in a small card near the selected passage. Submit to save your changes, or cancel to discard that edit. You can open the note again later.

A note can record a conclusion, but it can also record how that conclusion changes. An explanation written today may need a new condition tomorrow. Returning to the same passage to revise your understanding often reveals more than creating another disconnected entry.

## Choose another document

The **Load** menu contains longer practice texts, open-source READMEs, literature, and research papers. Technical documentation exercises lists and configuration examples; fiction invites continuous reading; papers move between arguments, figures, and tables. The reader keeps a consistent set of controls across all of them.

Choose **Edit** to change the source, then **Save** in the same place to return to reading and store the document and annotations in this browser. Reloading opens the default document. To return to a saved draft, choose **Load saved document** from the Load menu. Unsaved edits and annotations are not restored automatically.

## Images, captions, and bilingual reading

<figures min-width="160" max-width="240" min-height="120" max-height="240">

<figure src="./papers/feature-neuron.png" alt="An image optimized for a single neuron" caption="The response of a single neuron." />
<figure src="./papers/feature-channel.png" alt="An image optimized for an entire channel" caption="The response of an entire channel." />

<figcaption>Images from Olah, Mordvintsev, and Schubert, [Feature Visualization](https://distill.pub/2017/feature-visualization/) (2017), CC BY 4.0. The research examples in the Load menu include more figure layouts.</figcaption>

</figures>

<translations default="origin">

<origin>

Read at your own pace. Keep the original close, and let the translation help when you need it.

</origin>

<translation>

按自己的节奏阅读。把原文留在身边，在需要时让译文帮你一把。

</translation>

</translations>

## Bring reading and editing together

**Allow Markdown editing** is off by default. Enable it in the top menu to toggle task checkboxes directly. Select a passage and use **Add inline note** to write both the note and its range into the Markdown source. Ordinary external notes can still be stored separately.

Choose **Edit** to open the source, then drag the divider to give the editor or preview more room. **Word wrap** suits continuous prose; turn it off to inspect long table rows, URLs, and code lines. Changing this setting preserves your annotations.

> [!tip]+ Read with a question in mind
> Choose **Leave a note** in the Load menu to compare ordinary footnotes, position references, explicit ranges, and multiple annotations stored in the source.
>
> > Open supplementary material when you need it, or keep it folded until a later reading.

## Video on demand

Text, images, and video can belong to the same document. This example creates the player only after you click. Playback depends on the video platform and your network connection.

<video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" title="Click to load the video example" />
