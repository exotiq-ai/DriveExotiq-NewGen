// Production UI smoke tests with mocked successful form responses. No leads or emails.
import { chromium, webkit, devices, expect } from 'playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const base='http://127.0.0.1:4318';
mkdirSync('output/playwright/launch',{recursive:true});
const results=[];
for (const [name,engine,device] of [['desktop',chromium,{viewport:{width:1440,height:1000}}],['android',chromium,devices['Pixel 7']],['iphone-webkit',webkit,devices['iPhone 13']]]) {
 const browser=await engine.launch();const context=await browser.newContext(device);const page=await context.newPage();
 const posts=[];const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route(/https:\/\/(?:[^/]+\.)?posthog\.com\/|https:\/\/plausible\.io\//,r=>r.abort());
 await page.route('**/api/**',async route=>{
   const req=route.request();if(req.method()!=='POST')return route.continue();
   posts.push({path:new URL(req.url()).pathname,body:req.postDataJSON()});
   await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({success:true,application:{id:'mock-qa'}})});
 });
 await page.goto(base+'/apply?interest=drives');
 await page.getByRole('button',{name:'Get on the list',exact:true}).click();
 await expect(page.getByText('Full name is required',{exact:true})).toBeVisible();
 for(const [label,value] of [['Full name','Local Production QA'],['Email address','local-qa@example.invalid'],['Phone','2025550100'],['Current city','Denver'],['City you’d drive in','Denver'],['Tell us what you drive','Local mocked production verification only.']])await page.getByLabel(label,{exact:true}).fill(value);
 await page.getByRole('checkbox',{name:/I agree to/}).check();
 await page.getByRole('button',{name:'Get on the list',exact:true}).click();
 await expect(page).toHaveURL(/thank-you\?interest=drives/);
 await expect(page.locator('main')).not.toContainText('no information was saved');
 await page.goto(base+'/marketplace');
 await page.getByLabel('Email address',{exact:true}).fill('local-qa@example.invalid');
 await page.getByRole('button',{name:'Join the waitlist',exact:true}).click();
 await expect(page.locator('main')).not.toContainText('Preview complete');
 await expect(page.getByText(/on the list/i).last()).toBeVisible();
 await page.goto(base+'/sponsor?interest=partnership');
 await page.getByLabel('Your name',{exact:true}).fill('Local Production QA');
 await page.getByLabel('Email address',{exact:true}).fill('local-qa@example.invalid');
 await page.locator('form button[type="submit"]').click();
 await expect(page.locator('main')).not.toContainText('Preview complete');
 await expect(page.getByText('Thanks for introducing your brand. We’ll be in touch to explore the fit.',{exact:true})).toBeVisible();
 await expect.poll(()=>posts.length).toBe(3);
 expect(posts.map(p=>p.path)).toEqual(['/api/applications','/api/waitlist','/api/sponsor-inquiries']);
 expect(posts[0].body.smsTransactionalConsent).toBe(false);expect(posts[0].body.smsMarketingConsent).toBe(false);
 expect(errors).toEqual([]);
 await page.screenshot({path:`output/playwright/launch/production-${name}.png`,fullPage:true});
 results.push({name,formJourneys:3,providerResponses:'mocked',realWrites:0,errors});
 await browser.close();
}
writeFileSync('output/playwright/launch/production-browser.json',JSON.stringify(results,null,2));console.log(results);
