import Header from '@/components/Header';
import Footer from '@/components/Footer';
import B2Highlights from '@/components/B2Highlights';
export const metadata={title:'Khám phá B2 · VNU LIFE MAP'};
export default function B2Page(){return <><Header/><main className="b2-landing"><section className="hero"><div><span className="eyebrow">VNU LIFE MAP · BẢN THỬ NGHIỆM CUỘC THI</span><h1>Khám phá B2.<br/><em>Học tập & gửi xe tại ULIS.</em></h1><p>Thông tin khảo sát có nguồn. Điều kiện tiếp cận rõ ràng.<br/>Không phải dữ liệu chỗ trống thời gian thực.</p></div></section><B2Highlights/></main><Footer/></>}
