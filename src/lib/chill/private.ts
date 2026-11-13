import type {Profile} from './world';
import {sanitizeProfile} from './world';
export type Mood='morning'|'sunset'|'rain'|'silent';
export interface PrivateProgress {version:1;profile:Profile;mood:Mood;sessions:number;minutes:number;wish:string;motion:boolean}
export const STORAGE_KEY='vnu-chill-private-v1';
export const defaultProgress=():PrivateProgress=>({version:1,profile:sanitizeProfile({nick:'Bạn học'}),mood:'morning',sessions:0,minutes:0,wish:'',motion:true});
export function readProgress(raw:string|null):PrivateProgress {
 try{const value=JSON.parse(raw??'null');if(!value||value.version!==1)return defaultProgress();return {version:1,profile:sanitizeProfile(value.profile),mood:['morning','sunset','rain','silent'].includes(value.mood)?value.mood:'morning',sessions:Number.isInteger(value.sessions)&&value.sessions>=0?Math.min(10000,value.sessions):0,minutes:typeof value.minutes==='number'&&Number.isFinite(value.minutes)&&value.minutes>=0?Math.min(1000000,value.minutes):0,wish:typeof value.wish==='string'?Array.from(value.wish).slice(0,120).join(''):'',motion:value.motion!==false};}catch{return defaultProgress();}
}
export function treeStage(sessions:number){return sessions>=8?4:sessions>=4?3:sessions>=2?2:sessions>=1?1:0;}
export const TREE_STAGES=['Hạt giống','Mầm xanh','Cây non','Cây trưởng thành','Cây nở hoa'];
export interface FocusState {phase:'idle'|'focus'|'break'|'paused';pausedPhase:'focus'|'break';endsAt:number|null;remaining:number;focusMs:number;breakMs:number;completed:number;minutes:number;message:string}
export const initialFocus=():FocusState=>({phase:'idle',pausedPhase:'focus',endsAt:null,remaining:0,focusMs:25*60000,breakMs:5*60000,completed:0,minutes:0,message:'Đến bàn học để bắt đầu phiên của bạn.'});
export type FocusAction={type:'start';minutes:number;breakMinutes:number;now:number}|{type:'tick'|'pause'|'resume';now:number}|{type:'stop'};
export function focusReducer(s:FocusState,a:FocusAction):FocusState {
 if(a.type==='start'){
  if(!Number.isInteger(a.minutes)||a.minutes<1||a.minutes>120||!Number.isInteger(a.breakMinutes)||a.breakMinutes<1||a.breakMinutes>30)return {...s,message:'Thời gian hợp lệ: học 1–120 phút, nghỉ 1–30 phút.'};
  if(s.phase!=='idle')return {...s,message:'Kết thúc phiên hiện tại trước khi bắt đầu phiên mới.'};
  return {...s,phase:'focus',endsAt:a.now+a.minutes*60000,remaining:a.minutes*60000,focusMs:a.minutes*60000,breakMs:a.breakMinutes*60000,message:'Đồng hồ đang chạy. Học theo nhịp của bạn nhé!'};
 }
 if(a.type==='stop')return {...s,phase:'idle',endsAt:null,remaining:0,message:'Đã kết thúc sớm; không cộng phiên hoặc phát triển cây.'};
 if(a.type==='pause'){
  if(s.phase!=='focus'&&s.phase!=='break')return s;
  const settled=focusReducer(s,{type:'tick',now:a.now});if(settled.phase==='idle')return settled;
  return {...settled,phase:'paused',pausedPhase:settled.phase==='focus'?'focus':'break',remaining:Math.max(0,(settled.endsAt??a.now)-a.now),endsAt:null,message:'Đã tạm dừng đồng hồ.'};
 }
 if(a.type==='resume')return s.phase==='paused'?{...s,phase:s.pausedPhase,endsAt:a.now+s.remaining,message:'Đã tiếp tục đồng hồ.'}:s;
 if((s.phase!=='focus'&&s.phase!=='break')||s.endsAt===null)return s;
 if(a.now<s.endsAt)return {...s,remaining:s.endsAt-a.now};
 if(s.phase==='focus'){
  const breakEnd=s.endsAt+s.breakMs;return {...s,phase:a.now<breakEnd?'break':'idle',endsAt:a.now<breakEnd?breakEnd:null,remaining:Math.max(0,breakEnd-a.now),completed:s.completed+1,minutes:s.minutes+s.focusMs/60000,message:'Đồng hồ đã chạy hết một phiên! Cây nhận thêm một bước phát triển. Nghỉ và uống nước nhé.'};
 }
 return {...s,phase:'idle',endsAt:null,remaining:0,message:'Đã hết giờ nghỉ. Bắt đầu phiên mới khi bạn sẵn sàng.'};
}
export const clockText=(ms:number)=>{const seconds=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;};
