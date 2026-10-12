import { useState } from 'react';
import { DocumentProvider, Markdown, TableOfContents, useDocumentSelector } from '../src';

function SnapshotReadout() {
  const value = useDocumentSelector(document => ({ revision: document.revision, headings: document.headings.length }));
  return <output id="snapshot-readout">{value.revision}:{value.headings}</output>;
}
export function HydrationFixture() {
  const [source, setSource] = useState('# Hydrated\n\nA **stable** document with $x^2$.');
  return <div className="demo-page">
    <DocumentProvider source={source}><TableOfContents /><Markdown /><SnapshotReadout /></DocumentProvider>
    <Markdown source={'# Another document\n\nSeparate ID.'} />
    <button onClick={() => setSource(value => value + '\n\n## Appended\n\nNew text.')}>Append</button>
  </div>;
}
