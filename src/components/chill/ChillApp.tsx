'use client';
import {useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight,BookHeart,UsersRound} from 'lucide-react';
import PrivateSpace from './PrivateSpace';
import SharedSpace from './SharedSpace';
const World=dynamic(()=>import('./World'),{ssr:false,loading:()=> <div className="chill-loading">Một thế giới nhỏ đang mở…</div>});
export default function ChillApp({mode,roomId='commons'}:{mode:'welcome'|'private'|'shared';roomId?:string}){
 const controls=useRef({x:0,z:0,interact:0});const [tour,setTour]=useState(true);
 if(mode==='private')return <PrivateSpace/>;if(mode==='shared')return <SharedSpace roomId={roomId}/>;
 return <main className="chill-welcome"><Link href="/" className="chill-back"><ArrowLeft size={16}/>VNU LIFE MAP</Link><div className="chill-welcome-grid"><section><span className="chill-kicker">A COZY LITTLE STUDY WORLD</span><h1>VNU<br/><em>CHILL SPACE</em></h1><p className="chill-tagline">Your little world, our study space.</p><p>Một căn phòng nhỏ để tập trung.<br/>Một chiếc bàn chung để học cùng bạn bè.</p><div className="chill-mode-cards"><Link href="/chill/private"><BookHeart size={25}/><div><strong>Học một mình</strong><small>My Chill Space · Phòng riêng, cây & mèo</small></div><ArrowUpRight size={19}/></Link><Link href="/chill/together"><UsersRound size={25}/><div><strong>Học cùng bạn bè</strong><small>Study Together · Người thật, cùng nhịp học</small></div><ArrowUpRight size={19}/></Link></div>{tour&&<section className="chill-tour"><h2>Bắt đầu thật nhẹ nhàng</h2><ol><li>Di chuyển và khám phá.</li><li>Chạm vào đồ vật để tương tác.</li><li>Bắt đầu phiên học của bạn.</li></ol><button onClick={()=>setTour(false)}>Bỏ qua hướng dẫn</button></section>}</section><div className="chill-preview-scene" aria-label="Cảnh 3D phòng học nhỏ"><World solo players={[]} selfId={null} controls={controls} mood="morning" motion tree={1} onMove={()=>{}} onSeat={()=>{}} onCat={()=>{}} onTree={()=>{}} onWish={()=>{}}/></div></div><footer className="chill-welcome-footer">Không cần thông tin sinh viên · Âm thanh mặc định tắt · Không phải điểm rèn luyện</footer></main>;
}
