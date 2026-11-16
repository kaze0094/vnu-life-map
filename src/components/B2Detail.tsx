import Link from 'next/link';
import {ArrowLeft,MapPin} from 'lucide-react';
import type {B2Place} from '@/lib/models';
import Header from './Header';
import Footer from './Footer';
import Provenance from './Provenance';
import DetailMap,{BookingDemoClient} from './DetailMap';
import LocationPanel from './LocationPanel';
export default function B2Detail({item}:{item:B2Place}){
 const details=item.details;
 return <><a className="skip" href="#main">Đến nội dung chính</a><Header/><main id="main" className="student-detail">
  <Link href="/" className="back"><ArrowLeft size={16}/> Bản đồ tiện ích</Link>
  <header className="student-detail-heading"><span>ULIS · Xuân Thủy</span><h1>{item.name}</h1></header>
  <div className="student-detail-grid"><section className="student-detail-card"><LocationPanel item={item} heading={false} detailsLink={false}/>
   {details.kind==='homies'?<p className="access-note">98 ghế ghi nhận khi khảo sát, không phải sức chứa tối đa chính thức. Cán bộ kiểm tra thẻ tại cửa; không đồng nghĩa được vào không điều kiện.</p>:<p className="access-note">Sức chứa vận hành khoảng 480 xe máy, không phải số chỗ đang trống. Cổng vào và ra dùng chung.</p>}
   <details className="evidence-details"><summary>Thông tin sử dụng & nguồn dữ liệu</summary>
    {details.kind==='homies'?<><h2>Giờ sử dụng trong prototype</h2><p><strong>{details.openingHours.opens}–{details.openingHours.closes}</strong> theo chủ dự án, giờ Việt Nam. Lịch cán bộ/sinh viên/sự kiện nhóm và hiệu lực lịch chi tiết vẫn chờ xác nhận. Mang thẻ sinh viên ULIS và tuân theo cán bộ giám sát.</p><p>Sức chứa tối đa chính thức: chưa xác nhận. Tiện ích: {Object.keys(details.amenities).join(', ')} — chưa xác minh.</p></>:<><h2>Thông tin gửi xe</h2><p>{details.entryProcess} {details.exitProcess}</p><p>{details.cameraProcess}</p><p>Nhà cung cấp: chưa xác minh. Không có dữ liệu số xe trực tiếp từ hệ thống hiện tại.</p><h2>Quan sát quá khứ · 11/11/2026</h2><p>Khoảng 480–500 xe máy; {details.observedStatus.toLowerCase()}. Không phải số xe hiện tại.</p><h2>Ghi chú lịch sử</h2><p>Khoảng 400 xe máy theo hướng dẫn thi ULIS trước đây, do nhóm cung cấp; không phải sức chứa hiện tại. {details.differenceExplanation}</p></>}
    <Provenance item={item}/>
   </details>
  </section><section className="student-detail-map"><h2><MapPin size={17}/>{details.kind==='parking'?'Cổng vào / ra chung':'Vị trí Homies B2'}</h2><DetailMap item={item}/></section></div>
  {details.kind==='homies'&&<BookingDemoClient/>}
  <div className="b2-bottom-links"><Link href={details.kind==='homies'?'/parking/ULIS-PARKING-B2':'/locations/ULIS-HOMIES-B2'}>{details.kind==='homies'?'Xem Nhà xe B2':'Xem Homies B2'} →</Link><Link href="/">Quay lại bản đồ →</Link></div>
 </main><Footer/></>;
}
