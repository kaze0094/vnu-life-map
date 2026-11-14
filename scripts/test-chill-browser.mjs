import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const base=process.env.CHILL_TEST_APP??'http://localhost:3000';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('This test is local-only; do not automate public rooms without authorization.');
const shots='docs/screenshots/chill-space';await mkdir(shots,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHILL_CHROMIUM_PATH?{executablePath:process.env.CHILL_CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const contexts=[];const errors=[];const results={};
const context=async(viewport={width:1440,height:1000})=>{const c=await browser.newContext({viewport,locale:'vi-VN'});contexts.push(c);return c;};
const page=async c=>{const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));return p;};
async function join(p,url,nick){await p.goto(url,{waitUntil:'networkidle'});await p.getByLabel('Biệt danh',{exact:true}).fill(nick);await p.getByRole('button',{name:'Tham gia phòng qua link',exact:true}).click();await expect(p.getByTestId('connection-status')).toContainText('Đã kết nối realtime',{timeout:20000});await p.getByRole('button',{name:'Người cùng phòng',exact:true}).click();}
const row=(p,nick)=>p.getByTestId('participant').filter({hasText:nick});
try{
 const ca=await context(),cb=await context();const a=await page(ca),b=await page(cb);
 await a.goto(`${base}/chill/together`,{waitUntil:'networkidle'});await a.getByRole('button',{name:'Tạo phòng riêng & link mời',exact:true}).click();await expect(a).toHaveURL(/room=r-/);const invite=a.url();
 await join(a,invite,'Mây A');await expect(a.getByTestId('participant')).toHaveCount(1);
 await ca.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});await a.locator('.chill-game-header button[aria-label="Sao chép link mời"]').click();await expect(a.locator('.chill-toast')).toContainText('Đã sao chép');assert.equal(await a.evaluate(()=>navigator.clipboard.readText()),invite);results.privateInviteAndCopy=true;
 await join(b,invite,'Lá B');await expect(a.getByTestId('participant')).toHaveCount(2);await expect(b.getByTestId('participant')).toHaveCount(2);results.A_presence=true;
 const aid=await row(a,'Mây A').getAttribute('data-player-id'),bid=await row(b,'Lá B').getAttribute('data-player-id'),old=Number(await row(b,'Mây A').getAttribute('data-x'));
 await a.locator('.chill-world').focus();await a.keyboard.down('d');await a.waitForTimeout(800);await a.keyboard.up('d');await b.waitForFunction(({id,old})=>{const element=document.querySelector(`[data-player-id="${id}"]`);return element&&Number(element.dataset.x)>old+.1;},{id:aid,old});results.B_movement=true;
 await b.getByRole('button',{name:'Gửi 👋',exact:true}).click();await expect(row(a,'Lá B').getByTestId('participant-emote')).toHaveText('👋');results.C_wave=true;
 await a.getByTestId('seat-sage-a').click();await expect(b.getByTestId('seat-sage-a')).toBeDisabled();await expect(row(a,'Mây A')).toHaveAttribute('data-seat','sage-a');results.D_exclusiveSeat=true;
 await b.getByTestId('seat-sage-b').click();await expect(row(a,'Mây A')).toHaveAttribute('data-activity','sitting',{timeout:20000});await expect(row(b,'Lá B')).toHaveAttribute('data-activity','sitting',{timeout:20000});
 await a.getByRole('button',{name:'Học chung 25 phút',exact:true}).click();await expect(a.getByTestId('group-clock')).toBeVisible();await b.getByRole('button',{name:'Tham gia phiên bàn',exact:true}).click();await expect(b.getByTestId('group-clock')).toBeVisible();
 assert.equal(await a.getByTestId('group-clock').getAttribute('data-start'),await b.getByTestId('group-clock').getAttribute('data-start'));assert.equal(await a.getByTestId('group-clock').getAttribute('data-end'),await b.getByTestId('group-clock').getAttribute('data-end'));
 const seconds=text=>{const [m,s]=text.split(':').map(Number);return m*60+s;};assert(Math.abs(seconds(await a.getByTestId('group-clock').innerText())-seconds(await b.getByTestId('group-clock').innerText()))<=1);results.E_sharedClock=true;
 await a.screenshot({path:`${shots}/together-desktop-a.png`});await b.screenshot({path:`${shots}/together-desktop-b.png`});
 await cb.setOffline(true);await expect(b.getByTestId('connection-status')).toContainText('Mất kết nối',{timeout:15000});await expect(a.getByTestId('participant')).toHaveCount(1,{timeout:20000});await cb.setOffline(false);await expect(b.getByTestId('connection-status')).toContainText('Đã kết nối realtime',{timeout:20000});await expect(a.getByTestId('participant')).toHaveCount(2);await expect(b.getByTestId('participant')).toHaveCount(2);assert.equal(await row(b,'Lá B').getAttribute('data-player-id'),bid);results.G_reconnectWithoutDuplicate=true;
 await b.getByTestId('seat-sage-b').click();await expect(a.getByTestId('seat-sage-b')).toBeDisabled();await b.close();await expect(a.getByTestId('participant')).toHaveCount(1,{timeout:20000});await expect(a.getByTestId('seat-sage-b')).toBeEnabled();results.F_leaveReleasesSeat=true;
 a.once('dialog',dialog=>dialog.accept());await a.getByRole('button',{name:'Đóng phòng riêng',exact:true}).click();await expect(a.getByTestId('connection-status')).toContainText('đã đóng');results.ownerClosesPrivateRoom=true;
 // A mobile viewport and a separate desktop context still use real sockets.
 const cm=await context({width:390,height:844}),cd=await context();const mobile=await page(cm),desktop=await page(cd);
 await mobile.goto(`${base}/chill/together`,{waitUntil:'networkidle'});await mobile.getByRole('button',{name:'Tạo phòng riêng & link mời',exact:true}).click();await expect(mobile).toHaveURL(/room=r-/);const mobileInvite=mobile.url();
 await join(mobile,mobileInvite,'Mây mobile');await join(desktop,mobileInvite,'Lá desktop');await expect(desktop.getByTestId('participant')).toHaveCount(2);
 const before=Number(await row(desktop,'Mây mobile').getAttribute('data-x'));const box=await mobile.locator('.chill-joystick').boundingBox();assert(box);await mobile.mouse.move(box.x+box.width/2,box.y+box.height/2);await mobile.mouse.down();await mobile.mouse.move(box.x+box.width/2+26,box.y+box.height/2);await mobile.waitForTimeout(900);await mobile.mouse.up();await desktop.waitForFunction(old=>{const p=[...document.querySelectorAll('[data-testid=participant]')].find(p=>p.textContent.includes('Mây mobile'));return p&&Number(p.dataset.x)>old+.1;},before);
 await mobile.getByTestId('seat-sage-a').click();await desktop.getByTestId('seat-sage-b').click();await expect(row(desktop,'Mây mobile')).toHaveAttribute('data-activity','sitting',{timeout:20000});await expect(row(desktop,'Lá desktop')).toHaveAttribute('data-activity','sitting',{timeout:20000});await mobile.getByRole('button',{name:'Người cùng phòng',exact:true}).click();await mobile.getByRole('button',{name:'Học chung 25 phút',exact:true}).click();await desktop.getByRole('button',{name:'Tham gia phiên bàn',exact:true}).click();await expect(mobile.getByTestId('group-clock')).toBeVisible();assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await mobile.screenshot({path:`${shots}/together-mobile.png`});results.mobileJoystickAndSharedRoom=true;
 assert.deepEqual(errors,[]);console.log(JSON.stringify({tests:results,contexts:'Independent Playwright BrowserContexts, real Cloudflare local WebSockets',javascriptErrors:errors},null,2));
}finally{for(const c of contexts)await c.close();await browser.close();}
