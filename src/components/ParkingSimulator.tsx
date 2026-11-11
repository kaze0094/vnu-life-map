'use client';
import { useState } from 'react';
import { demo, occupancyPercent } from '@/lib/data';
import { availableCount, parkingState, recommendAlternatives, simulateEvent } from '@/lib/simulation';
const initial = demo.filter(lot => lot.id.startsWith('SIM-'));
const labels = {unknown:'Chưa biết',available:'Còn chỗ',crowded:'Đông xe',full:'Đã đầy'};
export default function ParkingSimulator({initialId}:{initialId?:string}){
 const [lots,setLots]=useState(()=>initial.map(lot=>({...lot})));
 const [selectedId,setSelectedId]=useState(initial.find(lot=>lot.id===initialId)?.id ?? initial[0].id);
 const [message,setMessage]=useState('Chọn một bãi để thử sự kiện xe vào hoặc ra.');
 const selected=lots.find(lot=>lot.id===selectedId)!;
 const alternatives=recommendAlternatives(lots,selectedId);
 function event(kind:'entry'|'exit') {setLots(previous=>simulateEvent(previous,selectedId,kind));setMessage(`${selected.name}: mô phỏng một xe ${kind==='entry'?'vào':'ra'}.`);}
 return <section className="simulator" aria-labelledby="sim-title"><div className="demo-banner"><strong>MÔ PHỎNG SMART PARKING · DỮ LIỆU HƯ CẤU</strong><p>Không liên quan bãi xe VNU. Không có tọa độ, chỉ đường hay kết nối hệ thống thẻ. Thay đổi chỉ tồn tại trong phiên này; rời chế độ sẽ đặt lại.</p></div><div className="sim-body"><h2 id="sim-title">Thử một ngày gửi xe</h2><p>Đầy: 100% · Đông xe: từ 80% · Còn chỗ: dưới 80%. Đây là quy tắc minh họa.</p><div className="sim-lots">{lots.map(lot=><button key={lot.id} aria-pressed={lot.id===selectedId} onClick={()=>{setSelectedId(lot.id);setMessage(`Đã chọn ${lot.name}.`)}} className={`sim-lot ${parkingState(lot)}`}><small>HƯ CẤU · {lot.id}</small><strong>{lot.name}</strong><span>{labels[parkingState(lot)]}</span><span>Đang có {lot.occupancy} / {lot.capacity} xe</span><b>Còn {availableCount(lot)} chỗ · {occupancyPercent(lot.capacity,lot.occupancy)}%</b></button>)}</div><div className="sim-controls"><h3>{selected.name} · Mô phỏng</h3><button disabled={availableCount(selected)===0} onClick={()=>event('entry')}>+ Mô phỏng xe vào</button><button disabled={selected.occupancy===0} onClick={()=>event('exit')}>− Mô phỏng xe ra</button><button onClick={()=>{setLots(initial.map(lot=>({...lot})));setSelectedId(initial[0].id);setMessage('Đã đặt lại dữ liệu mô phỏng.')}}>Đặt lại mô phỏng</button><p role="status" aria-live="polite">{message}</p>{parkingState(selected)==='full'&&<div className="recommendations"><h3>Bãi hư cấu đã đầy · Gợi ý thay thế</h3>{alternatives.length?alternatives.map(lot=><button key={lot.id} onClick={()=>{setSelectedId(lot.id);setMessage(`Đã chọn bãi thay thế ${lot.name}.`)}}>{lot.name} — còn {availableCount(lot)} chỗ</button>):<p>Tất cả bãi mô phỏng đã đầy. Thử mô phỏng xe ra.</p>}<p>Gợi ý theo số chỗ giả lập, không phải khoảng cách hoặc tuyến đường.</p></div>}</div></div></section>
}
