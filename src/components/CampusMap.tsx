'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { campuses, mappable } from '@/lib/data';
import type { Location } from '@/lib/models';
import 'leaflet/dist/leaflet.css';
import Provenance from './Provenance';
export default function CampusMap({items}:{items:Location[]}) {const [tileError,setTileError]=useState(false); return <>{tileError&&<div role="status" className="tile-error">Không tải được bản đồ nền. Kiểm tra kết nối hoặc chuyển sang Danh sách; chưa thể dùng nền bản đồ để định vị.</div>}<MapContainer center={campuses[0].viewCenter!} zoom={16} scrollWheelZoom={false} className="leaflet-map" aria-label="Bản đồ OpenStreetMap khu vực Xuân Thủy"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" eventHandlers={{tileerror:()=>setTileError(true)}}/>{mappable(items).map(item=><CircleMarker key={item.id} center={[item.coordinates!.lat,item.coordinates!.lng]} radius={9}><Popup><strong>{item.name}</strong><p>{item.description}</p><Provenance item={item}/></Popup></CircleMarker>)}</MapContainer></>}
