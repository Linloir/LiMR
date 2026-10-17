import { describe, expect, it } from 'vitest';
import { standard } from '../src/extensions/standard';
import { ReaderRuntime, Store } from '../src/react/runtime';
import { collectNodeState, completeNodeStateShape, inheritNodeState, registerNodeState, type NodeStateOwner } from '../src/react/node-state-handoff';
const owner:NodeStateOwner={name:'ordered-paragraph',nativeTypes:['paragraph'],keys:{choice:value=>typeof value==='boolean'},signature:completeNodeStateShape};
function setup(){const extensions=standard(),before=new ReaderRuntime('ordered','Chosen paragraph.\n\n',true,{extensions,provisional:true}),after=new ReaderRuntime('ordered','Chosen paragraph.\n\n'+Array.from({length:100},(_,i)=>`Later paragraph ${i}.\n\n`).join(''),false,{extensions});const snapshot=after.document.getSnapshot(),blocks=snapshot.blocks as (typeof snapshot.blocks)[number][];collectNodeState(before);registerNodeState(before,owner,before.document.getSnapshot().blocks[0].node,'choice',new Store<unknown>(true));return{before,after,blocks,node:blocks[0].node};}
describe('provisional owner top-level source order permission',()=>{
 it.each(['duplicate','reverse','overlap'])('refuses %s top-level ranges without changing block order',(shape)=>{
  const{before,after,blocks,node}=setup();
  if(shape==='duplicate')blocks.splice(1,0,{...blocks[0],id:'duplicate-owner',node:structuredClone(node)});
  else if(shape==='reverse')[blocks[0],blocks[1]]=[blocks[1],blocks[0]];
  else blocks[1].range={...blocks[1].range,start:blocks[0].range.end-1};
  const order=blocks.map(block=>block.id);inheritNodeState(after,before);expect(after.nodeStates.get(node)?.has('choice')??false).toBe(false);expect(blocks.map(block=>block.id)).toEqual(order);
 });
 it('checks final-only block metadata once per immutable snapshot without walking its node children',()=>{
  const{before,after,blocks,node}=setup(),last=blocks.at(-1)!,range=last.range;let reads=0;
  Object.defineProperty(last,'range',{get(){reads++;return range;}});Object.defineProperty(last.node,'children',{get(){throw new Error('Unrelated final AST must not be inspected');}});
  inheritNodeState(after,before);expect(after.nodeStates.get(node)?.get('choice')?.get()).toBe(true);expect(reads).toBe(1);
  inheritNodeState(after,before);expect(reads).toBe(1);
 });
 it('permits touching zero-length metadata blocks that cannot contain a positive UI owner',()=>{
  const{before,after,blocks,node}=setup(),point=blocks[0].range.end;
  blocks.splice(1,0,...[0,1].map(index=>({id:'empty-'+index,range:{start:point,end:point},pending:false,node:{type:'definition',position:{start:{line:1,column:1,offset:point},end:{line:1,column:1,offset:point}}}})));
  inheritNodeState(after,before);expect(after.nodeStates.get(node)?.get('choice')?.get()).toBe(true);
 });
});
