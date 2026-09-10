import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
process.env.PREVIEW_TEST_PROVIDER_MOCK='1';
process.env.NODE_ENV='production';
process.env.CONTEXT='production';
process.env.NEXT_PUBLIC_SITE_MODE='production';
process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID='G-V2GD0849VP';
process.env.GA4_API_SECRET='test-only';
register('./preview-loader.mjs', import.meta.url);
const {providerCalls, resetProviderCalls, failNextDatabaseWrite}=await import('./preview-provider-mocks.mjs');
const analytics={consent:true,clientId:'123.456',sessionId:'1789064000',campaign:{utm_source:'linktree'}};
const cases=[
 ['applications',{fullName:'Test Driver',email:'test@example.invalid',phone:'2025550100',currentCity:'Denver',cityOfInterest:'Denver',briefIntro:'A local test submission.',agreedToTerms:true},'apply'],
 ['waitlist',{email:'test@example.invalid'},'waitlist'],
 ['sponsor-inquiries',{name:'Test Driver',email:'test@example.invalid',interest:'partnership'},'sponsor'],
];
for(const [route,body,form] of cases) test(`GA4 ${route}: real insert required, never exports form data, failures do not break saved leads`,async()=>{
 const {POST}=await import(`../app/api/${route}/route.ts`);
 const originalFetch=globalThis.fetch, originalError=console.error, originalWarn=console.warn;
 const calls=[];
 globalThis.fetch=async(url,options)=>{calls.push(JSON.parse(options.body)); assert.equal(providerCalls.inserts.length,1); return {ok:true};};
 console.error=()=>{}; console.warn=()=>{};
 const send=async(data)=>POST(new Request(`https://driveexotiq.com/api/${route}`,{method:'POST',body:JSON.stringify(data)}));
 try {
  resetProviderCalls(); assert.equal((await send({...body,analytics})).status,201); assert.equal(calls.length,1);
  assert.equal(calls[0].events[0].params.form_name,form); assert.equal(JSON.stringify(calls).includes('example.invalid'),false);
  calls.length=0; resetProviderCalls(); assert.equal((await send({...body,analytics:{...analytics,consent:false}})).status,201); assert.equal(calls.length,0);
  resetProviderCalls(); await send({...body,analytics,website:'bot'}); assert.equal(providerCalls.inserts.length,0); assert.equal(calls.length,0);
  resetProviderCalls(); await send({analytics}); assert.equal(providerCalls.inserts.length,0); assert.equal(calls.length,0);
  resetProviderCalls(); failNextDatabaseWrite({code:'500',message:'expected'}); assert.equal((await send({...body,analytics})).status,500); assert.equal(calls.length,0);
  resetProviderCalls(); globalThis.fetch=async()=>{throw new Error('offline');}; assert.equal((await send({...body,analytics})).status,201);
  if(form==='waitlist'){
   resetProviderCalls(); failNextDatabaseWrite({code:'23505'}); globalThis.fetch=async()=>{calls.push('unexpected');return {ok:true};};
   assert.equal((await send({...body,analytics})).status,201); assert.equal(calls.length,0); assert.equal(providerCalls.emails.length,0);
  }
 } finally {globalThis.fetch=originalFetch;console.error=originalError;console.warn=originalWarn;}
});
