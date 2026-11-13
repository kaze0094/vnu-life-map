import Link from 'next/link';
import {Navigation,ArrowUpRight,Clock3,Ticket,IdCard} from 'lucide-react';
import type {Location} from '@/lib/models';
import {isB2,detailHref,directionsHref} from '@/lib/data';
export default function LocationPanel({item,heading=true,detailsLink=true}:{item:Location;heading?:boolean;detailsLink?:boolean}){
 const details=isB2(item)?item.details:null;
 const directions=directionsHref(item);
 return <div className="student-location-panel">
  {heading&&<h3>{item.name}</h3>}
  {details?<><div className="availability-line"><span>{details.kind==='homies'?'Chỗ trống / ghế quan sát':'Chỗ trống / sức chứa ước tính'}</span><strong>{details.kind==='homies'?`— / ${details.seatingObserved} ghế khảo sát`:`— / ≈ ${details.operationalCapacityApprox} xe máy`}</strong></div><p className="unknown-availability">Chưa có dữ liệu chỗ trống trực tiếp.</p>
   <div className="quick-facts">{details.kind==='homies'?<><span><Clock3 size={16}/>{details.openingHours.opens}–{details.openingHours.closes}</span><span><IdCard size={16}/>Mang thẻ sinh viên ULIS</span><small>Cán bộ kiểm tra thẻ tại cửa · Miễn phí</small></>:<><span><Ticket size={16}/>{details.feePerEntryVnd.toLocaleString('vi-VN')}đ / lượt</span><span><Clock3 size={16}/>Giờ mở cửa: chưa xác minh</span><small>Nhận thẻ khi vào, trả thẻ khi ra · Chung một cổng</small></>}</div>
  </>:<p>{item.verification.status==='pending_verification'?'Chờ xác minh · Chưa có thông tin khả dụng.':'Chưa có dữ liệu chỗ trống trực tiếp.'}</p>}
  <div className="location-actions">{details?.kind==='homies'&&<Link className="primary-action" href={`${detailHref(item)}#booking-demo`}>Đặt chỗ DEMO <Ticket size={15}/></Link>}{directions&&<a className="secondary-action" href={directions} target="_blank" rel="noreferrer">Chỉ đường <Navigation size={15}/></a>}{detailsLink&&<Link className="panel-detail-link" href={detailHref(item)}>Chi tiết <ArrowUpRight size={15}/></Link>}</div>
  {directions&&<small className="point-note">{item.coordinateRole==='shared_gate'?'Điểm đến: cổng vào / ra chung.':'Điểm vị trí; lối vào chưa được xác nhận.'}</small>}
 </div>;
}
