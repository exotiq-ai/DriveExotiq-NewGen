import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);
const context = { consent: true, clientId: '123456.789012', sessionId: '1789064000', campaign: { utm_source: 'linktree', utm_campaign: 'profile_hub', email: 'private@example.com' } };

test('GA4 server payload requires consent and real tag IDs and drops arbitrary data', async () => {
  const { ga4LeadPayload } = await import('../lib/ga4-protocol.ts');
  for (const invalid of [undefined, {}, {...context, consent:false}, {...context, clientId:'private@example.com'}, {...context, sessionId:'bad'}]) assert.equal(ga4LeadPayload(invalid,'apply'), null);
  const payload = ga4LeadPayload(context,'apply');
  assert.equal(payload.client_id,context.clientId);
  assert.equal(payload.events[0].name,'generate_lead');
  assert.equal(payload.events[0].params.form_name,'apply');
  assert.equal(payload.events[0].params.utm_source,'linktree');
  assert.equal(JSON.stringify(payload).includes('private'),false);
  assert.equal(payload.consent.ad_user_data,'DENIED');
});

test('GA4 delivery is disabled without credentials or outside production and never throws', async () => {
  const { deliverGa4Lead } = await import('../lib/ga4-protocol.ts');
  const calls=[];
  const fetcher=async(...args)=>{calls.push(args);return {ok:true};};
  const config={production:true,measurementId:'G-V2GD0849VP',secret:'test-only'};
  assert.equal(await deliverGa4Lead({...config,production:false},context,'apply',fetcher),'disabled');
  assert.equal(await deliverGa4Lead({...config,secret:''},context,'apply',fetcher),'disabled');
  assert.equal(await deliverGa4Lead(config,{...context,consent:false},'apply',fetcher),'skipped');
  assert.equal(calls.length,0);
  assert.equal(await deliverGa4Lead(config,context,'apply',fetcher),'sent');
  assert.equal(calls.length,1);
  assert.equal(await deliverGa4Lead(config,context,'apply',async()=>{throw new Error('secret must not log');}),'failed');
});

test('GA4 browser waits for consent, sanitizes URLs, avoids duplicate pageviews and stops on withdrawal', async()=>{
  const { createGa4Runtime } = await import('../lib/ga4-runtime.ts');
  let state={production:true,preview:false,consent:false,origin:'https://driveexotiq.com',pathname:'/apply',search:'?utm_source=linktree&email=private@example.com'};
  const calls=[]; let loads=0; const disabled=[];
  const command=(...args)=>{calls.push(args); if(args[0]==='get') args[3](args[2]==='client_id'?'123456.789012':'1789064000');};
  const runtime=createGa4Runtime('G-V2GD0849VP',()=>state,async()=>{loads++;return command;},v=>disabled.push(v));
  await runtime.sync(); assert.equal(loads,0); assert.equal(await runtime.context(),undefined);
  state.consent=true; await runtime.sync(); await runtime.sync();
  assert.equal(loads,1); assert.equal(calls.filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
  const ctx=await runtime.context(); assert.equal(ctx.clientId,'123456.789012'); assert.equal(ctx.campaign.utm_source,'linktree');
  assert.equal(JSON.stringify(calls).includes('private'),false);
  state.pathname='/marketplace'; state.search=''; await runtime.sync();
  assert.equal(calls.filter(c=>c[0]==='event'&&c[1]==='page_view').length,2);
  state.consent=false; await runtime.sync(); assert.equal(await runtime.context(),undefined); assert.equal(disabled.at(-1),true);
});

test('GA4 never initializes on preview/private/foreign hosts, or after withdrawal during load',async()=>{
 const { createGa4Runtime }=await import('../lib/ga4-runtime.ts');
 for(const override of [{preview:true},{pathname:'/admin'},{origin:'https://review.netlify.app'}]){
  let loads=0; const state={production:true,preview:false,consent:true,origin:'https://driveexotiq.com',pathname:'/',search:'',...override};
  await createGa4Runtime('G-V2GD0849VP',()=>state,async()=>{loads++;return ()=>{};},()=>{}).sync(); assert.equal(loads,0);
 }
 let finish; const calls=[]; const state={production:true,preview:false,consent:true,origin:'https://driveexotiq.com',pathname:'/',search:''};
 const runtime=createGa4Runtime('G-V2GD0849VP',()=>state,()=>new Promise(r=>finish=r),()=>{});
 const pending=runtime.sync(); state.consent=false; finish((...args)=>calls.push(args)); await pending;
 assert.equal(calls.length,0);
});

 test('GA4 unavailable identifier callbacks never block form completion', async()=>{
  const {createGa4Runtime}=await import('../lib/ga4-runtime.ts');
  const state={production:true,preview:false,consent:true,origin:'https://driveexotiq.com',pathname:'/apply',search:''};
  const runtime=createGa4Runtime('G-V2GD0849VP',()=>state,async()=>(...args)=>{if(args[0]==='get') throw new Error('SDK failure');},()=>{});
  await runtime.sync(); assert.equal(await runtime.context(),undefined);
 });
