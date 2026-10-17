import type { Options } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { math } from 'micromark-extension-math';
import { mathFromMarkdown } from 'mdast-util-math';
import { directive } from 'micromark-extension-directive';
import { directiveFromMarkdown } from 'mdast-util-directive';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';
import { sourceAnnotationTokenizer } from '../../src/extensions/source-annotation-tokenizer';

export type MarkdownDialect = 'commonmark' | 'gfm' | 'components';
export function pipelineOptions(dialect: MarkdownDialect): Options {
  if (dialect === 'commonmark') return {};
  const extensions = [gfm(), math()], mdastExtensions = [...gfmFromMarkdown(), mathFromMarkdown()];
  if (dialect === 'components') {
    extensions.push(directive(), { disable: { null: ['htmlFlow', 'htmlText'] } }, mdxJsx(), sourceAnnotationTokenizer);
    mdastExtensions.push(directiveFromMarkdown(), mdxJsxFromMarkdown());
  }
  return { extensions, mdastExtensions };
}

export const markdownPipelineCases: { name: string; source: string; dialect?: MarkdownDialect }[] = [
  { name: 'empty', source: '' },
  { name: 'only whitespace', source: ' \t\n\n\t \n' },
  { name: 'embedded BOM at new block boundaries', source: 'Before.\n\n\uFEFF# This BOM belongs to the source.\n\n\uFEFF[ref]: /not-the-same-definition\n\n[ref]\n\n\uFEFF- Another block\n' },
  { name: 'tabs at prospective window boundaries', source: 'First.\n\n\tindented code\n\tcontinuation\n\n \tmore indented code\n\n#\tHeading\n\n-\titem\n\n\tcontinued\n\nLast\tline' },
  { name: 'EOF without newline after trailing block', source: 'First.\n\n# Second\n\nFinal **text** 😀' },
  { name: 'multiple blank separator and trailing lines', source: '\n\n\t\nFirst.\n \t\n\n\n# Second\n\n\n \t\nLast.\n\n\n\t\n' },
  { name: 'prose, inline syntax and entities', source: 'Beginning 中文 😀 &amp; &#x1f4d6;.\n\n**Strong *nested*** and ~~gone~~, `code`, [inline](</target> "title") and ![picture](/img.png).\n\nwww.example.test, https://example.test/a_(b), reader@example.test.\n' },
  { name: 'forward and backward reference definitions', source: '[early]: /first "First title"\n\nUse [early], [later][late], [missing], ![image][picture].\n\n## Between\n\n[late]:\n  /later\n  "Late title"\n[picture]: /image.png\n\n[early]: /duplicate "Ignored duplicate"\n\nUse [LATE] again.\n' },
  { name: 'normalized escaped multiline reference labels', source: '[spaced\n label] and [FOO\\!], [中文😀].\n\n# Middle\n\n[spaced label]: /spaced\n[foo\\!]: /escaped\n[中文😀]: /unicode\n' },
  { name: 'footnotes with global references and nested containers', source: 'First [^later], [^EARLY], [^later].\n\n[^early]: Early **note** and [link][ref].\n\n> A quote referencing [^later].\n\n[^later]: Later paragraph.\n\n    - Nested item\n      > Nested quote\n\n    Second paragraph with [^early].\n\n[ref]: /resolved\n' },
  { name: 'duplicate footnote definitions', source: '[^same] before.\n\n[^same]: First body.\n\n# Split\n\n[^same]: Second body.\n\n[^same] after.\n' },
  { name: 'definitions inside containers', source: '- Item [inside] and [^nested].\n\n  [inside]: /inside\n\n  [^nested]: Note inside list.\n\n> [quoted]: /quoted\n>\n> Use [quoted].\n\nOutside [inside], [quoted], [^nested].\n' },
  { name: 'lazy blockquotes and nested lists', source: '> Outer **paragraph**\nlazy continuation\n>\n> - list item\n>   continued\n>   > inner quote\n> lazy again\n\nOutside.\n\n- first\n  paragraph lazy\nnot indented but lazy\n\n  > quote\n  >\n  > nested paragraph\n\n- final\n' },
  { name: 'ordered list spread and start values', source: '98. start\n99. next\n\n100. loose\n\n     second paragraph\n\n     - inner\n       1) deeper\n       2) final\n\n101. last\n\n999999999. largest marker\n1000000000. plain text\n' },
  { name: 'empty list items and tab indentation', source: '-\n- \n- last\n\n1.\n2. two\n\n> -\n> - child\n\n\tindented\n\tcode\n\n- item\n\t- nested tab\n\t  continuation\n' },
  { name: 'setext headings versus thematic breaks', source: 'Title\n=====\n\nAnother\n-------\n\n---\n\n- one\n  ---\n\n> Heading\n> =======\n\n# Atx ###\n\n######\n' },
  { name: 'fenced code with fake boundaries and definitions', source: 'Before.\n\n```markdown title\n# Not a heading\n\n[ref]: /not-a-definition\n[^note]: not a note\n::%%limr%%{<#bad}\n```\n\n[ref] [^note]\n\n~~~text\n````\n~~~\n\nAfter.\n' },
  { name: 'unclosed long fence', source: 'Before.\n\n````md\n```\n# Remains code\n\n- still code\n[ref]: /hidden\n' },
  { name: 'indented code and lazy following paragraph', source: '    line one\n\n    line two\n\nParagraph\n    lazy continuation\n\n>     quoted code\n>\n>     more\n' },
  { name: 'GFM table inside containers and escaped pipes', source: '| A | B |\n| ---: | :---: |\n| a\\|b | `x|y` |\n| [link][ref] | [^note] |\n\n> | Q | V |\n> | - | - |\n> | one | two |\n\n- | L | R |\n  | - | - |\n  | nested | table |\n\n[ref]: /target\n[^note]: Body.\n' },
  { name: 'tasks, strikethrough and autolinks', source: '- [ ] open\n- [x] closed\n  - [X] nested www.example.test\n\n~~deleted *text*~~ and a&#64;example.test.\n\n[link www.ignored.test](https://example.test).\n' },
  { name: 'inline and display math', source: 'Inline $x^2$ and $$a+b$$.\n\n$$ latex\n\\begin{aligned}\na &= b \\\\\nc &= d\n\\end{aligned}\n$$\n\n> $$\n> quoted\n> $$\n' },
  { name: 'HTML blocks and comments', source: '<div class="box">\n\n# Markdown after blank\n\n</div>\n\n<!--\n# Hidden\n[ref]: /hidden\n-->\n\n<script>\n# Not Markdown\n</script>\n\n<!DOCTYPE html>\n\n<![CDATA[\n# Text\n]]>\n\nTail.\n', dialect: 'gfm' },
  { name: 'unclosed HTML block', source: 'Before.\n\n<!-- Never closed\n\n# Still comment\n\n[ref]: /hidden\n', dialect: 'gfm' },
  { name: 'JSX flow and inline attributes', source: '<callout title="Escaped &amp; 中文 😀" folded>\n\n# Inside\n\nText <note title="Inline">**inside** [ref]</note>.\n\n</callout>\n\n<figure\n  src="/image.svg"\n  caption="Multiline attribute"\n/>\n\n[ref]: /target\n', dialect: 'components' },
  { name: 'nested JSX and lazy Markdown containers', source: '<translations id="one">\n\n<origin>\n\n> - original\n>   continuation\n\n</origin>\n\n<translation>\n\n1. 中文\n2. 😀\n\n</translation>\n\n</translations>\n\nTail.\n', dialect: 'components' },
  { name: 'nested directives with references', source: '::::callout[Title]{#outer title="中文 &amp; text"}\n\nA [forward] reference.\n\n:::note{#inside}\n- nested\n- list\n:::\n\n::::\n\n:hint[Inline **body**]{value="x"}\n\n::figure{src="/image.png"}\n\n[forward]: /resolved\n', dialect: 'components' },
  { name: 'source annotation cross-block ranges', source: '::%%limr%%{<#range}First **paragraph**.\n\n> Second [link][ref].\n\n- Third 中文 😀\n\nLast.::%%limr%%{>#range}\n\n:::limr-annotation{id="range" type="footnote"}\nA complete note with [^native].\n:::\n\n[ref]: /resolved\n[^native]: Native note.\n', dialect: 'components' },
  { name: 'source annotation nested crossing and escaped markers', source: '::%%limr%%{<#a}Alpha ::%%limr%%{<#b}beta::%%limr%%{>#a} gamma::%%limr%%{>#b}.\n\n\\::%%limr%%{<#a} escaped.\n\n:::limr-annotation{id="a" type="note"}\nFirst note.\n:::\n\n:::limr-annotation{id="b" type="note"}\nSecond note.\n:::\n', dialect: 'components' },
  { name: 'definitions hidden in JSX and literal directives', source: '<unknown>\n\n:::limr-annotation{id="hidden"}\nNot authorized.\n:::\n\n</unknown>\n\n:::math\n[hidden]: /not-global\n:::\n\n::%%limr%%{<#hidden}Text::%%limr%%{>#hidden}\n', dialect: 'components' },
  { name: 'unclosed JSX error', source: '<callout title="open">\n\nParagraph\n\n<note>missing endings', dialect: 'components' },
  { name: 'mismatched JSX error', source: '<callout>\n\nBody\n\n</note>\n', dialect: 'components' },
  { name: 'unclosed directive EOF semantics', source: ':::callout\n\n# Header\n\nText :hint[inline].\n', dialect: 'components' },
  { name: 'nul, surrogate halves and mixed line endings', source: 'First\u0000 null and 😀 e\u0301.\r\n\r\nLone \ud83d / \ude00.\r\rMiddle\uFEFFBOM.\n\nEnd\t\n' },
  { name: 'CRLF hard breaks and escaped punctuation', source: 'Hard break  \nnext\\\nlast.\n\nEscaped \\* \\[ \\] \\# \\> \\: and \\\\.\n' },
];

/** A deterministic dense mix with real grammar interactions, no random timing. */
export function mixedPipelineSource(seed = 1, blocks = 60): string {
  let state = seed >>> 0;
  const pick = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state; };
  const snippets = markdownPipelineCases.filter(item => !item.dialect && !item.name.includes('unclosed'));
  const parts: string[] = ['[global]: /global "First wins"', '[^global]: A global **note**.'];
  for (let index = 0; index < blocks; index++) {
    parts.push(snippets[pick() % snippets.length].source);
    parts.push(`## Boundary ${index} 中文 😀\n\n[global], [late], [^global] and [^late].`);
  }
  parts.push('[late]: /late\n\n[^late]: Final note.\n\n[global]: /ignored-duplicate');
  return parts.join('\n\n');
}
