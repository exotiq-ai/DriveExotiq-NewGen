import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);
const {createMetaPixelRuntime}=await import('../lib/meta-pixel-runtime.ts');
function fixture(){
 const state={production:true,preview:false,consent:false,origin:'https://driveexotiq.com',pathname:'/'};
 const calls=[];let loads=0;let resolve;
 const runtime=createMetaPixelRuntime('2007025476584382',()=>state,()=>{loads++;return new Promise(r=>{resolve=()=>r((...args)=>calls.push(args));});});
 return {state,calls,runtime,get loads(){return loads;},finish(){resolve();}};
}
test('Meta stays unloaded without marketing consent, on preview/private/foreign hosts',async()=>{
 for(const change of [{},{consent:true,privacySignal:true},{consent:true,preview:true},{consent:true,production:false},{consent:true,pathname:'/admin'},{consent:true,pathname:'/%61dmin'},{consent:true,origin:'https://example.com'}]){
  const f=fixture();Object.assign(f.state,change);await f.runtime.sync();assert.equal(f.loads,0);
 }
});
test('initializes once, disables automatic events, and records one PageView per path',async()=>{
 const f=fixture();f.state.consent=true;const p=f.runtime.sync();f.finish();await p;await f.runtime.sync();
 assert.equal(f.loads,1);assert.equal(f.calls.filter(c=>c[0]==='init').length,1);
 assert.ok(f.calls.some(c=>c[0]==='set'&&c[1]==='autoConfig'&&c[2]===false));
 assert.equal(f.calls.filter(c=>c[2]==='PageView').length,1);
 f.state.pathname='/marketplace';await f.runtime.sync();assert.equal(f.calls.filter(c=>c[2]==='PageView').length,2);
});
test('consent withdrawal while script loads prevents initialization and events',async()=>{
 const f=fixture();f.state.consent=true;const p=f.runtime.sync();f.state.consent=false;await f.runtime.sync();f.finish();await p;assert.deepEqual(f.calls,[]);
});
test('only confirmed stored forms become Lead; no personal fields or preview successes',async()=>{
 const f=fixture();f.state.consent=true;const p=f.runtime.sync();f.finish();await p;
 await f.runtime.lead({form:'apply',status:'preview'});await f.runtime.lead({form:'unknown',status:'stored'});
 await f.runtime.lead({form:'apply',status:'stored',email:'private@example.com'});
 assert.deepEqual(f.calls.filter(c=>c[2]==='Lead'),[['trackSingle','2007025476584382','Lead',{content_name:'community application'}]]);
 f.state.consent=false;await f.runtime.sync();await f.runtime.lead({form:'waitlist',status:'stored'});
 assert.equal(f.calls.filter(c=>c[2]==='Lead').length,1);assert.ok(f.calls.some(c=>c[0]==='consent'&&c[1]==='revoke'));
});
