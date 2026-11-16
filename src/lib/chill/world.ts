export const ROOM_LIMIT=4;
export const SPEED=2.1;
export const EMOTES=['👋','❤️','📚','💪','☕','🎉'] as const;
export type Emote=typeof EMOTES[number];
export const COLORS=['#69a89a','#e4a0ad','#8da6c7','#c3a27a','#a39ac7','#ece2c9'];
export const HAIR_COLORS=['#49362d','#886247','#d1aa70','#3a3b46'];
export interface Profile {nick:string;shirt:string;hair:string;style:'short'|'bob'|'bun'}
export interface Point {x:number;z:number}
export const TABLES=[{id:'sage',name:'Bàn Lá',x:-2,z:0},{id:'rose',name:'Bàn Mây',x:2,z:0}];
export const SEATS=TABLES.flatMap(table=>[{id:`${table.id}-a`,tableId:table.id,x:table.x,z:1.25,yaw:Math.PI},{id:`${table.id}-b`,tableId:table.id,x:table.x,z:-1.25,yaw:0}]);
export const SOLO_SEAT={id:'desk',tableId:'desk',x:0,z:1.25,yaw:Math.PI};
export type Activity='idle'|'walking'|'sitting'|'studying'|'break';
export interface Player extends Point {id:string;profile:Profile;yaw:number;activity:Activity;seatId:string|null;emote:Emote|null;emoteUntil:number}
export interface GroupSession {tableId:string;startAt:number;endAt:number;breakEnd:number;minutes:25|50;members:string[]}
export interface Snapshot {type:'snapshot';selfId?:string;players:Player[];sessions:GroupSession[];serverNow:number;limit:number;expiresAt:number|null;ownerId:string|null;completed:number}
export const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.z-b.z);
export function sanitizeProfile(input:unknown):Profile {
 const p=(input&&typeof input==='object'?input:{}) as Partial<Profile>;
 const nick=typeof p.nick==='string'?Array.from(p.nick.replace(/[^\p{L}\p{N} _-]/gu,' ').trim()).slice(0,18).join(''):'Bạn học';
 return {nick:nick||'Bạn học',shirt:COLORS.includes(p.shirt??'')?p.shirt!:COLORS[0],hair:HAIR_COLORS.includes(p.hair??'')?p.hair!:HAIR_COLORS[0],style:['short','bob','bun'].includes(p.style??'')?p.style!:'short'};
}
export function walkable(p:Point,solo=false,allowedSeats:string[]=[]):boolean {
 if(!Number.isFinite(p.x)||!Number.isFinite(p.z)||Math.abs(p.x)>4.35||Math.abs(p.z)>3.35)return false;
 const tables=solo?[{x:0,z:0}]:TABLES;
 if(tables.some(t=>Math.abs(p.x-t.x)<1.02&&Math.abs(p.z-t.z)<.78))return false;
 if(Math.abs(p.x+3.9)<.7&&Math.abs(p.z+2.9)<.55)return false;
 return !(solo?[SOLO_SEAT]:SEATS).some(seat=>!allowedSeats.includes(seat.id)&&distance(p,seat)<.4);
}
export function stepPosition(from:Point,dx:number,dz:number,solo=false):Point {
 const next={...from};if(walkable({x:from.x+dx,z:from.z},solo))next.x+=dx;
 if(walkable({x:next.x,z:from.z+dz},solo))next.z+=dz;
 return next;
}
export function validSegment(from:Point,to:Point,solo=false,allowedSeats:string[]=[]):boolean {
 if(!walkable(to,solo,allowedSeats)||!walkable(from,solo,allowedSeats))return false;
 const steps=Math.max(1,Math.ceil(distance(from,to)/.08));
 for(let i=1;i<=steps;i++)if(!walkable({x:from.x+(to.x-from.x)*i/steps,z:from.z+(to.z-from.z)*i/steps},solo,allowedSeats))return false;
 return true;
}
export function findPath(from:Point,to:Point,solo=false):Point[] {
 const allowedSeats=(solo?[SOLO_SEAT]:SEATS).filter(seat=>distance(seat,from)<.5||distance(seat,to)<.5).map(seat=>seat.id);
 const grid=.25;const key=(p:Point)=>`${Math.round(p.x/grid)},${Math.round(p.z/grid)}`;
 const snap=(p:Point)=>({x:Math.round(p.x/grid)*grid,z:Math.round(p.z/grid)*grid});
 const start=snap(from),goal=snap(to);const queue=[start];const parent=new Map<string,Point|null>([[key(start),null]]);
 for(let index=0;index<queue.length;index++){
  const current=queue[index];if(key(current)===key(goal)){const out:Point[]=[];let p:Point|null=current;while(p){out.push(p);p=parent.get(key(p))??null;}return [...out.reverse().slice(1),to];}
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
   const p={x:current.x+dx*grid,z:current.z+dz*grid};if(parent.has(key(p))||!walkable(p,solo,allowedSeats)||!validSegment(current,p,solo,allowedSeats))continue;parent.set(key(p),current);queue.push(p);
  }
 }
 return [];
}
