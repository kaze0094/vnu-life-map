import Link from 'next/link';
import { MapPinned, ArrowUpRight } from 'lucide-react';
export default function Header(){return <header className="header"><Link href="/" className="brand"><span className="brand-icon"><MapPinned size={23}/></span><span>VNU <b>LIFE MAP</b><small>KHÔNG GIAN CHO ĐỜI SỐNG SINH VIÊN</small></span></Link><nav aria-label="Điều hướng chính"><Link href="/">Khám phá</Link><Link href="/parking">Gửi xe <ArrowUpRight size={14}/></Link></nav><span className="sprint">SPRINT 1.1 <span>•</span> BẢN THỬ NGHIỆM</span></header>}
