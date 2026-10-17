import { expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createDocument } from '../src/core';
import { DocumentProvider, Markdown, useDocument } from '../src/react';
import { Reader } from '../src/components/Reader';

it('renders a supplied complete document without parsing or replacing its source', () => {
  let parses = 0;
  const extensions = [{ name: 'parse-counter', transform: () => { parses++; } }];
  const document = createDocument('# Loaded document\n\nComplete body.', { id: 'loaded', extensions });
  const snapshot = document.getSnapshot();
  function ReadSnapshot() { expect(useDocument()).toBe(snapshot); return null; }
  const html = renderToString(<DocumentProvider document={document} source="Ignored controlled source" extensions={extensions}><ReadSnapshot /><Markdown /></DocumentProvider>);
  expect(html).toContain('Complete body.');
  expect(html).not.toContain('Ignored controlled source');
  expect(parses).toBe(1);
  expect(document.getSnapshot()).toBe(snapshot);
});

it('exposes the same complete document to reader-local integrations', () => {
  const document = createDocument('# Integrated reader', { id: 'integration' });
  function Integration() { return <output>{useDocument().id}</output>; }
  const html = renderToString(<Reader document={document} toc={false} sidebar={false}><Integration /></Reader>);
  expect(html).toContain('<output>integration</output>');
});
