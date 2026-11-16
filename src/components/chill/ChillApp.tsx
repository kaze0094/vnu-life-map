'use client';
import {useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {ArrowLeft,ArrowUpRight,BookHeart,UsersRound,Leaf,VolumeX,ShieldCheck,Sparkles} from 'lucide-react';
import PrivateSpace from './PrivateSpace';
import SharedSpace from './SharedSpace';
const World=dynamic(()=>import('./World'),{ssr:false,loading:()=> <VStack role="status" className="chill-loading">Một thế giới nhỏ đang mở…</VStack>});

export default function ChillApp({mode,roomId='commons'}:{mode:'welcome'|'private'|'shared';roomId?:string}) {
  const controls=useRef({x:0,z:0,interact:0});
  const [tour,setTour]=useState(true);
  if(mode==='private')return <PrivateSpace/>;
  if(mode==='shared')return <SharedSpace roomId={roomId}/>;
  return <main id="chill-main" className="chill-welcome">
    <nav className="chill-welcome-nav" aria-label="Điều hướng Chill Space"><Link href="/" className="chill-back"><ArrowLeft size={17} aria-hidden="true"/>VNU LIFE MAP</Link><Text type="supporting">Không gian của sinh viên</Text></nav>
    <VStack className="chill-welcome-grid">
      <section className="chill-intro"><VStack gap={4}>
        <HStack gap={2} className="chill-kicker"><Sparkles size={16} aria-hidden="true"/><Text type="label">VNU CHILL SPACE</Text></HStack>
        <Heading level={1}>Một góc nhỏ.<br/><em>Một nhịp học riêng.</em></Heading>
        <Text display="block" as="p" className="chill-tagline">Dành một chút bình yên cho việc học.</Text>
        <Text display="block" as="p" color="secondary">Ở bên cây và mèo trong căn phòng của bạn, hoặc cùng bạn bè ngồi xuống một chiếc bàn chung.</Text>
      </VStack></section>
      <VStack className="chill-preview-wrap" gap={3}>
        <VStack className="chill-preview-scene" role="img" aria-label="Cảnh 3D phòng học nhỏ"><World solo players={[]} selfId={null} controls={controls} mood="morning" motion tree={1} onMove={()=>{}} onSeat={()=>{}} onCat={()=>{}} onTree={()=>{}} onWish={()=>{}}/></VStack>
        <Text display="block" as="p" type="supporting" className="chill-scene-caption"><Leaf size={14} aria-hidden="true"/>Cứ chậm một chút. Căn phòng vẫn ở đây.</Text>
      </VStack>
      <section className="chill-choose" aria-label="Chọn không gian học"><VStack gap={3} className="chill-mode-cards">
        <Link href="/chill/private"><HStack className="chill-mode-icon"><BookHeart size={25} aria-hidden="true"/></HStack><VStack gap={2} className="chill-mode-copy"><Heading level={2}>Học một mình</Heading><Text type="supporting">My Chill Space · Cây, mèo & Pomodoro</Text></VStack><ArrowUpRight size={20} aria-hidden="true"/></Link>
        <Link href="/chill/together"><HStack className="chill-mode-icon"><UsersRound size={25} aria-hidden="true"/></HStack><VStack gap={2} className="chill-mode-copy"><Heading level={2}>Học cùng bạn bè</Heading><Text type="supporting">Study Together · Cùng bàn, cùng nhịp học</Text></VStack><ArrowUpRight size={20} aria-hidden="true"/></Link>
      </VStack></section>
      {tour&&<section className="chill-tour"><Heading level={2}>Bắt đầu thật nhẹ nhàng</Heading><ol><li>Chọn không gian và avatar của bạn.</li><li>Di chuyển, chạm vào ghế để ngồi.</li><li>Bắt đầu một phiên học theo nhịp của mình.</li></ol><Button label="Bỏ qua hướng dẫn" variant="ghost" onClick={()=>setTour(false)}/></section>}
    </VStack>
    <footer className="chill-welcome-footer"><HStack gap={4} wrap="wrap"><Text type="supporting"><ShieldCheck size={16} aria-hidden="true"/>Không cần thông tin sinh viên</Text><Text type="supporting"><VolumeX size={16} aria-hidden="true"/>Âm thanh mặc định tắt</Text></HStack><Text display="block" as="p" type="supporting">Một góc học tự nguyện, không phải điểm rèn luyện.</Text></footer>
  </main>;
}
