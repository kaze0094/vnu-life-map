import Link from 'next/link';
import {MapPinned, Sparkles, ParkingCircle, ArrowUpRight} from 'lucide-react';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';

export default function Header() {
  return <header className="header">
    <Link href="/" className="brand">
      <HStack className="brand-icon"><MapPinned aria-hidden="true" size={23}/></HStack>
      <VStack gap={0.5}><Text type="inherit">VNU <b>LIFE MAP</b></Text><Text type="supporting" className="brand-tagline">Học tập · Khám phá · Kết nối</Text></VStack>
    </Link>
    <nav aria-label="Điều hướng chính">
      <Link href="/b2"><MapPinned aria-hidden="true" size={17}/>Khám phá B2</Link>
      <Link href="/chill" prefetch={false}><Sparkles aria-hidden="true" size={17}/>Chill Space</Link>
      <Link href="/parking"><ParkingCircle aria-hidden="true" size={17}/>Gửi xe <ArrowUpRight aria-hidden="true" size={13}/></Link>
    </nav>
    <Text type="supporting" className="preview-note">Bản thử nghiệm sinh viên</Text>
  </header>;
}
