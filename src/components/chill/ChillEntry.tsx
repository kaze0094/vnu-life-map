'use client';
import dynamic from 'next/dynamic';
const ChillApp=dynamic(()=>import('./ChillApp'),{ssr:false,loading:()=> <main className="chill-loading" role="status">Đang mở VNU Chill Space…</main>});
export default function ChillEntry({mode,roomId}:{mode:'welcome'|'private'|'shared';roomId?:string}){return <><a className="skip" href="#chill-main">Đến nội dung Chill Space</a><ChillApp mode={mode} roomId={roomId}/></>}
