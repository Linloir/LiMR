import { describe, expect, it } from 'vitest';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm as rawGfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import type { Construct, Extension } from 'micromark-util-types';
import { createDocument, walk, type DocumentProgress, type MarkdownNode, type SyntaxExtension } from '../src/core';
import { createParser } from '../src/core/parser';
import { hasTableLocalSyntax } from '../src/core/incremental-table';
import { lineStarts } from '../src/core/tree';
import { syntaxForSource } from '../src/core/source-syntax';
import { gfm } from '../src/extensions/gfm';
import { standard } from '../src/extensions/standard';

const original = (): SyntaxExtension => ({ ...gfm(), micromark: [rawGfm()], mdast: gfmFromMarkdown() });
const snapshot = (source: string, extensions: readonly SyntaxExtension[], streaming = false) => createDocument(source, { id: 'gfm-table-source', extensions, streaming }).getSnapshot();
const compare = (source: string, extensions: readonly SyntaxExtension[] = [gfm()], expected: readonly SyntaxExtension[] = [original()], streaming = false) => {
  const actual = snapshot(source, extensions, streaming), oracle = snapshot(source, expected, streaming);
  expect(actual).toStrictEqual(oracle); expect(graph(actual)).toBe(graph(oracle)); return actual;
};
const tableInputs = ['Header\n:-\nBody', 'Header\n-:\nBody', 'Header\n:-:\nBody', 'Header | Value\n--- | ---:\none | two', '| Header |\n| - |\n| Body |'];
const otherInputs = [
  'Header\n---\nBody', 'Header\n: -\nBody', 'Header\n:\t-\nBody', 'Header\n:\n-\nBody',
  'Header\n&#58;--\nBody', 'Header\n\\:--\nBody', 'Header\n--&#58;\nBody',
  'Alpha **strong** and ~~deleted~~ words.\n\nBeta `code` and $math$.',
  '> Header\n> :-\n> Body', '- Header\n  :-\n  Body', '> Header\n> -:\nlazy continuation',
  '    Header\n    :-\n    Body', '```md\nHeader\n:-\nBody\n```',
  '\ufeff中文 😀 e\u0301\n\nParagraph\u0000 remainder.',
  '[label][ref]\n\n[ref]: /target "title"\n\nFootnote[^a].\n\n[^a]: definition',
];
const flow = (extension: Extension): Construct[] => {
  const value=extension.flow?.null; return Array.isArray(value)?value:value?[value]:[];
};

describe('bundled GFM impossible-table attempts', () => {
  it('uses independent raw oracle configuration and really prunes only the registered table object', () => {
    const shipped=gfm(), raw=original(), extension=shipped.micromark![0], unregistered=raw.micromark![0];
    const table=flow(extension).find(construct=>construct.name==='table')!, rawTable=flow(unregistered).find(construct=>construct.name==='table')!;
    expect(table).toBeDefined();expect(rawTable).toBeDefined();expect(table).not.toBe(rawTable);
    expect(extension).not.toBe(unregistered);expect(shipped.mdast![0]).not.toBe(raw.mdast![0]);
    expect(shipped.mdast![0].exit).not.toBe(raw.mdast![0].exit);
    expect(hasTableLocalSyntax([...shipped.micromark!,...shipped.mdast!])).toBe(true);
    expect(hasTableLocalSyntax([...raw.micromark!,...raw.mdast!])).toBe(false);
    expect(flow(syntaxForSource(extension,'Plain paragraph.'))).not.toContain(table);
    expect(flow(syntaxForSource(extension,'Header\n:-\nBody'))).toContain(table);
    expect(syntaxForSource(unregistered,'Plain paragraph.')).toBe(unregistered);
  });
  it.each(['\n', '\r\n', '\r'])('preserves upstream AST positions and actual single-column tables for %j', eol => {
    for (const input of [...tableInputs, ...otherInputs]) {
      const source=input.replaceAll('\n',eol), extension=gfm().micromark![0];
      const actual=fromMarkdown(source,{extensions:[syntaxForSource(extension,source)],mdastExtensions:gfmFromMarkdown()});
      const oracle=fromMarkdown(source,{extensions:[rawGfm()],mdastExtensions:gfmFromMarkdown()});
      expect(actual).toStrictEqual(oracle); expect(graph(actual)).toBe(graph(oracle));
      if(tableInputs.includes(input)) expect(actual.children.some(node=>node.type==='table')).toBe(true);
      compare(source);
    }
  });

  it('keeps all growing-prefix positions and re-enables the exact table variant after source updates', () => {
    const inputs = [...tableInputs, '> Header\n> :-\n> Body', 'Paragraph\n\nHeader\n-:\nBody'];
    for (const source of inputs) {
      const actual = createDocument('', { id: 'gfm-table-source', extensions: [gfm()], streaming: true });
      const oracle = createDocument('', { id: 'gfm-table-source', extensions: [original()], streaming: true });
      for (const char of source) {
        actual.append(char); oracle.append(char);
        expect(actual.getSnapshot()).toStrictEqual(oracle.getSnapshot());
      }
      actual.finish(); oracle.finish();
      expect(actual.getSnapshot()).toStrictEqual(oracle.getSnapshot());
      // Incremental tables and upstream full parses already have different
      // own-key insertion order for source points. Values and positions are
      // compared here; nonstreaming graph checks remain in compare().
      for (const value of ['Plain text.', ...tableInputs, 'Plain text.', 'a@example.org', 'WWW.example.org https://example.org', 'Header\n---\nBody']) {
        actual.update(value); oracle.update(value);
        expect(actual.getSnapshot()).toStrictEqual(oracle.getSnapshot());
      }
    }
  });

  it('checks the actual post-omission parser input, not the original source', () => {
    const marker='::%%limr%%{<#note}', source=`Header\n:${marker}--\nBody`;
    expect(source.includes(':-')||source.includes('-:')||source.includes('|')).toBe(false);
    const start=source.indexOf(marker), context={documentId:'omission',source,streaming:false,sourceOmissions:[{start,end:start+marker.length}]};
    // Direct parser means no preparsed-tree cache can bypass this mask test.
    const actual=createParser([gfm()])(source,0,context,lineStarts(source));
    const oracle=createParser([original()])(source,0,context,lineStarts(source));
    expect(actual).toStrictEqual(oracle);expect(actual.nodes.some(node=>node.type==='table')).toBe(true);
  });

  it('preserves real ordinary batches while an unregistered upstream grammar parses the full source', () => {
    const source = Array.from({ length: 100 }, (_, i) => `Alpha ${i} **strong** $x+y$ and words.\n\n${'Ordinary raw sentences. '.repeat(45)}\n\n`).join('') + 'Header\n:-\nBody\n';
    expect(source.length).toBeGreaterThan(65536);
    const runs = [standard(), standard().map(extension => extension.name === 'gfm' ? original() : extension)].map(extensions => {
      const progress: DocumentProgress[] = [];
      const value = createDocument(source, { id: 'gfm-table-source', extensions, onProgress: item => progress.push(item) }).getSnapshot();
      return { value, parse: progress.filter(item => item.phase === 'parse') };
    });
    const [actual, oracle] = runs;
    expect(actual.value).toStrictEqual(oracle.value);
    expect(graph(actual.value)).toBe(graph(oracle.value));
    expect(actual.value.source).toBe(source);
    expect(actual.value.diagnostics).toEqual([]);
    expect(actual.parse.length).toBeGreaterThan(2);
    expect(actual.parse[0].loaded).toBe(0);
    expect(actual.parse.at(-1)?.loaded).toBe(source.length);
    expect(oracle.parse.map(item => item.loaded)).toEqual([0]);
    const nodes: MarkdownNode[] = [];
    for (const block of actual.value.blocks) walk(block.node, node => { nodes.push(node); });
    expect(nodes.some(node => node.type === 'inlineMath')).toBe(true);
    expect(nodes.some(node => node.type === 'table')).toBe(true);
  });

  it('preserves the standard directive, math and table combination', () => {
    const source = 'Alpha **strong** $x+y$.\n\nHeader\n:-\nBody\n\n:::callout{fold}\n\nContent\n:::\n';
    const value = compare(source, standard(), standard().map(extension => extension.name === 'gfm' ? original() : extension));
    const nodes: MarkdownNode[] = [];
    for (const block of value.blocks) walk(block.node, node => { nodes.push(node); });
    expect(nodes.some(node => node.type === 'table')).toBe(true);
    expect(nodes.some(node => node.type === 'inlineMath')).toBe(true);
    expect(nodes.some(node => node.type === 'callout' || node.name === 'callout')).toBe(true);
  });

  it('keeps unknown same-name flow constructs and disabled setext behavior observable', () => {
    for(const disable of [[],['setextUnderline','thematicBreak']]){
      const seen:number[]=[];
      const run=(extension:SyntaxExtension)=>{
        let calls=0;
        const foreign:Construct={name:'table',tokenize(_effects,_ok,nok){calls++;return nok;}};
        const extra:SyntaxExtension={name:'foreign-flow',micromark:[{flow:{null:foreign},disable:{null:disable}}]};
        const result=snapshot('Header\n---\n\nPlain words without table markers.',[extension,extra]);seen.push(calls);return result;
      };
      const actual=run(gfm()),oracle=run(original());expect(actual).toStrictEqual(oracle);expect(seen[0]).toBeGreaterThan(0);expect(seen[0]).toBe(seen[1]);
    }
  });

  it('keeps a changed built-in tokenizer observable after engine creation', () => {
    const extension=gfm(), engine=createDocument('Initial.',{id:'gfm-table-source',extensions:[extension],streaming:true});
    const oracle=createDocument('Initial.',{id:'gfm-table-source',extensions:[original()],streaming:true});
    const table=flow(extension.micromark![0]).find(construct=>construct.name==='table')!;
    expect(table).toBeDefined();const tokenize=table.tokenize;let calls=0;
    const saved=Object.getOwnPropertyDescriptor(table,'tokenize')!;
    try {
      table.tokenize=function(effects,ok,nok){calls++;return tokenize.call(this,effects,ok,nok);};
      engine.append('\n\nPlain new paragraph without marker sequences.');
      oracle.append('\n\nPlain new paragraph without marker sequences.');
      expect(calls).toBeGreaterThan(0);
      expect(engine.getSnapshot()).toStrictEqual(oracle.getSnapshot());
    } finally { Object.defineProperty(table,'tokenize',saved); }
  });

  it('retains unknown compiler token observations and mutated resolve/disable configuration', () => {
    for(const mutation of ['compiler','resolve','disable'] as const){
      const seen:string[][]=[];
      const run=(extension:SyntaxExtension)=>{
        const tokens:string[]=[];seen.push(tokens);
        const restores: Array<()=>void>=[];
        const save=(object:object,key:PropertyKey)=>{const descriptor=Object.getOwnPropertyDescriptor(object,key);restores.push(()=>{if(descriptor)Object.defineProperty(object,key,descriptor);else Reflect.deleteProperty(object,key);});};
        try {
          if(mutation==='compiler') {
            save(extension.mdast![0].exit!,'data');
            extension.mdast![0].exit!.data=function(token){tokens.push(this.sliceSerialize(token));this.config.exit.codeTextData.call(this,token);};
          }
          if(mutation==='resolve'){
            const table=flow(extension.micromark![0]).find(construct=>construct.name==='table')!,resolve=table.resolveAll!;
            save(table,'resolveAll');table.resolveAll=(events,context)=>{tokens.push('resolve');return resolve(events,context);};
          }
          if(mutation==='disable') {save(extension.micromark![0],'disable');extension.micromark![0].disable={null:['setextUnderline']};}
          return snapshot('Header\n---\n\nPlain **words**.\n\nHeader\n-:\nBody',[extension]);
        } finally { for(const restore of restores.reverse())restore(); }
      };
      const actual=run(gfm()),oracle=run(original());expect(actual).toStrictEqual(oracle);expect(seen[0]).toEqual(seen[1]);
      if(mutation!=='disable')expect(seen[0].length).toBeGreaterThan(0);
    }
  });
});

// Same ordered graph check as accepted batched-ordinary tests. This covers
// ordinary parser snapshots, not arbitrary accessors, symbols or plugin graphs.
function graph(root: unknown): string {
  const seen=new Map<object,number>();
  const visit=(value:any):any=>{
    if(value===null||typeof value!=='object')return[typeof value,value];
    const prior=seen.get(value);if(prior!==undefined)return['ref',prior];
    const id=seen.size;seen.set(value,id);
    if(value instanceof Map)return['map',id,[...value].map(([key,item])=>[visit(key),visit(item)])];
    if(value instanceof Set)return['set',id,[...value].map(visit)];
    if(Array.isArray(value))return['array',id,value.length,Object.keys(value).map(key=>[key,visit((value as any)[key])])];
    return['object',id,Object.keys(value).map(key=>[key,visit((value as any)[key])])];
  };
  return JSON.stringify(visit(root));
}
