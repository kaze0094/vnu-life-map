'use client';
import {useReducer,useState} from 'react';
import {CalendarDays,Ticket,Clock3} from 'lucide-react';
import {BOOKING_SLOTS,DEMO_SEATS,bookingReducer,initialBookingState,demoDay,nextDemoDay,demoDateTime,demoRemaining} from '@/lib/booking';
import type {BookingStatus} from '@/lib/booking';
const statusLabels:Record<BookingStatus,string>={reserved:'Đã đặt DEMO',checked_in:'Đã check-in DEMO',checked_out:'Đã check-out',cancelled:'Đã huỷ',no_show:'No-show · không đến nhận chỗ',expired:'Hết giờ · đã giải phóng chỗ'};
export default function BookingDemo(){
 const [state,dispatch]=useReducer(bookingReducer,undefined,()=>initialBookingState(Date.now()));
 const [date,setDate]=useState(()=>nextDemoDay(Date.now()));
 const [slotId,setSlotId]=useState<string>(BOOKING_SLOTS[0].id);
 const slot=BOOKING_SLOTS.find(item=>item.id===slotId)!;
 const remaining=demoRemaining(state,date,slotId);
 return <section id="booking-demo" className="booking-demo" aria-labelledby="booking-title">
  <div className="booking-heading"><Ticket size={24}/><div><span className="demo-label">DEMO · KHÔNG GIỮ CHỖ THẬT</span><h2 id="booking-title">Thử đặt một ghế Homies</h2></div></div>
  <p>Không phải xác nhận của ULIS. Kho <strong>{DEMO_SEATS} chỗ giả lập mỗi khung giờ</strong> độc lập với 98 ghế khảo sát. Dữ liệu chỉ ở trang này, sẽ mất khi tải lại hoặc rời trang.</p>
  <form className="booking-form" onSubmit={event=>{event.preventDefault();dispatch({type:'reserve',date,slotId});}}>
   <label><span><CalendarDays size={16}/> Chọn ngày DEMO</span><input type="date" value={date} min={demoDay(state.now)} required onChange={event=>setDate(event.target.value)}/></label>
   <label><span><Clock3 size={16}/> Chọn khung giờ DEMO</span><select value={slotId} onChange={event=>setSlotId(event.target.value)}>{BOOKING_SLOTS.map(item=><option key={item.id} value={item.id} disabled={demoRemaining(state,date,item.id)===0}>{item.start}–{item.end} · {demoRemaining(state,date,item.id)} chỗ DEMO</option>)}</select></label>
   <div className="demo-inventory"><strong>{remaining} / {DEMO_SEATS}</strong><span>chỗ có thể đặt trong mô phỏng</span></div>
   <button className="primary-action" disabled={!date||remaining===0||demoDateTime(date,slot.start)<state.now} type="submit">Đặt 1 ghế DEMO</button>
  </form>
  <p className={`booking-message ${state.accepted===false?'rejected':''}`} role="status" aria-live="polite">{state.message}</p>
  {state.bookings.length>0&&<div className="booking-history" aria-label="Các lượt đặt DEMO">{[...state.bookings].reverse().map(booking=><article key={booking.id} className="booking-ticket"><div><strong>{booking.id}</strong><span className={`booking-status ${booking.status}`}>{statusLabels[booking.status]}</span></div><p>{booking.date.split('-').reverse().join('/')} · {BOOKING_SLOTS.find(item=>item.id===booking.slotId)?.start}–{BOOKING_SLOTS.find(item=>item.id===booking.slotId)?.end} · 1 ghế DEMO</p><div className="booking-ticket-actions">{booking.status==='reserved'&&<><button onClick={()=>dispatch({type:'go_to_start',id:booking.id})}>Mô phỏng tới giờ nhận chỗ</button><button onClick={()=>dispatch({type:'checkin',id:booking.id})}>Check-in DEMO</button><button onClick={()=>dispatch({type:'cancel',id:booking.id})}>Huỷ đặt DEMO</button></>}{booking.status==='checked_in'&&<button onClick={()=>dispatch({type:'checkout',id:booking.id})}>Check-out DEMO</button>}</div></article>)}</div>}
  <details className="demo-clock" open><summary>Điều khiển thời gian mô phỏng</summary><p>Đồng hồ DEMO: <strong>{new Date(state.now).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</strong> (giờ Việt Nam). Đồng hồ chỉ đổi bằng các nút bên dưới.</p><div className="booking-ticket-actions"><button onClick={()=>dispatch({type:'advance',minutes:30})}>+30 phút DEMO</button><button onClick={()=>dispatch({type:'advance',minutes:120})}>+2 giờ DEMO</button><button onClick={()=>{const now=Date.now();dispatch({type:'reset',now});setDate(nextDemoDay(now));setSlotId(BOOKING_SLOTS[0].id);}}>Đặt lại booking DEMO</button></div><p>Check-in từ 15 phút trước giờ bắt đầu. Sau 15 phút chưa check-in → no-show; quá giờ kết thúc khi đang check-in → hết hạn và giải phóng chỗ mô phỏng.</p></details>
 </section>;
}
