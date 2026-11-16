import {ROOM_LIMIT,SEATS,SPEED,EMOTES,sanitizeProfile,findPath,distance,validSegment} from './world';
import type {Player,GroupSession,Snapshot,Point,Emote} from './world';
export const HEARTBEAT_TTL=15000;
export const ROOM_LIFETIME=2*60*60*1000;
export interface RoomMeta {roomId:string;createdAt:number;expiresAt:number|null;closed:boolean;ownerHash:string|null}
interface Member {player:Player;hash:string;connection:string;seen:number;lastMove:number;lastEmote:number;path:Point[];lastAction:number}
export class StudyRoomCore {
 readonly members=new Map<string,Member>();
 readonly tokens=new Map<string,{id:string;until:number}>();
 readonly sessions=new Map<string,GroupSession>();
 completed=0;dirty=true;lastTick:number;
 constructor(readonly meta:RoomMeta,now:number){this.lastTick=now;}
 join(connection:string,hash:string,profile:unknown,now:number):{id?:string;error?:string;replaced?:string} {
  if(this.meta.closed||(this.meta.expiresAt!==null&&now>=this.meta.expiresAt))return {error:'Phòng đã đóng hoặc hết hạn. Hãy tạo link mới.'};
  const token=this.tokens.get(hash);const old=token?this.members.get(token.id):undefined;
  if(!old&&this.members.size>=ROOM_LIMIT)return {error:`Phòng thử nghiệm đã đủ ${ROOM_LIMIT} người.`};
  const id=old?.player.id??(token&&token.until>now?token.id:crypto.randomUUID());
  const index=this.members.size;
  const player=old?.player??{id,profile:sanitizeProfile(profile),x:-3+index*2,z:2.75,yaw:0,activity:'idle',seatId:null,emote:null,emoteUntil:0};
  player.profile=sanitizeProfile(profile);
  this.members.set(id,{player,hash,connection,seen:now,lastMove:0,lastEmote:old?.lastEmote??-Infinity,path:old?.path??[],lastAction:0});
  this.tokens.set(hash,{id,until:now+10*60*1000});
  if(this.meta.roomId!=='commons'&&!this.meta.ownerHash)this.meta.ownerHash=hash;
  this.dirty=true;return {id,replaced:old?.connection};
 }
 disconnect(connection:string,now:number):void {for(const [id,m] of this.members)if(m.connection===connection){this.members.delete(id);this.tokens.set(m.hash,{id,until:now+10*60*1000});this.leaveSessions(id);this.dirty=true;}}
 private leaveSessions(id:string){for(const [table,session] of this.sessions){session.members=session.members.filter(member=>member!==id);if(!session.members.length)this.sessions.delete(table);}}
 handle(connection:string,message:Record<string,unknown>,now:number):string|null {
  const member=Array.from(this.members.values()).find(m=>m.connection===connection);if(!member)return 'Phiên chưa tham gia phòng.';
  member.seen=now;const p=member.player;
  if(message.type==='heartbeat')return null;
  if(message.type==='move'){
   if(now-member.lastMove<80)return null;member.lastMove=now;
   if(p.seatId)return null;
   const to={x:message.x as number,z:message.z as number};
   if(typeof to.x!=='number'||typeof to.z!=='number'||distance(p,to)>.65||!validSegment(p,to))return 'Vị trí không hợp lệ.';
   p.x=to.x;p.z=to.z;p.yaw=typeof message.yaw==='number'&&Number.isFinite(message.yaw)?Math.atan2(Math.sin(message.yaw),Math.cos(message.yaw)):p.yaw;p.activity=message.walking===true?'walking':'idle';this.dirty=true;return null;
  }
  if(now-member.lastAction<180)return 'Thao tác quá nhanh. Thử lại sau một chút.';member.lastAction=now;
  if(message.type==='emote'){
   if(!EMOTES.includes(message.emote as Emote))return 'Biểu cảm không hợp lệ.';
   if(now-member.lastEmote<2500)return 'Chờ một chút trước khi gửi biểu cảm tiếp.';
   member.lastEmote=now;p.emote=message.emote as Emote;p.emoteUntil=now+3500;this.dirty=true;return null;
  }
  if(message.type==='seat'){
   const seat=SEATS.find(s=>s.id===message.seatId);if(!seat)return 'Ghế không tồn tại.';
   if(Array.from(this.members.values()).some(m=>m.player.id!==p.id&&m.player.seatId===seat.id))return 'Ghế này đã có người. Chọn ghế khác nhé!';
   if(p.seatId===seat.id)return null;
   const path=findPath(p,seat);if(!path.length)return 'Chưa tìm được lối đến ghế.';
   this.leaveSessions(p.id);p.seatId=seat.id;member.path=path;p.activity='walking';this.dirty=true;return null;
  }
  if(message.type==='stand'){this.leaveSessions(p.id);const oldSeat=SEATS.find(seat=>seat.id===p.seatId);if(oldSeat){p.x=oldSeat.x;p.z=oldSeat.z+(oldSeat.z>0?.7:-.7);}p.seatId=null;member.path=[];p.activity='idle';this.dirty=true;return null;}
  if(message.type==='start_focus'||message.type==='join_focus'){
   const seat=SEATS.find(s=>s.id===p.seatId);if(!seat||member.path.length)return 'Hãy ngồi vào ghế trước.';
   if(message.type==='start_focus'){
    if(message.minutes!==25&&message.minutes!==50)return 'Chọn phiên 25 hoặc 50 phút.';
    const old=this.sessions.get(seat.tableId);if(old&&now<old.breakEnd)return 'Bàn đang có phiên học, hãy chọn tham gia.';
    this.sessions.set(seat.tableId,{tableId:seat.tableId,startAt:now,endAt:now+message.minutes*60000,breakEnd:now+(message.minutes+(message.minutes===25?5:10))*60000,minutes:message.minutes,members:[p.id]});
   }else{
    const session=this.sessions.get(seat.tableId);if(!session||now>=session.breakEnd)return 'Bàn chưa có phiên đang chạy.';
    if(!session.members.includes(p.id))session.members.push(p.id);
   }
   const session=this.sessions.get(seat.tableId)!;p.activity=now<session.endAt?'studying':'break';this.dirty=true;return null;
  }
  if(message.type==='close_room'){
   if(this.meta.roomId==='commons'||member.hash!==this.meta.ownerHash)return 'Chỉ chủ phòng riêng có thể đóng phòng.';
   this.meta.closed=true;this.dirty=true;return null;
  }
  return 'Thao tác không được hỗ trợ.';
 }
 tick(now:number){
  const dt=Math.min(.3,Math.max(0,(now-this.lastTick)/1000));this.lastTick=now;
  for(const m of [...this.members.values()]){
   if(now-m.seen>HEARTBEAT_TTL){this.disconnect(m.connection,now);continue;}
   const p=m.player;
   if(m.path.length){let travel=SPEED*dt;while(travel>0&&m.path.length){const target=m.path[0],length=distance(p,target);if(length<=travel){p.x=target.x;p.z=target.z;m.path.shift();travel-=length;}else{p.yaw=Math.atan2(target.x-p.x,target.z-p.z);p.x+=(target.x-p.x)*travel/length;p.z+=(target.z-p.z)*travel/length;travel=0;}}if(!m.path.length){const seat=SEATS.find(s=>s.id===p.seatId);p.activity='sitting';if(seat)p.yaw=seat.yaw;}this.dirty=true;}
   if(p.emote&&now>=p.emoteUntil){p.emote=null;this.dirty=true;}
   if(p.activity==='walking'&&!p.seatId&&now-m.lastMove>500){p.activity='idle';this.dirty=true;}
  }
  for(const [table,session] of this.sessions){
   if(now>=session.breakEnd){this.sessions.delete(table);for(const id of session.members){const p=this.members.get(id)?.player;if(p)p.activity='sitting';}this.dirty=true;continue;}
   if(now>=session.endAt){let newlyDone=false;for(const id of session.members){const p=this.members.get(id)?.player;if(p&&p.activity==='studying'){p.activity='break';newlyDone=true;}}if(newlyDone){this.completed++;this.dirty=true;}}
  }
  for(const [hash,token] of this.tokens)if(token.until<now&&!this.members.has(token.id))this.tokens.delete(hash);
  if(this.meta.expiresAt!==null&&now>=this.meta.expiresAt)this.meta.closed=true;
 }
 snapshot(now:number):Snapshot{return {type:'snapshot',players:Array.from(this.members.values(),m=>structuredClone(m.player)),sessions:Array.from(this.sessions.values(),s=>structuredClone(s)),serverNow:now,limit:ROOM_LIMIT,expiresAt:this.meta.expiresAt,ownerId:Array.from(this.members.values()).find(m=>m.hash===this.meta.ownerHash)?.player.id??null,completed:this.completed};}
}
