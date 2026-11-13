'use client';
import {useState} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {Search,MapPin,BookOpen,ParkingCircle,Library,Presentation,Utensils,Coffee,BedDouble,Volleyball,Printer,HeartPulse,Landmark,Bus,Map,Rows3,ArrowUpRight} from 'lucide-react';
import {filterUtilities,repository,mappable,detailHref} from '@/lib/data';
import type {UtilityFilter} from '@/lib/data';
import type {DataMode} from '@/lib/models';
import ParkingSimulator from './ParkingSimulator';
const CampusMap=dynamic(()=>import('./CampusMap'),{ssr:false,loading:()=> <div role="status" className="map-loading">Đang chuẩn bị bản đồ…</div>});
const utilities=[{id:'homies',name:'Homies',icon:BookOpen,active:true},{id:'parking',name:'Nhà xe',icon:ParkingCircle,active:true},{id:'library',name:'Thư viện',icon:Library},{id:'classroom',name:'Phòng học',icon:Presentation},{id:'canteen',name:'Căn tin',icon:Utensils},{id:'coffee',name:'Quán cà phê',icon:Coffee},{id:'dorm',name:'Ký túc xá',icon:BedDouble},{id:'sport',name:'Sân thể thao',icon:Volleyball},{id:'print',name:'In ấn',icon:Printer},{id:'health',name:'Y tế',icon:HeartPulse},{id:'atm',name:'ATM',icon:Landmark},{id:'bus',name:'Xe buýt',icon:Bus}];
export default function Explorer({parkingOnly=false}:{parkingOnly?:boolean}){
 const [query,setQuery]=useState('');
 const [utility,setUtility]=useState<UtilityFilter>(parkingOnly?'parking':'all');
 const [mode,setMode]=useState<DataMode>('real');
 const [view,setView]=useState<'map'|'list'>('map');
 const items=filterUtilities(repository.list(mode),query,utility,mode);
 const title=utility==='homies'?'Homies':utility==='parking'?'Nhà xe':'Địa điểm';
 function chooseUtility(value:UtilityFilter){setUtility(value);setMode('real');setView('map');}
 function showList(){setView('list');requestAnimationFrame(()=>document.getElementById('location-list')?.focus());}
 return <div className="student-home">
  <section className="student-welcome"><div><h1>{parkingOnly?'Tìm chỗ gửi xe.':'Hôm nay bạn muốn đi đâu?'}</h1><p>Khám phá tiện ích trong khuôn viên ĐHQGHN</p></div><span className="campus-pill"><MapPin size={15}/>Xuân Thủy</span></section>
  {!parkingOnly&&<section className="utility-grid" aria-label="Tiện ích khuôn viên">{utilities.map(({id,name,icon:Icon,active})=><button key={id} disabled={!active} aria-pressed={active?utility===id:undefined} className={`utility-card ${active?'available':'coming-soon'}`} onClick={()=>chooseUtility(id as UtilityFilter)}><Icon size={23}/><span>{name}</span><small>{active?'Khám phá':'Sắp ra mắt'}</small></button>)}</section>}
  <section className="student-explorer" aria-label="Bản đồ tiện ích">
   <div className="student-map-toolbar"><label className="student-search"><Search size={18}/><input aria-label="Tìm địa điểm" placeholder="Tìm Homies, nhà xe…" value={query} onChange={event=>setQuery(event.target.value)}/></label><div className="student-map-tabs"><button aria-pressed={view==='map'} onClick={()=>setView('map')} disabled={mode==='demo'}><Map size={16}/>Bản đồ</button><button aria-pressed={view==='list'} onClick={()=>setView('list')}><Rows3 size={16}/>Danh sách</button></div></div>
   {(utility!=='all'||query)&&<div className="student-filter-line"><span>{mode==='demo'?'Minh họa hư cấu':title} <small>· {items.length} địa điểm</small></span><button onClick={()=>{setQuery('');chooseUtility(parkingOnly?'parking':'all');}}> {utility==='all'&&!query?'Tất cả':'Xoá bộ lọc'}</button></div>}
   {mode==='demo'?<><div className="demo-banner">DEMO NHÀ XE · Dữ liệu hư cấu, không phải bãi xe B2.</div><ParkingSimulator/></>:view==='map'?<div className="map-panel student-map"><CampusMap key={utility} items={items} onShowList={showList}/>{!mappable(items).length&&<div className="map-empty"><strong>Chưa có điểm trên bản đồ</strong><p>{items.length?'Các địa điểm này đang chờ xác minh vị trí.':'Thử từ khoá khác hoặc xoá bộ lọc.'}</p><button onClick={showList}>Xem danh sách</button></div>}</div>:null}
   {(view==='list'||mode==='demo')&&<section id="location-list" tabIndex={-1} className="student-list" aria-label="Danh sách địa điểm">{items.length?items.map(item=>{const content=<><div className={`list-item-icon ${item.category==='parking'?'parking':'homies'}`}>{item.category==='parking'?<ParkingCircle size={24}/>:<BookOpen size={24}/>}</div><div><h2>{item.name}</h2><p>{item.verification.status==='pending_verification'?'Chờ xác minh':item.mode==='demo'?'Minh họa hư cấu':'Chưa có dữ liệu chỗ trống trực tiếp.'}</p></div><ArrowUpRight size={19}/></>;return item.mode==='demo'&&item.category!=='parking'?<article className="student-list-item" key={item.id}>{content}</article>:<Link className="student-list-item" key={item.id} href={detailHref(item)}>{content}</Link>}):<div className="empty"><Search size={25}/><h2>Chưa tìm thấy địa điểm</h2><p>Thử từ khoá khác hoặc đặt lại bộ lọc.</p><button onClick={()=>{setQuery('');setUtility(parkingOnly?'parking':'all');}}>Đặt lại bộ lọc</button></div>}</section>}
  </section>
  <div className="student-secondary-nav"><Link href="/b2">Khám phá B2</Link><span>·</span><button onClick={()=>{setMode(mode==='real'?'demo':'real');setUtility('all');setQuery('');setView(mode==='real'?'list':'map');}}>{mode==='real'?'Thử mô phỏng nhà xe':'Trở về dữ liệu thực'}</button><span>·</span><span>Hòa Lạc · Sắp ra mắt</span></div>
 </div>;
}
