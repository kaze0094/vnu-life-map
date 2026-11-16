import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base=process.env.UI_TEST_APP??'http://localhost:3000';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('UI checks only target local servers.');
const shots='docs/screenshots/astryx-ui';await mkdir(shots,{recursive:true});
const browser=await chromium.launch({...(process.env.CHILL_CHROMIUM_PATH?{executablePath:process.env.CHILL_CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];const failures=[];
try{
 for(const viewport of [{width:390,height:844},{width:1440,height:1000}]){
  const context=await browser.newContext({viewport,locale:'vi-VN'});const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const [route,name]of[['/','home'],['/chill','chill'],['/chill/private','private'],['/chill/together','shared'],['/locations/ULIS-HOMIES-B2','homies'],['/parking/ULIS-PARKING-B2','parking']]){
   await page.goto(base+route,{waitUntil:'networkidle'});await page.waitForTimeout(1200);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name}: horizontal overflow`);
   const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   const violations=report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
   if(violations.length)failures.push({name,width:viewport.width,violations});
   await page.screenshot({path:`${shots}/${name}-${viewport.width}.png`,fullPage:true,caret:'initial'});
   results.push({name,width:viewport.width,violations:violations.length});
  }
  await page.goto(base+'/chill/private',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Vào phòng riêng',exact:true}).click();
  await page.getByRole('region',{name:'Pomodoro riêng'}).waitFor();
  for(const state of ['private-room','private-settings','private-wish']){
   if(state==='private-settings')await page.getByRole('button',{name:'Không gian',exact:true}).click();
   if(state==='private-wish')await page.getByRole('button',{name:'Lời nhắn riêng',exact:true}).click();
   const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   results.push({name:state,width:viewport.width,violations:report.violations.length});
   if(report.violations.length)failures.push({name:state,width:viewport.width,violations:report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
   await page.screenshot({path:`${shots}/${state}-${viewport.width}.png`,caret:'initial'});
  }
  await page.keyboard.press('Escape');await expect(page.locator('.chill-settings')).toHaveCount(0);await expect(page.locator('.chill-wish')).toHaveCount(0);await expect(page.getByRole('button',{name:'Không gian',exact:true})).toBeFocused();
  await page.goto(base,{waitUntil:'networkidle'});
  await page.getByLabel('Tìm địa điểm',{exact:true}).fill('Homies B2');
  const marker=page.getByRole('button',{name:'Xem Homies B2 – ULIS',exact:true});await marker.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.leaflet-popup-content')).toContainText('98 ghế khảo sát');
  await page.locator('.leaflet-popup-content').getByRole('link',{name:'Chi tiết',exact:true}).click();await expect(page).toHaveURL(/locations\/ULIS-HOMIES-B2/);
  await expect(page.getByText('98 ghế ghi nhận khi khảo sát, không phải sức chứa tối đa chính thức.',{exact:false})).toBeVisible();
  await page.goto(base,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Danh sách',exact:true}).click();
  await expect(page.getByRole('region',{name:'Danh sách địa điểm'})).toBeVisible();
  await page.getByLabel('Tìm địa điểm',{exact:true}).fill('không-có-kết-quả');await expect(page.getByRole('heading',{name:'Chưa tìm thấy địa điểm'})).toBeVisible();
  await page.getByRole('button',{name:'Xóa từ khóa tìm kiếm',exact:true}).click();await expect(page.getByRole('heading',{name:'Homies B2 – ULIS',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Nhà xe',exact:true}).last().click();await expect(page.getByRole('button',{name:'Bản đồ',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.locator('.coming-utilities summary').click();await expect(page.locator('.pending-utilities button')).toHaveCount(10);await expect(page.locator('.pending-utilities button').first()).toBeDisabled();
  await page.getByRole('button',{name:'Thử mô phỏng nhà xe',exact:true}).click();await expect(page.getByText('DEMO NHÀ XE · Dữ liệu hư cấu, không phải bãi xe B2.',{exact:true})).toBeVisible();await expect(page.locator('.leaflet-map')).toHaveCount(0);await expect(page.getByRole('button',{name:'Bản đồ',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Trở về dữ liệu thực',exact:true}).click();await expect(page.locator('.leaflet-map')).toHaveCount(1);
  assert.deepEqual(errors,[],`pageerrors ${viewport.width}`);await context.close();
 }
 console.log(JSON.stringify({results,failures},null,2));assert.deepEqual(failures,[],'WCAG A/AA violations');
}finally{await browser.close();}
