'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {Profile,Snapshot} from '@/lib/chill/world';
export type ConnectionStatus='unconfigured'|'connecting'|'connected'|'reconnecting'|'offline'|'closed';
export function realtimeEndpoint(value:string|undefined,allowLocal=process.env.NODE_ENV!=='production'):string|null {
 if(!value)return null;
 try{const url=new URL(value);if(url.pathname!=='/'||url.search||url.username||url.password)return null;if(url.protocol==='https:'||url.protocol==='wss:')return `wss://${url.host}`;if(allowLocal&&(url.hostname==='localhost'||url.hostname==='127.0.0.1')&&(url.protocol==='http:'||url.protocol==='ws:'))return `ws://${url.host}`;}catch{}return null;
}
export function useRealtime(roomId:string,profile:Profile,joined:boolean){
 const endpoint=realtimeEndpoint(process.env.NEXT_PUBLIC_CHILL_REALTIME_URL);
 const [status,setStatus]=useState<ConnectionStatus>(endpoint?'connecting':'unconfigured');
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null);const [selfId,setSelfId]=useState<string|null>(null);const [message,setMessage]=useState('');const [offset,setOffset]=useState(0);
 const [retry,setRetry]=useState(0);const socket=useRef<WebSocket|null>(null);const token=useRef('');const stableProfile=useRef(profile);
 const send=useCallback((packet:Record<string,unknown>)=>{if(socket.current?.readyState===WebSocket.OPEN){socket.current.send(JSON.stringify(packet));return true;}return false;},[]);
 useEffect(()=>{stableProfile.current=profile;},[profile]);
 useEffect(()=>{
  if(!endpoint||!joined)return;
  if(!token.current)token.current=crypto.randomUUID().replaceAll('-','');
  let cancelled=false,terminal=false,generation=0,backoff=500;
  let reconnect:ReturnType<typeof setTimeout>|null=null;
  let heartbeat:ReturnType<typeof setInterval>|null=null;
  let ws:WebSocket|null=null;
  function connect(){
   if(cancelled||terminal)return;
   if(!navigator.onLine){setStatus('offline');return;}
   const currentGeneration=++generation;
   if(heartbeat)clearInterval(heartbeat);
   if(reconnect)clearTimeout(reconnect);
   ws?.close();setStatus('connecting');setSnapshot(null);
   const current=new WebSocket(`${endpoint}/rooms/${roomId}`);ws=current;socket.current=current;
   let lastSeen=Date.now();
   const valid=()=>!cancelled&&generation===currentGeneration;
   current.onopen=()=>{if(valid())current.send(JSON.stringify({type:'join',token:token.current,profile:stableProfile.current}));};
   current.onmessage=event=>{
    if(!valid())return;lastSeen=Date.now();let data;try{data=JSON.parse(event.data);}catch{return;}
    if(data.type==='welcome'){setSelfId(data.id);setStatus('connected');setMessage('Đã vào phòng realtime.');backoff=500;}
    if(data.type==='snapshot'){setSnapshot(data);setOffset(previous=>previous===0?data.serverNow-Date.now():previous);}
    if(data.type==='pong'&&typeof data.clientTime==='number'){const latency=Date.now()-data.clientTime;if(latency>=0&&latency<5000)setOffset(data.serverTime-(data.clientTime+Date.now())/2);}
    if(data.type==='error')setMessage(data.message);
    if(data.type==='rejected'||data.type==='closed'){terminal=true;setStatus('closed');setSnapshot(null);setMessage(data.message);current.close();}
   };
   current.onclose=()=>{if(!valid())return;if(heartbeat)clearInterval(heartbeat);heartbeat=null;if(terminal)return;setStatus(navigator.onLine?'reconnecting':'offline');setSnapshot(null);setMessage('Mất kết nối; dữ liệu cũ đã ẩn, đang chờ kết nối lại.');reconnect=setTimeout(connect,backoff);backoff=Math.min(5000,backoff*2);};
   current.onerror=()=>{if(valid())setMessage('Không kết nối được realtime. Kiểm tra mạng hoặc endpoint.');current.close();};
   heartbeat=setInterval(()=>{if(valid()&&current.readyState===WebSocket.OPEN){current.send(JSON.stringify({type:'heartbeat',clientTime:Date.now()}));if(Date.now()-lastSeen>16000)current.close();}},4000);
  }
  const offline=()=>{generation++;if(reconnect)clearTimeout(reconnect);if(heartbeat)clearInterval(heartbeat);setStatus('offline');setSnapshot(null);setMessage('Bạn đang ngoại tuyến; dữ liệu người chơi cũ đã ẩn.');ws?.close();};
  const online=()=>connect();
  connect();window.addEventListener('offline',offline);window.addEventListener('online',online);
  return()=>{cancelled=true;generation++;if(reconnect)clearTimeout(reconnect);if(heartbeat)clearInterval(heartbeat);ws?.close(1000,'Leaving');socket.current=null;window.removeEventListener('offline',offline);window.removeEventListener('online',online);};
 },[endpoint,joined,roomId,retry]);
 return {status,snapshot,selfId,message,offset,send,retry:()=>{setMessage('');setRetry(value=>value+1);}};
}
