import { expect, it } from 'vitest';
import { DocumentEngine, rangeOf, type Block } from '../src/core';
import { gfm } from '../src/extensions/gfm';
import { windowedSourceContinuation } from '../src/react/windowed-source-continuation';

it('keeps a real legacy nested footnote separate from its containing body during source continuation', () => {
  const source = 'Intro[^n].\n\n> before\n>\n> [^n]: nested note\n>\n> after\n\nFollowing body.\n';
  const snapshot = new DocumentEngine(source, { id: 'nested-footer-continuation', extensions: [gfm()] }).getSnapshot();
  // Prove parser reachability before checking the continuation implementation.
  expect(snapshot.footnoteOrder).toEqual(['n']);
  const note = snapshot.footnotes.get('n'); expect(note?.type).toBe('footnoteDefinition');
  const parent = snapshot.blocks.find(block => block.node.type === 'blockquote'); expect(parent).toBeDefined();
  const noteRange = rangeOf(note!);
  expect(parent!.range.start).toBeLessThan(noteRange.start);
  expect(parent!.range.end).toBeGreaterThan(noteRange.end);
  const body = snapshot.blocks.filter(block => !['definition', 'footnoteDefinition', 'annotationDefinition'].includes(block.node.type));
  const footer: Block & { footnoteId: string } = { id: 'nested-footer-n', node: note!, range: noteRange, pending: false, footnoteId: 'n' };
  const entries = [...body, footer];
  const parentIndex = entries.indexOf(parent!), footerIndex = entries.length - 1;
  expect(parentIndex).toBeGreaterThanOrEqual(0); expect(footerIndex).toBeGreaterThan(parentIndex);
  expect(entries[footerIndex].range.start).toBeLessThan(entries[footerIndex - 1].range.start);
  const sorted = entries.map((block, index) => ({ block, index })).sort((a, b) => a.block.range.start - b.block.range.start);
  const continueSource = windowedSourceContinuation(sorted);
  expect(continueSource(parent!)).toEqual([parentIndex]);
  expect(continueSource(footer)).toEqual([footerIndex]);
  // Same source coordinates without footer ownership remain a body location;
  // neither range equality nor overlap grants a different render class.
  expect(continueSource({ ...footer, footnoteId: undefined })).toEqual([parentIndex]);
  const withoutFooter = windowedSourceContinuation(sorted.filter(entry => entry.index !== footerIndex));
  expect(withoutFooter(footer)).toEqual([]);
});
