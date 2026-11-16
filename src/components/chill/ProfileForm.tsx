'use client';
import {useId} from 'react';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {Check} from 'lucide-react';
import {COLORS,HAIR_COLORS} from '@/lib/chill/world';
import type {Profile} from '@/lib/chill/world';

export default function ProfileForm({profile,onChange}:{profile:Profile;onChange:(profile:Profile)=>void}) {
  const hint=useId();
  return <fieldset className="chill-profile"><legend>Avatar của bạn</legend>
    <label>Biệt danh<input aria-label="Biệt danh" aria-describedby={hint} maxLength={18} value={profile.nick} onChange={e=>onChange({...profile,nick:e.target.value})} autoComplete="off"/></label>
    <Text id={hint} type="supporting">Tối đa 18 ký tự. Dùng biệt danh, không nhập họ tên thật hoặc mã sinh viên.</Text>
    <VStack className="chill-profile-options">
      <label>Kiểu tóc<select aria-label="Kiểu tóc" value={profile.style} onChange={e=>onChange({...profile,style:e.target.value as Profile['style']})}><option value="short">Tóc ngắn</option><option value="bob">Tóc bob</option><option value="bun">Tóc búi</option></select></label>
      <label>Màu tóc<select aria-label="Màu tóc" value={profile.hair} onChange={e=>onChange({...profile,hair:e.target.value})}>{HAIR_COLORS.map((color,i)=><option key={color} value={color}>{['Nâu đậm','Nâu hạt dẻ','Vàng mật ong','Đen khói'][i]}</option>)}</select></label>
    </VStack>
    <Text type="label">Màu áo</Text>
    <HStack className="chill-swatches" wrap="wrap" role="group" aria-label="Màu áo">{COLORS.map((color,i)=><button type="button" key={color} style={{background:color}} aria-label={`Màu áo ${i+1}`} aria-pressed={profile.shirt===color} onClick={()=>onChange({...profile,shirt:color})}>{profile.shirt===color&&<Check size={18} aria-hidden="true"/>}</button>)}</HStack>
  </fieldset>;
}
