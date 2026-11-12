import { sources } from '@/lib/data';
import type { Location } from '@/lib/models';
export default function Provenance({item}:{item:Location}) {
  const source=sources.find(s=>s.id===item.sourceId);
  const status=item.verification.status;
  const label=item.mode==='demo'?'Dữ liệu minh họa':status==='source_verified'?'Đối chiếu nguồn công khai':status==='field_verified'?'Khảo sát theo báo cáo nhóm':status==='rejected'?'Không được xác nhận':'Chờ xác minh';
  return <div className="provenance">
    <span className="badge">{label}</span>
    <p>Nguồn: {source?.url?<a href={source.url} target="_blank" rel="noreferrer">{source.name}</a>:source?.name}</p>
    {item.verification.verifiedAt&&status!=='field_verified'&&<p>Ngày đối chiếu nguồn: <time dateTime={item.verification.verifiedAt}>{item.verification.verifiedAt.slice(0,10)}</time></p>}
    {status==='field_verified'&&<p>Ngày khảo sát: {item.verification.verifiedAt?<time dateTime={item.verification.verifiedAt}>{item.verification.verifiedAt.slice(0,10)}</time>:'Chưa được cung cấp'}. Theo báo cáo nhóm, không xác nhận tình trạng hiện tại hoặc phê duyệt của ULIS.</p>}
    {status==='source_verified'&&<p>Chưa khảo sát thực địa · Điểm đại diện, không phải lối vào. Không hàm ý được nhà trường cho phép hoặc xác nhận.</p>}
    <p>Cập nhật bản ghi: <time dateTime={item.updatedAt}>{item.updatedAt.length===10?item.updatedAt.split('-').reverse().join('/'):new Date(item.updatedAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})} </time></p>
  </div>;
}
