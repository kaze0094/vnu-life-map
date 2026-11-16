'use client';
import {useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Search,MapPin,BookOpen,ParkingCircle,Library,Presentation,Utensils,Coffee,BedDouble,Volleyball,Printer,HeartPulse,Landmark,Bus,Map,Rows3,ArrowUpRight,Sparkles,X,ChevronDown,ShieldCheck} from 'lucide-react';
import {filterUtilities,repository,mappable,detailHref} from '@/lib/data';
import type {UtilityFilter} from '@/lib/data';
import type {DataMode} from '@/lib/models';
import ParkingSimulator from './ParkingSimulator';
const CampusMap=dynamic(()=>import('./CampusMap'),{ssr:false,loading:()=> <VStack role="status" className="map-loading">Đang chuẩn bị bản đồ…</VStack>});
const utilities=[{id:'homies',name:'Homies',icon:BookOpen,active:true},{id:'parking',name:'Nhà xe',icon:ParkingCircle,active:true},{id:'library',name:'Thư viện',icon:Library},{id:'classroom',name:'Phòng học',icon:Presentation},{id:'canteen',name:'Căn tin',icon:Utensils},{id:'coffee',name:'Quán cà phê',icon:Coffee},{id:'dorm',name:'Ký túc xá',icon:BedDouble},{id:'sport',name:'Sân thể thao',icon:Volleyball},{id:'print',name:'In ấn',icon:Printer},{id:'health',name:'Y tế',icon:HeartPulse},{id:'atm',name:'ATM',icon:Landmark},{id:'bus',name:'Xe buýt',icon:Bus}];

export default function Explorer({parkingOnly=false}:{parkingOnly?:boolean}) {
  const [query,setQuery]=useState('');
  const search=useRef<HTMLInputElement>(null);
  const [utility,setUtility]=useState<UtilityFilter>(parkingOnly?'parking':'all');
  const [mode,setMode]=useState<DataMode>('real');
  const [view,setView]=useState<'map'|'list'>('map');
  const items=filterUtilities(repository.list(mode),query,utility,mode);
  const title=utility==='homies'?'Homies':utility==='parking'?'Nhà xe':'Địa điểm';
  function chooseUtility(value:UtilityFilter){setUtility(value);setMode('real');setView('map');}
  function showList(){setView('list');requestAnimationFrame(()=>document.getElementById('location-list')?.focus());}
  function reset(){setQuery('');setUtility(parkingOnly?'parking':'all');search.current?.focus();}
  return <VStack className="student-home">
    <section className="student-welcome">
      <VStack gap={3} className="welcome-copy">
        <HStack gap={2} className="campus-caption"><MapPin size={15} aria-hidden="true"/><Text type="label">Xuân Thủy · ĐHQGHN</Text></HStack>
        <Heading level={1}>{parkingOnly?'Gửi xe, rồi yên tâm học.':'Một ngày ở trường, dễ dàng hơn.'}</Heading>
        <Text display="block" as="p" color="secondary">{parkingOnly?'Tìm nhà xe và xem thông tin có nguồn.':'Tìm một góc học, một chỗ gửi xe, hay một người bạn cùng tập trung.'}</Text>
        <Link className="welcome-b2-link" href="/b2">Khám phá B2 <ArrowUpRight size={16} aria-hidden="true"/></Link>
      </VStack>
      <VStack className="welcome-aside" gap={3}><ShieldCheck size={25} aria-hidden="true"/><Text type="label">Biết rõ trước khi đến.</Text><Text display="block" as="p" color="secondary">Thông tin khảo sát, nguồn công khai và nội dung chờ xác minh luôn được phân biệt.</Text></VStack>
    </section>
    {!parkingOnly&&<section className="utility-section" aria-label="Tiện ích khuôn viên">
      <VStack className="utility-grid active-utilities">
        <Link href="/chill" prefetch={false} className="utility-card available chill-utility"><Sparkles size={25} aria-hidden="true"/><Text type="label">Chill Space</Text><Text type="supporting">Học & kết nối</Text><ArrowUpRight className="utility-arrow" size={17} aria-hidden="true"/></Link>
        {utilities.filter(item=>item.active).map(({id,name,icon:Icon})=><button key={id} aria-pressed={utility===id} className="utility-card available" onClick={()=>chooseUtility(id as UtilityFilter)}><Icon size={25} aria-hidden="true"/><Text type="label">{name}</Text><Text type="supporting">{id==='homies'?'Góc học trong trường':'Thông tin gửi xe'}</Text></button>)}
      </VStack>
      <details className="coming-utilities"><summary>Thêm tiện ích <Text type="supporting">10 mục sắp ra mắt</Text><ChevronDown size={16} aria-hidden="true"/></summary><VStack className="utility-grid pending-utilities">{utilities.filter(item=>!item.active).map(({id,name,icon:Icon})=><button key={id} disabled className="utility-card coming-soon"><Icon size={22} aria-hidden="true"/><Text type="label">{name}</Text><Text type="supporting">Sắp ra mắt</Text></button>)}</VStack></details>
    </section>}
    <section className="student-explorer" aria-label="Bản đồ tiện ích">
      <HStack className="explorer-section-heading"><Heading level={2}>Khám phá khuôn viên</Heading><Text type="supporting">{mode==='real'?'Dữ liệu có nguồn':'Dữ liệu hư cấu'}</Text></HStack>
      <VStack className="student-map-toolbar">
        <label className="student-search"><Search size={20} aria-hidden="true"/><input ref={search} type="search" aria-label="Tìm địa điểm" placeholder="Tìm Homies, nhà xe…" value={query} onChange={event=>setQuery(event.target.value)}/>{query&&<button type="button" aria-label="Xóa từ khóa tìm kiếm" onClick={()=>{setQuery('');search.current?.focus();}}><X size={17} aria-hidden="true"/></button>}</label>
        <HStack className="map-view-row" wrap="wrap" gap={3}>
          <HStack className="scope-filters" gap={1} aria-label="Lọc loại địa điểm">
            {!parkingOnly&&<button aria-pressed={utility==='all'} onClick={()=>chooseUtility('all')}>Tất cả</button>}
            {!parkingOnly&&<button aria-pressed={utility==='homies'} onClick={()=>chooseUtility('homies')}>Homies</button>}
            <button aria-pressed={utility==='parking'} onClick={()=>chooseUtility('parking')}>Nhà xe</button>
          </HStack>
          <HStack className="student-map-tabs" aria-label="Cách xem địa điểm"><button aria-pressed={view==='map'} onClick={()=>setView('map')} disabled={mode==='demo'}><Map size={17} aria-hidden="true"/>Bản đồ</button><button aria-pressed={view==='list'} onClick={showList}><Rows3 size={17} aria-hidden="true"/>Danh sách</button></HStack>
        </HStack>
      </VStack>
      <HStack className="student-filter-line"><Text type="supporting" role="status" aria-live="polite">{mode==='demo'?'Minh họa hư cấu':title} · {items.length} địa điểm{mode==='real'?` · ${mappable(items).length} điểm có vị trí`:''}</Text>{(utility!==(parkingOnly?'parking':'all')||query)&&<button onClick={reset}>Xoá bộ lọc</button>}</HStack>
      {mode==='demo'?<><Text display="block" as="p" className="demo-banner">DEMO NHÀ XE · Dữ liệu hư cấu, không phải bãi xe B2.</Text><ParkingSimulator/></>:view==='map'?<VStack className="map-panel student-map"><CampusMap key={utility} items={items} onShowList={showList}/>{!mappable(items).length&&<VStack gap={3} className="map-empty"><Heading level={3}>Chưa có điểm trên bản đồ</Heading><Text display="block" as="p">{items.length?'Các địa điểm này đang chờ xác minh vị trí.':'Thử từ khoá khác hoặc xoá bộ lọc.'}</Text><Button label="Xem danh sách" variant="primary" onClick={showList}/></VStack>}</VStack>:null}
      {(view==='list'||mode==='demo')&&<section id="location-list" tabIndex={-1} className="student-list" aria-label="Danh sách địa điểm">{items.length?items.map(item=>{
        const status=item.mode==='demo'?'Minh họa hư cấu':item.verification.status==='pending_verification'?'Chờ xác minh':item.verification.status==='field_verified'?'Theo khảo sát nhóm':item.verification.status==='rejected'?'Không được xác nhận':'Đối chiếu nguồn công khai';
        const content=<><HStack className={`list-item-icon ${item.category==='parking'?'parking':'homies'}`}>{item.category==='parking'?<ParkingCircle size={24} aria-hidden="true"/>:<BookOpen size={24} aria-hidden="true"/>}</HStack><VStack gap={2} className="list-item-copy"><Heading level={3}>{item.name}</Heading><Text type="supporting" className="location-source-label">{status}</Text><Text type="supporting">{item.verification.status==='pending_verification'?'Thông tin vị trí đang được xác minh.':item.mode==='demo'?'Tách biệt hoàn toàn với dữ liệu thực.':'Chưa có dữ liệu chỗ trống trực tiếp.'}</Text></VStack><ArrowUpRight size={19} aria-hidden="true"/></>;
        return item.mode==='demo'&&item.category!=='parking'?<article className="student-list-item" key={item.id}>{content}</article>:<Link className="student-list-item" key={item.id} href={detailHref(item)}>{content}</Link>;
      }):<VStack gap={4} className="empty"><Search size={28} aria-hidden="true"/><Heading level={3}>Chưa tìm thấy địa điểm</Heading><Text display="block" as="p">Thử từ khoá khác hoặc đặt lại bộ lọc để khám phá tiếp.</Text><Button label="Đặt lại bộ lọc" variant="primary" onClick={reset}/></VStack>}</section>}
      {mode==='real'&&<Text display="block" as="p" className="map-context-note">Chỉ đặt ghim tại vị trí đã có nguồn xác nhận. Địa điểm chưa có tọa độ vẫn nằm trong danh sách.</Text>}
    </section>
    <nav className="student-secondary-nav" aria-label="Khám phá thêm"><Link href="/b2">Khám phá B2</Link><button onClick={()=>{setMode(mode==='real'?'demo':'real');setUtility('all');setQuery('');setView(mode==='real'?'list':'map');}}>{mode==='real'?'Thử mô phỏng nhà xe':'Trở về dữ liệu thực'}</button><Text type="supporting">Hòa Lạc · Sắp ra mắt</Text></nav>
  </VStack>;
}
