import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../lib/roster-reconcile.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {reconcileRoster}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const read=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const previous=read('roster-before-20261025.json'),current=read('roster.json');
test('updates untouched older browser baseline to uploaded Gaia ownership',()=>{
 const result=reconcileRoster(previous,previous,current);
 assert.equal(result['56'].owned,true);assert.equal(result['56'].star,'紫1');
 assert.equal(Object.values(result).filter(x=>x.owned).length,58);
 assert.deepEqual(result['108'],previous['108']);assert.deepEqual(result['109'],previous['109']);
 assert.equal(previous['56'].owned,false);
});
test('preserves newer stars, manual notes and explicit imported ownership',()=>{
 for(const changed of [{...current['56'],star:'紅1'},{...previous['56'],note:'暫不養'},current['56']]){
  const saved={...previous,'56':changed};assert.deepEqual(reconcileRoster(saved,previous,current)['56'],changed);
 }
});
test('fills missing entries without mutating saved data',()=>{
 const saved={'56':current['56']};const result=reconcileRoster(saved,previous,current);
 assert.equal(Object.keys(result).length,104);assert.equal(Object.keys(saved).length,1);
 assert.throws(()=>reconcileRoster(null,previous,current));
});
