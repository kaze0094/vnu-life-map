'use client';
import { useReducer } from 'react';
import { demo, occupancyPercent } from '@/lib/data';
import { availableCount, parkingState, recommendAlternatives, simulateEvent, resetSimulation } from '@/lib/simulation';
import type { Parking } from '@/lib/models';
import type { ParkingEvent, RejectionReason } from '@/lib/simulation';
const initial = demo.filter(lot => lot.id.startsWith('SIM-'));
const labels = {unknown:'Chưa biết',available:'Còn chỗ',crowded:'Đông xe',full:'Đã đầy'};
interface ViewState { lots: Parking[]; selectedId: string; message: string }
type Action = {type:'event'; kind:ParkingEvent} | {type:'select'; id:string} | {type:'reset'};
const rejections: Record<RejectionReason,string> = {not_found:'Không tìm thấy bãi mô phỏng.',real_record:'Không thể mô phỏng trên dữ liệu thực.',invalid_lot:'Dữ liệu mô phỏng không hợp lệ.',full:'Bãi đã đầy, không thể nhận thêm xe.',empty:'Bãi đang trống, không có xe để ra.'};
function initialState(id?: string): ViewState {
  return {lots:resetSimulation(initial),selectedId:initial.find(lot=>lot.id===id)?.id??initial[0].id,message:'Chọn một bãi để thử sự kiện xe vào hoặc ra.'};
}
function reducer(state: ViewState, action: Action): ViewState {
  if (action.type==='reset') return {...initialState(),message:'Đã đặt lại dữ liệu mô phỏng.'};
  if (action.type==='select') return {...state,selectedId:action.id,message:`Đã chọn ${state.lots.find(lot=>lot.id===action.id)?.name}.`};
  const result=simulateEvent(state.lots,state.selectedId,action.kind);
  const name=state.lots.find(lot=>lot.id===state.selectedId)?.name;
  return {...state,lots:result.lots,message:result.accepted?`${name}: đã mô phỏng một xe ${action.kind==='entry'?'vào':'ra'}.`:`Không thực hiện sự kiện: ${rejections[result.reason]}`};
}
export default function ParkingSimulator({initialId}:{initialId?:string}){
 const [{lots,selectedId,message},dispatch]=useReducer(reducer,initialId,initialState);
 const selected=lots.find(lot=>lot.id===selectedId)!;
 const alternatives=recommendAlternatives(lots,selectedId);
 return <section className="simulator" aria-labelledby="sim-title"><div className="demo-banner"><strong>MÔ PHỎNG SMART PARKING · DỮ LIỆU HƯ CẤU</strong><p>Không liên quan bãi xe VNU. Không có tọa độ, chỉ đường hay kết nối hệ thống thẻ. Thay đổi chỉ tồn tại trong phiên này; rời chế độ sẽ đặt lại.</p></div><div className="sim-body"><h2 id="sim-title">Thử một ngày gửi xe</h2><p>Đầy: 100% · Đông xe: từ 80% · Còn chỗ: dưới 80%. Đây là quy tắc minh họa.</p><div className="sim-lots">{lots.map(lot=><button key={lot.id} aria-pressed={lot.id===selectedId} onClick={()=>dispatch({type:'select',id:lot.id})} className={`sim-lot ${parkingState(lot)}`}><small>HƯ CẤU · {lot.id}</small><strong>{lot.name}</strong><span>{labels[parkingState(lot)]}</span><span>Đang có {lot.occupancy} / {lot.capacity} xe</span><b>Còn {availableCount(lot)} chỗ · {occupancyPercent(lot.capacity,lot.occupancy)}%</b></button>)}</div><div className="sim-controls"><h3>{selected.name} · Mô phỏng</h3><button disabled={availableCount(selected)===0} onClick={()=>dispatch({type:'event',kind:'entry'})}>+ Mô phỏng xe vào</button><button disabled={selected.occupancy===0} onClick={()=>dispatch({type:'event',kind:'exit'})}>− Mô phỏng xe ra</button><button onClick={()=>dispatch({type:'reset'})}>Đặt lại mô phỏng</button><p role="status" aria-live="polite">{message}</p>{parkingState(selected)==='full'&&<div className="recommendations"><h3>Bãi hư cấu đã đầy · Gợi ý thay thế</h3>{alternatives.length?alternatives.map(lot=><button key={lot.id} onClick={()=>dispatch({type:'select',id:lot.id})}>{lot.name} — còn {availableCount(lot)} chỗ</button>):<p>Tất cả bãi mô phỏng đã đầy. Thử mô phỏng xe ra.</p>}<p>Gợi ý theo số chỗ giả lập, không phải khoảng cách hoặc tuyến đường.</p></div>}</div></div></section>
}
