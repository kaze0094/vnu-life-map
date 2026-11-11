'use client';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { campuses, mappable } from '@/lib/data';
import type { Location } from '@/lib/models';
import 'leaflet/dist/leaflet.css';
export default function CampusMap({items}:{items:Location[]}) {return <MapContainer center={campuses[0].viewCenter!} zoom={16} scrollWheelZoom={false} className="leaflet-map" aria-label="Bản đồ OpenStreetMap khu vực Xuân Thủy"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{mappable(items).map(item=><CircleMarker key={item.id} center={[item.coordinates!.lat,item.coordinates!.lng]} radius={9}><Popup>{item.name}</Popup></CircleMarker>)}</MapContainer>}
