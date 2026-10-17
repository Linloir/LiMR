// Private mechanism proof, not a public renderer/state contract.
import type { Block, DocumentSnapshot, MarkdownNode } from './core';
import type { ReaderRuntime } from './react/runtime';
import { standardRendererIsUnchanged } from './extensions/worker-syntax';
import { completeNodeStateShape } from './react/stable-block-shape';
import { tableViewGrant } from './components/table-view-handoff';

const native = new Set(['text','paragraph','heading','strong','emphasis','delete','inlineCode','code','math','inlineMath','blockquote','list','listItem','link','image','thematicBreak','break','table','tableRow','tableCell','html']);
interface Saved { block:Block; key:string; signature:string; raw:string; }
export interface CommittedPrefix { runtime:ReaderRuntime; entries:readonly Saved[]; request:object; revision:number; }
const hidden=new Set(['definition','footnoteDefinition','annotationDefinition']);
// Transforms/fromSnapshot do not guarantee source ordering or unique ownership.
// Validate immutable snapshot metadata once before any binary lookup. Do not
// reorder caller blocks or traverse their AST to repair an ambiguous snapshot.
const orderedSources = new WeakMap<DocumentSnapshot, boolean>();
function orderedSourceOwners(snapshot:DocumentSnapshot):boolean {
  const cached=orderedSources.get(snapshot);if(cached!==undefined)return cached;
  let end=0;
  for(const block of snapshot.blocks){const range=block.range;
    if(!Number.isSafeInteger(range.start)||!Number.isSafeInteger(range.end)||range.start<end||range.start<0||range.end<=range.start||range.end>snapshot.source.length){orderedSources.set(snapshot,false);return false;}
    end=range.end;
  }
  orderedSources.set(snapshot,true);return true;
}
function standardTree(runtime:ReaderRuntime,node:MarkdownNode):boolean {
  const name=node.type==='component'?node.name??'':node.type;
  // Conservative: a conditional override is unsupported even if currently false.
  if(runtime.rendererOverrides.get(name)?.length)return false;
  const component=runtime.components[name];
  if(component){const ext=runtime.configuration.get().extensions?.slice().reverse().find(item=>item.components?.[name]===component);if(!ext||!standardRendererIsUnchanged(ext))return false;}
  else if(!native.has(node.type))return false;
  return !node.incomplete && (node.children??[]).every(child=>standardTree(runtime,child));
}
function cleanDecorations(runtime:ReaderRuntime,block:Block):boolean {
  const value=runtime.decorations.get().byBlock.get(block.id);
  // First prototype does not claim annotation-wrapper continuity. Those blocks
  // render normally but get a fresh key; no interaction is hidden or disabled.
  return !value?.occurrences.length&&!value?.highlights.length;
}
export function capturePrefix(runtime:ReaderRuntime,request:object,revision:number,keys:(block:Block)=>string):CommittedPrefix {
  const snapshot=runtime.document.getSnapshot(), entries:Saved[]=[];
  if(!orderedSourceOwners(snapshot))return {runtime,request,revision,entries};
  // After the metadata pass, interpreted shape work covers mounted prefix DOM.
  for(const block of snapshot.blocks){if(!runtime.blocks.has(block.id)||block.pending||hidden.has(block.node.type)||!cleanDecorations(runtime,block))continue;
    const start=block.range.start,end=block.range.end;
    const signature=completeNodeStateShape(block.node,65_536);
    if(signature===undefined||!standardTree(runtime,block.node))continue;
    entries.push({block,key:keys(block),signature,raw:snapshot.source.slice(start,end)});
  }
  return {runtime,request,revision,entries};
}
export function proveFinal(previous:CommittedPrefix|undefined,runtime:ReaderRuntime,request:object,revision:number,epoch:string){
  const snapshot=runtime.document.getSnapshot(), keys=new Map<Block,string>(), retain:number[]=[], refused:string[]=[];
  const key=(block:Block)=>keys.get(block)??`${epoch}:${block.id}`;
  const pairs:{before:Block;after:Block}[]=[];
  const result=()=>({key,retain,refused,viewGrant:previous&&pairs.length?tableViewGrant(previous.runtime,runtime,pairs):undefined});
  if(!previous||previous.request!==request||previous.revision!==revision||previous.runtime.document===runtime.document||previous.runtime.document.id!==runtime.document.id)return result();
  if(!orderedSourceOwners(snapshot))return result();
  const before=previous.runtime.configuration.get(),after=runtime.configuration.get();
  if(before.extensions!==after.extensions||before.components!==after.components||before.rendererOverrides!==after.rendererOverrides||before.typography!==after.typography)return result();
  let last=-1;
  for(const saved of previous.entries){const {start,end}=saved.block.range;
    let low=0,high=snapshot.blocks.length;while(low<high){const middle=(low+high)>>>1;if(snapshot.blocks[middle].range.start<start)low=middle+1;else high=middle;}
    const block=snapshot.blocks[low], duplicate=snapshot.blocks[low+1];
    if(!block||block.range.start!==start||block.range.end!==end||block.pending||duplicate?.range.start===start||low<=last||snapshot.source.slice(start,end)!==saved.raw||!cleanDecorations(runtime,block)) {refused.push(saved.key);continue;}
    // Budget validation precedes renderer walking, preventing a changed huge
    // final subtree from turning this into a second whole-document scan.
    const signature=completeNodeStateShape(block.node,saved.signature.length);
    if(signature!==saved.signature||!standardTree(runtime,block.node)){refused.push(saved.key);continue;}
    keys.set(block,saved.key);last=low;pairs.push({before:saved.block,after:block});
    // Windowed entries omit source-only definitions. Count only the bounded
    // prefix before the matching position; never scan the appended full book.
    retain.push(snapshot.blocks.slice(0,low).filter(entry=>!hidden.has(entry.node.type)).length);
  }
  return result();
}
