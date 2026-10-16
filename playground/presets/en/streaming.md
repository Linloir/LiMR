# One word at a time

Text can be read while it is still arriving. Choose **Stream demo** above, then select and copy a passage while the rest of the code is still appearing.

## Wait for a complete idea

::definition{title="Progressive presentation"}
Prose and code can unfold gradually. Components that need complete information show a small loading ring before presenting their content. Formatting delimiters and unfinished tags stay behind the scenes.
::

## Keep the passage you selected

::code{lang="typescript"}
const message = "You can copy this while the next passage arrives";

async function read(stream: AsyncIterable<string>) {
  let source = "";
  for await (const chunk of stream) {
    source += chunk;
    console.log(source);
  }
  return source;
}
::

## Let an equation take shape

::math
\int_0^1 x^2\,\mathrm{d}x = \frac{1}{3}
::

## Preserve the rhythm of reading

Typography is a sequence of small decisions. Choosing a line break means considering the words that follow, the rhythm of the paragraph, and the space between phrases. A stable stream keeps earlier lines in place while new words arrive; a completed paragraph can take a little more care with its final shape.

::question{title="Which content can appear progressively?"}
::question-content
Even before a code block is complete, the portion already displayed can be read and copied.
::
::question-hint
Watch whether the visible content keeps its position and selection as new text arrives.
::
::question-answer
Readable intermediate states remain visible. Modules that require complete data wait for their closing syntax. Third-party modules can choose the behavior that fits their content.
::
::

## Wait for the diagram

::mermaid
flowchart LR
  A[Streaming input] --> B[Wait for complete syntax]
  B --> C[Fade in the diagram]
  C --> D[Copy or zoom]
::

## Leave a clue in the paragraph

Click this ==pale blue highlight== to copy it. A ==highlight with a footnote==[^stream-note] puts its explanation in the margin. You can also use an ==inline definition==^[Footnotes support **Markdown** and appear in a floating card on narrow screens.].

[^stream-note]: In the default reading mode, source highlights offer a copy action. After the demo ends, enable **Allow Markdown editing** to edit source highlights or select text and add highlights and inline notes to the document. Footnotes and ordinary annotations share markers, the sidebar, and narrow-screen cards.

> [!tip]+ A nested reading hint
> Only newly arriving content fades in as the text grows.
>
> > An ordinary note can contain another note.
> >
> > > [!example]- Open this example
> > > The folded state is preserved when more text arrives.

## A definition can arrive later

You first read that ::%%limr%%{<#stable-prefix}stable content need not be generated again::%%limr%%{>#stable-prefix}. Its note and question arrive later. Watch the markers connect to that passage after their definitions are complete; unfinished annotation headers and bodies do not leak into the article.

:::limr-annotation{#stable-highlight ranges="stable-prefix" type="highlight" style="underline" color="#81B29A"}
:::

:::limr-annotation{#stable-note ranges="stable-prefix" type="footnote" title="Remember the stable boundary"}
A stream can reuse its stable prefix while preserving the current selection. A new reference definition still needs to be checked for its effect on earlier content.
:::

::limr-annotation{#stable-question ranges="stable-prefix" type="question"}
In a table that keeps growing, which rows are settled and which still need to be parsed again?
::

## Grow a table one row at a time

| Content | Settled portion | Changing portion |
| --- | --- | --- |
| Prose | Earlier paragraphs | The final paragraph |
| Long code | Characters already received | Newly appended characters |
| Tables | Complete closed rows | The last row and new rows |
| Source annotations | Complete ranges and definitions | Unclosed definitions |

- [x] Try selecting and copying during the stream.
- [ ] Wait until the demo ends before changing tasks and source annotations.

Task toggles and source changes pause during streaming. Edit after the demo ends so generation and source writeback do not compete for the same document.
