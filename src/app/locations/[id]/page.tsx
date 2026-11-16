import Link from 'next/link';
import {notFound} from 'next/navigation';
import {repository,isB2} from '@/lib/data';
import B2Detail from '@/components/B2Detail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Provenance from '@/components/Provenance';
export default async function LocationPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const item=repository.findLocation(id);if(!item||item.category==='parking')notFound();if(isB2(item))return <B2Detail item={item}/>;return <><Header/><main className="detail-page"><Link href="/" className="back">← Bản đồ khuôn viên</Link><h1>{item.name}</h1><p className="detail-description">{item.description}</p><Provenance item={item}/><section className="detail-note"><h2>Dữ liệu còn cần xác minh</h2><p>Giờ hoạt động, tiện ích và điều kiện tiếp cận: chưa xác minh. Không có dữ liệu khả dụng trực tiếp.</p>{item.coordinates===null&&<p>Chưa xác minh tọa độ; địa điểm chỉ được hiển thị trong danh sách.</p>}</section></main><Footer/></>}
