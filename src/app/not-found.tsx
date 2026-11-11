import Link from 'next/link';
export default function NotFound(){return <main className="detail-page"><h1>Không tìm thấy địa điểm</h1><p>Mã địa điểm không tồn tại trong dữ liệu hiện tại.</p><Link href="/parking">Quay lại danh sách gửi xe →</Link></main>}
