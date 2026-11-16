'use client';
import dynamic from 'next/dynamic';
import type { Location } from '@/lib/models';
const CampusMap=dynamic(()=>import('./CampusMap'),{ssr:false,loading:()=> <div role="status" className="map-loading">Đang chuẩn bị bản đồ…</div>});
export default function DetailMap({item}:{item:Location}) {return <div className="map-panel detail-map"><CampusMap items={[item]} listHref="/b2#b2-locations"/></div>}

const Booking=dynamic(()=>import('./BookingDemo'),{ssr:false,loading:()=> <div id="booking-demo" role="status" className="booking-loading">Đang chuẩn bị đặt chỗ DEMO…</div>});
export function BookingDemoClient(){return <Booking/>}
