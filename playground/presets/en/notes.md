# Leave a thought beside the words

A book starts to become your own when you leave your first thought in it. Select an **important passage**, give it a little color, or add a note beside it. A note need not be a complete commentary: it can be a question, an example, or a sentence you hope to understand differently next time.

## Start by seeing the range

An ordinary footnote marks this position[^reading-clue] without highlighting the entire paragraph. Hover over its marker to see the original label and content.

==This short passage has an explicit range==[^passage-note], so its footnote belongs only to those words. An ==explanation written directly in the sentence==^[Inline footnotes also support **Markdown**, `code`, and [links](https://spec.commonmark.org/).] works well for a brief aside that does not need a separate definition at the end.

A standalone source marker<ref id="commonmark" /> also marks only its position. <ref id="commonmark">Only the words explicitly wrapped in a reference receive a subtle tint when that reference is viewed.</ref>

[^reading-clue]: **reading-clue** is the original label of this footnote. Keep a book title, chapter, or link here to give your future self a way back.

[^passage-note]: A footnote immediately following `==…==` attaches to that highlight. An ordinary footnote attaches only to the marker position.

<citation id="commonmark" title="CommonMark Specification" url="https://spec.commonmark.org/" summary="Markdown syntax and reference examples." description="The same citation definition can be used in several places; each **ref** defines its own range." />

## One passage, several thoughts

You can first ::%%limr%%{<#main}keep stable content and update only what is changing::%%limr%%{>#main}, then leave a note and a question on that same sentence. Its range, yellow highlight, note, and question are all stored in this Markdown document.

:::limr-annotation{#main-highlight ranges="main" type="highlight" style="background" color="#E5C07B" hidden="false"}
:::

:::limr-annotation{#main-note ranges="main" type="footnote" title="Restate, then verify"}
My understanding: settled content can be reused, but it needs another look when **a new definition affects an earlier passage**.

- First check whether the input changed.
- Then check whether the effect reaches beyond the current fragment.
:::

:::limr-annotation{#main-question ranges="main" type="question"}
Why check the cache first? Could a reference definition at the end of the article change the interpretation of an earlier paragraph?
:::

## Connect two clues

One passage says ::%%limr%%{<#one}keep one authoritative source for each fact::%%limr%%{>#one}. Another says ::%%limr%%{<#two}derive the interface state from the same facts::%%limr%%{>#two}. One note can connect both ranges.

:::limr-annotation{#shared-note ranges="one two" type="footnote" title="One note, two entrances"}
Both sentences discuss reducing duplicate state. Edit this note and the same content appears at both markers.
:::

:::limr-annotation{#shared-highlight ranges="one,two" type="highlight" style="underline" color="#81B29A"}
:::

When you later encounter ::%%limr%%{<#main}keep stable content and update only what is changing::%%limr%%{>#main} again, you can return to the same note. A range ID can appear more than once in a document.

## Hide the color, or revise the interpretation

::%%limr%%{<#hidden}The color can disappear while the thought remains::%%limr%%{>#hidden}. Its note is still available through the marker.

:::limr-annotation{#hidden-highlight ranges="hidden" type="highlight" color="#C08FA3" style="wavy" hidden="true"}
:::

:::limr-annotation{#hidden-note ranges="hidden" type="footnote"}
Hiding a highlight does not delete the note or its range in the source.
:::

This ::%%limr%%{<#revision}final interpretation::%%limr%%{>#revision} demonstrates replacement rules: the later definition wins when annotation IDs match. When a range has multiple highlights, the last highlight also wins.

:::limr-annotation{#old-color ranges="revision" type="highlight" color="#E5C07B"}
:::

:::limr-annotation{#new-color ranges="revision" type="highlight" color="#6B9BD2" style="dotted"}
:::

:::limr-annotation{#revised-note ranges="revision" type="footnote"}
The first version recorded only the conclusion.
:::

:::limr-annotation{#revised-note ranges="revision" type="footnote"}
The revision adds the conditions under which the conclusion holds. Only this updated version appears in the reader.
:::

## Ranges across paragraphs, formatting and code

::%%limr%%{<#cross-a}Begin with **bold ::%%limr%%{<#cross-b}overlapping content**.

The next paragraph still belongs to the first range::%%limr%%{>#cross-a}; the second ends here::%%limr%%{>#cross-b}.

:::limr-annotation{#cross-note ranges="cross-a" type="footnote"}
Ranges can cross paragraphs and Markdown formatting boundaries.
:::

:::limr-annotation{#cross-highlight ranges="cross-b" type="highlight" color="#81B29A"}
:::

```ts
const value = ::%%limr%%{<#code-example}readCache()::%%limr%%{>#code-example};
```

:::limr-annotation{#code-note ranges="code-example" type="footnote"}
Ranges inside code retain exact original source positions.
:::

If you only want to leave a question between sentences, put it here::%%limr%%{<#point}::%%limr%%{>#point} without selecting an entire paragraph.

:::limr-annotation{#point-question ranges="point" type="question"}
This is a zero-length position annotation. It keeps its marker without expanding to a paragraph range.
:::

## Write a change back to the document

Enable **Allow Markdown editing** in the top menu. Select a passage and choose **Add inline note**, edit an existing source annotation, or toggle a task below. Open the editor to see the corresponding Markdown change, then use the **Load** menu to download the document.

::%%limr%%{<#plugin-note}Keep this note in the source::%%limr%%{>#plugin-note} uses the Playground's inline-note module. It coexists with external notes and remains readable when Allow Markdown editing is off.

:::limr-annotation{#plugin-note ranges="plugin-note" type="inline-note"}
This content belongs to the inline-note module. Open it from its marker, or select the related text and choose **Edit inline note**.
:::

- [x] Inspect an ordinary footnote's label and zero-length range.
- [ ] Add a note and a question to the same passage.
- [ ] Edit a source annotation and check that its definition changes.
- [ ] Hide and show a highlight, checking that the note remains.
- [ ] Toggle a task, then inspect its `[ ]` / `[x]` in the editor.

> [!tip]+ Leave your future self some context
> Explaining why you paused here often helps more than adding another color.
>
> > Notes, definitions, and hint blocks share a similar rhythm of compact headings and body text.
> >
> > > [!question]- Open on your next reading
> > > What new evidence would change today's judgment?

Source annotations can still be viewed and copied in reading mode. Writeback depends on the current mode and module; reading does not require changing the original document.
