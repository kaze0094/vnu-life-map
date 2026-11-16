import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import WebSocket from 'ws';
const host=process.env.CHILL_TEST_URL??'ws://127.0.0.1:8787';
if(!['127.0.0.1','localhost'].includes(new URL(host).hostname))throw Error('This smoke test is local-only. Do not load-test public rooms.');
const origin='http://localhost:3000';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const code=()=>`r-${Date.now().toString(36)}-${randomUUID().replaceAll('-','')}`;
async function until(test,label,ms=10000){const end=Date.now()+ms;while(Date.now()<end){if(test())return;await sleep(50);}throw Error(`Timeout: ${label}`);}
function open(room,token=randomUUID().replaceAll('-',''),keepAlive=true){
 const socket=new WebSocket(`${host}/rooms/${room}`,{origin});
 const client={socket,token,id:null,snapshot:null,errors:[],closed:false,closeCode:null,handshake:null,terminal:null};
 socket.on('open',()=>socket.send(JSON.stringify({type:'join',token,profile:{nick:`QA-${token.slice(0,4)}`,shirt:'#69a89a'}})));
 socket.on('message',raw=>{const m=JSON.parse(raw.toString());if(m.type==='welcome')client.id=m.id;if(m.type==='snapshot')client.snapshot=m;if(m.type==='error'||m.type==='rejected')client.errors.push(m.message);if(m.type==='closed')client.terminal=m.message;});
 socket.on('unexpected-response',(_,response)=>{client.handshake=response.statusCode;response.resume();socket.terminate();});
 socket.on('error',()=>{});socket.on('close',code=>{client.closed=true;client.closeCode=code;});
 const interval=keepAlive?setInterval(()=>{if(socket.readyState===WebSocket.OPEN)socket.send(JSON.stringify({type:'heartbeat',clientTime:Date.now()}));},4000):null;
 client.send=packet=>socket.send(JSON.stringify(packet));client.close=()=>{if(interval)clearInterval(interval);socket.close();};return client;
}
const all=[];const results={};
try{
 const room=code(),clients=[];
 for(let i=0;i<4;i++){const c=open(room);all.push(c);clients.push(c);await until(()=>c.id,`join ${i}`);}
 await until(()=>clients.every(c=>c.snapshot?.players.length===4),'four actual socket peers');results.capacityFour=true;
 const extra=open(room);all.push(extra);await until(()=>extra.closed,'fifth rejected');assert(extra.errors.some(e=>e.includes('đủ')));results.fifthRejected=true;
 const [a,b]=clients;a.send({type:'seat',seatId:'sage-a'});b.send({type:'seat',seatId:'sage-a'});
 await until(()=>a.snapshot?.players.some(p=>p.seatId==='sage-a'),'seat reserved');assert.equal(a.snapshot.players.filter(p=>p.seatId==='sage-a').length,1);
 const winner=a.snapshot.players.find(p=>p.seatId==='sage-a').id===a.id?a:b;let loser=winner===a?b:a;
 await until(()=>loser.errors.some(e=>e.includes('đã có người')),'loser receives authoritative conflict');await sleep(220);loser.send({type:'seat',seatId:'sage-b'});
 await until(()=>a.snapshot?.players.filter(p=>p.seatId?.startsWith('sage')&&p.activity==='sitting').length===2,'both walked around table and sat');results.atomicSeatRace=true;
 winner.send({type:'start_focus',minutes:25});await until(()=>loser.snapshot?.sessions.length===1,'shared session');await sleep(220);loser.send({type:'join_focus'});await until(()=>winner.snapshot?.sessions[0]?.members.length===2,'same-table join');assert.equal(winner.snapshot.sessions[0].endAt-winner.snapshot.sessions[0].startAt,25*60000);results.sharedServerClock=true;
 await sleep(230);loser.send({type:'emote',emote:'👋'});await until(()=>winner.snapshot?.players.find(p=>p.id===loser.id)?.emote==='👋','network emote');await sleep(220);loser.send({type:'emote',emote:'❤️'});await until(()=>loser.errors.some(e=>e.includes('Chờ')),'emote throttle');results.emoteRateLimit=true;
 const oldId=loser.id;loser.close();await until(()=>winner.snapshot?.players.length===3&&!winner.snapshot.players.some(p=>p.seatId==='sage-b'),'close releases avatar and seat');
 const resumed=open(room,loser.token);all.push(resumed);await until(()=>resumed.id,'resumed');assert.equal(resumed.id,oldId);await until(()=>winner.snapshot?.players.length===4,'no duplicate identity');results.resumeAndRelease=true;
 const owner=resumed.id===a.id?resumed:a;await sleep(230);owner.send({type:'close_room'});await until(()=>owner.terminal,'owner close');const rejected=open(room);all.push(rejected);await until(()=>rejected.handshake===410,'closed invite rejects new socket');results.privateInvitationClosed=true;
 const expired=`r-${(Date.now()-600000).toString(36)}-${randomUUID().replaceAll('-','')}`;const old=open(expired);all.push(old);await until(()=>old.handshake===410,'expired unused invitation');results.expiredInvitation=true;
 const wrong=new WebSocket(`${host}/rooms/commons`,{origin:'https://not-allowed.example'});let forbidden=0;wrong.on('unexpected-response',(_,r)=>{forbidden=r.statusCode;r.resume();wrong.terminate();});wrong.on('error',()=>{});await until(()=>forbidden===403,'origin rejected');results.originAllowlist=true;
 const staleRoom=code(),watcher=open(staleRoom),stale=open(staleRoom,undefined,false);all.push(watcher,stale);await until(()=>watcher.id&&stale.id,'heartbeat test peers');stale.send({type:'seat',seatId:'rose-a'});await until(()=>watcher.snapshot?.players.some(p=>p.seatId==='rose-a'),'heartbeat seat');await until(()=>stale.closed&&watcher.snapshot?.players.length===1,'heartbeat TTL cleans stale socket',19000);assert(!watcher.snapshot.players.some(p=>p.seatId==='rose-a'));results.heartbeatCleanup=true;
 console.log(JSON.stringify({runtime:'Cloudflare workerd local, real WebSocket connections',results},null,2));
}finally{for(const c of all)c.close();}
