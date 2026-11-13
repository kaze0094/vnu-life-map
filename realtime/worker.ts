import {DurableObject} from 'cloudflare:workers';
import {StudyRoomCore,ROOM_LIFETIME} from '../src/lib/chill/room';
import type {RoomMeta} from '../src/lib/chill/room';
interface Env {STUDY_ROOMS:DurableObjectNamespace<ChillRoom>;ALLOWED_ORIGINS:string}
interface Attachment {connection:string;opened:number;hash?:string;messages:number;window:number}
const validRoom=(id:string)=>id==='commons'||/^r-[a-z0-9]{7,10}-[a-f0-9]{32}$/.test(id);
async function hashToken(token:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
const handler={async fetch(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url);
 if(url.pathname==='/health')return Response.json({service:'VNU Chill realtime',protocol:1});
 const id=url.pathname.match(/^\/rooms\/([^/]+)$/)?.[1];if(!id||!validRoom(id))return new Response('Not found',{status:404});
 if(request.headers.get('Upgrade')?.toLowerCase()!=='websocket')return new Response('WebSocket required',{status:426});
 const origin=request.headers.get('Origin');const origins=(env.ALLOWED_ORIGINS??'').split(',').map(s=>s.trim()).filter(Boolean);
 if(!origin||!origins.includes(origin))return new Response('Origin not allowed',{status:403});
 return env.STUDY_ROOMS.get(env.STUDY_ROOMS.idFromName(id)).fetch(request);
}};
export default handler;
export class ChillRoom extends DurableObject<Env> {
 core:StudyRoomCore|null=null;loop:ReturnType<typeof setInterval>|null=null;lastBroadcast=0;meta:RoomMeta|null=null;
 constructor(ctx:DurableObjectState,env:Env){super(ctx,env);ctx.blockConcurrencyWhile(async()=>{this.meta=await ctx.storage.get<RoomMeta>('meta')??null;});}
 async fetch(request:Request):Promise<Response>{
  const id=new URL(request.url).pathname.split('/').pop()!;const now=Date.now();
  if(!this.meta){
   if(id!=='commons'){
    const created=parseInt(id.split('-')[1],36);if(!Number.isFinite(created)||Math.abs(now-created)>5*60000)return new Response('Invite expired',{status:410});
   }
   this.meta={roomId:id,createdAt:now,expiresAt:id==='commons'?null:now+ROOM_LIFETIME,closed:false,ownerHash:null};await this.ctx.storage.put('meta',this.meta);
   if(this.meta.expiresAt)await this.ctx.storage.setAlarm(this.meta.expiresAt);
  }
  if(this.meta.closed||(this.meta.expiresAt!==null&&now>=this.meta.expiresAt))return new Response('Room closed',{status:410});
  if(this.ctx.getWebSockets().length>=8)return new Response('Too many connections',{status:429});
  if(!this.core)this.core=new StudyRoomCore(this.meta,now);
  const pair=new WebSocketPair();const [client,server]=Object.values(pair);this.ctx.acceptWebSocket(server);
  const attachment:Attachment={connection:crypto.randomUUID(),opened:now,messages:0,window:now};server.serializeAttachment(attachment);
  this.startLoop();return new Response(null,{status:101,webSocket:client});
 }
 private startLoop(){if(this.loop)return;this.loop=setInterval(()=>{
  if(!this.core)return;
  const now=Date.now();this.core.tick(now);
  for(const ws of this.ctx.getWebSockets()){
   const a=ws.deserializeAttachment() as Attachment;
   if(!a.hash&&now-a.opened>5000){ws.close(1008,'Join timeout');continue;}
   if(a.hash&&!Array.from(this.core.members.values()).some(m=>m.connection===a.connection))ws.close(1000,'Session expired');
  }
  if(this.core.meta.closed){void this.closeAll();return;}
  if(this.core.dirty||now-this.lastBroadcast>=1000)this.broadcast(now);
  if(!this.ctx.getWebSockets().length){if(this.loop)clearInterval(this.loop);this.loop=null;}
 },100);}
 private send(ws:WebSocket,value:unknown){try{ws.send(JSON.stringify(value));}catch{/* onClose / TTL cleans membership */}}
 private broadcast(now=Date.now()){if(!this.core)return;const packet=JSON.stringify(this.core.snapshot(now));for(const ws of this.ctx.getWebSockets())if((ws.deserializeAttachment() as Attachment).hash){try{ws.send(packet);}catch{}}this.lastBroadcast=now;this.core.dirty=false;}
 async webSocketMessage(ws:WebSocket,raw:string|ArrayBuffer){
  if(typeof raw!=='string'||raw.length>2048){ws.close(1009,'Message too large');return;}
  const a=ws.deserializeAttachment() as Attachment;const now=Date.now();
  if(now-a.window>1000){a.window=now;a.messages=0;}if(++a.messages>35){ws.close(1008,'Rate limited');return;}ws.serializeAttachment(a);
  let message:Record<string,unknown>;try{const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error();message=parsed;}catch{this.send(ws,{type:'error',message:'Gói tin không hợp lệ.'});return;}
  if(!this.core){ws.close(1012,'Reconnect');return;}
  if(message.type==='join'){
   if(a.hash){this.send(ws,{type:'error',message:'Phiên đã tham gia.'});return;}
   if(typeof message.token!=='string'||!/^[a-f0-9]{32,64}$/.test(message.token)){ws.close(1008,'Invalid session');return;}
   const hash=await hashToken(message.token);
   // No awaits between authoritative room mutation and seat/snapshot decisions.
   const joined=this.core.join(a.connection,hash,message.profile,Date.now());
   if(joined.error){this.send(ws,{type:'rejected',message:joined.error});ws.close(1000,'Room unavailable');return;}
   a.hash=hash;ws.serializeAttachment(a);await this.ctx.storage.put('meta',this.core.meta);
   if(joined.replaced)for(const previous of this.ctx.getWebSockets())if(previous!==ws&&(previous.deserializeAttachment() as Attachment).connection===joined.replaced)previous.close(1000,'Session replaced');
   this.send(ws,{type:'welcome',id:joined.id});this.broadcast();return;
  }
  if(!a.hash){this.send(ws,{type:'error',message:'Hãy tham gia phòng trước.'});return;}
  const error=this.core.handle(a.connection,message,now);if(error)this.send(ws,{type:'error',message:error});
  if(message.type==='heartbeat')this.send(ws,{type:'pong',clientTime:message.clientTime,serverTime:Date.now()});
  if(this.core.meta.closed){await this.closeAll();return;}
  if(message.type!=='move'&&message.type!=='heartbeat')this.broadcast();
 }
 webSocketClose(ws:WebSocket){this.remove(ws);try{ws.close(1000,'Left room');}catch{}}
 webSocketError(ws:WebSocket){this.remove(ws);try{ws.close(1011,'Connection error');}catch{}}
 private remove(ws:WebSocket){const a=ws.deserializeAttachment() as Attachment|null;if(a)this.core?.disconnect(a.connection,Date.now());this.broadcast();}
 private async closeAll(){if(!this.core)return;await this.ctx.storage.put('meta',this.core.meta);for(const ws of this.ctx.getWebSockets()){this.send(ws,{type:'closed',message:'Phòng đã đóng hoặc hết hạn.'});ws.close(1000,'Room closed');}if(this.loop)clearInterval(this.loop);this.loop=null;}
 async alarm(){if(this.meta){this.meta.closed=true;if(this.core)this.core.meta.closed=true;await this.closeAll();await this.ctx.storage.deleteAll();}}
}
