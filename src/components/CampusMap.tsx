'use client';
import { useReducer, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, AttributionControl } from 'react-leaflet';
import type { TileEvent, CircleMarker as LeafletCircleMarker } from 'leaflet';
import { campuses, mappable, detailHref } from '@/lib/data';
import { tileHealth, tileProvider } from '@/lib/map';
import type { Location } from '@/lib/models';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import Provenance from './Provenance';
const provider = tileProvider(process.env.NEXT_PUBLIC_MAP_TILE_URL, process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION);
const tileKey = (event: TileEvent) => `${event.coords.z}/${event.coords.x}/${event.coords.y}`;
export default function CampusMap({items,onShowList,listHref='#location-list'}:{items:Location[];onShowList?:()=>void;listHref?:string}) {
  const [health,dispatch] = useReducer(tileHealth,{loading:true,failed:[]});
  const [attempt,setAttempt] = useState(0);
  const failed = provider.error !== null || health.failed.length > 0;
  return <>
    <div className={`tile-status ${failed?'tile-error':''}`} role="status" aria-live="polite">
      {failed ? <><p>{provider.error ?? 'Một phần bản đồ nền chưa tải được. Xem phạm vi tọa độ trong từng ghim; không dựa vào nền trống để định hướng.'}</p><a href={listHref} onClick={event=>{if(onShowList){event.preventDefault();onShowList();}}}>Xem danh sách địa điểm</a>{provider.url&&<button onClick={()=>{dispatch({type:'retry'});setAttempt(previous=>previous+1);}}>Thử tải lại bản đồ</button>}</> : health.loading ? <span>Đang tải bản đồ nền… Bạn vẫn có thể xem danh sách.</span> : <span>Bản đồ nền đã tải. Xem nguồn và phạm vi tọa độ trong từng ghim.</span>}
    </div>
    <MapContainer center={items.length===1&&items[0].coordinates?[items[0].coordinates.lat,items[0].coordinates.lng]:campuses[0].viewCenter!} zoom={items.length===1?18:16} scrollWheelZoom={false} attributionControl={false} className="leaflet-map" aria-label="Bản đồ khu vực Xuân Thủy">
      {provider.url&&<TileLayer key={attempt} url={provider.url} eventHandlers={{
        loading:()=>dispatch({type:'loading'}), load:()=>dispatch({type:'complete'}),
        tileerror:(event)=>dispatch({type:'error',key:tileKey(event)}),
        tileload:(event)=>dispatch({type:'success',key:tileKey(event)}),
        tileunload:(event)=>dispatch({type:'unload',key:tileKey(event)}),
      }}/>}
      <AttributionControl prefix={provider.attribution}/>
      {mappable(items).map(item=><CircleMarker key={item.id} center={[item.coordinates!.lat,item.coordinates!.lng]} radius={9} pathOptions={{color:item.verification.status==='field_verified'?'#087f79':'#617e92',fillOpacity:.65}} eventHandlers={{add:event=>{
        const marker=event.target as LeafletCircleMarker;
        const element=marker.getElement();
        if(element){element.setAttribute('tabindex','0');element.setAttribute('role','button');element.setAttribute('aria-label',`Xem ${item.name}`);element.addEventListener('keydown',key=>{const pressed=key as KeyboardEvent;if(pressed.key==='Enter'||pressed.key===' '){pressed.preventDefault();marker.openPopup();}});}
      }}}><Popup><strong>{item.name}</strong><p>{item.description}</p><p>{item.coordinateRole==='shared_gate'?'Cổng vào / ra chung theo báo cáo nhóm':'Điểm vị trí, không xác nhận lối vào'}</p><Provenance item={item}/><Link className="detail-link" href={detailHref(item)}>Xem chi tiết →</Link></Popup></CircleMarker>)}
    </MapContainer>
  </>;
}
