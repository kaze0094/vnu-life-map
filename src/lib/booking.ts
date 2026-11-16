// This entire module is fictional, browser-session-only demonstration state.
// Its three-seat inventory is independent of the 98 chairs observed at B2.
export const DEMO_SEATS = 3;
export const BOOKING_SLOTS = [
  {id:'early',start:'06:45',end:'08:00',others:1},
  {id:'morning',start:'08:00',end:'10:00',others:2},
  {id:'full',start:'10:00',end:'12:00',others:3},
  {id:'noon',start:'12:00',end:'14:00',others:0},
  {id:'afternoon',start:'14:00',end:'16:00',others:1},
  {id:'late',start:'16:00',end:'18:00',others:1},
  {id:'evening',start:'18:00',end:'20:00',others:0},
] as const;
export type BookingStatus = 'reserved'|'checked_in'|'checked_out'|'cancelled'|'no_show'|'expired';
export interface DemoBooking {id:string;date:string;slotId:string;status:BookingStatus;start:number;end:number}
export interface BookingState {now:number;bookings:DemoBooking[];nextId:number;message:string;accepted:boolean|null}
export type BookingAction = {type:'reserve';date:string;slotId:string}|{type:'cancel'|'checkin'|'checkout';id:string}|{type:'advance';minutes:number}|{type:'go_to_start';id:string}|{type:'reset';now:number};
const MINUTE=60000;
export const demoDay=(now:number)=>new Date(now+7*60*MINUTE).toISOString().slice(0,10);
export const nextDemoDay=(now:number)=>demoDay(now+24*60*MINUTE);
export const demoDateTime=(date:string,time:string)=>Date.parse(`${date}T${time}:00+07:00`);
const active=(booking:DemoBooking)=>booking.status==='reserved'||booking.status==='checked_in';
export function initialBookingState(now:number):BookingState{return {now,bookings:[],nextId:1,message:'Chọn ngày và khung giờ để thử đặt một ghế DEMO.',accepted:null};}
export function settleBookings(bookings:DemoBooking[],now:number):DemoBooking[]{return bookings.map(booking=>{
  if(booking.status==='reserved'&&now>booking.start+15*MINUTE)return {...booking,status:'no_show'};
  if(booking.status==='checked_in'&&now>=booking.end)return {...booking,status:'expired'};
  return booking;
});}
export function demoRemaining(state:BookingState,date:string,slotId:string):number {
  const slot=BOOKING_SLOTS.find(item=>item.id===slotId);
  if(!slot)return 0;
  const held=settleBookings(state.bookings,state.now).filter(booking=>booking.date===date&&booking.slotId===slotId&&active(booking)).length;
  return Math.max(0,DEMO_SEATS-slot.others-held);
}
function validDay(date:string):boolean {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
  const noon=demoDateTime(date,'12:00');
  return Number.isFinite(noon)&&demoDay(noon)===date;
}
export function bookingReducer(previous:BookingState,action:BookingAction):BookingState {
  if(action.type==='reset')return {...initialBookingState(action.now),message:'Đã đặt lại mô phỏng đặt chỗ.'};
  const state={...previous,bookings:settleBookings(previous.bookings,previous.now)};
  const reject=(message:string):BookingState=>({...state,accepted:false,message});
  if(action.type==='advance'||action.type==='go_to_start'){
    let now=state.now;
    if(action.type==='advance'){
      if(!Number.isFinite(action.minutes)||action.minutes<=0)return reject('Khoảng thời gian mô phỏng không hợp lệ.');
      now+=action.minutes*MINUTE;
    } else {
      const booking=state.bookings.find(item=>item.id===action.id);
      if(!booking||!active(booking))return reject('Không có lượt đặt đang hoạt động để tới giờ nhận chỗ.');
      now=Math.max(now,booking.start);
    }
    return {...state,now,bookings:settleBookings(state.bookings,now),accepted:true,message:'Đã thay đổi đồng hồ DEMO; trạng thái quá hạn/no-show được cập nhật.'};
  }
  if(action.type==='reserve'){
    const slot=BOOKING_SLOTS.find(item=>item.id===action.slotId);
    if(!slot||!validDay(action.date))return reject('Ngày hoặc khung giờ không hợp lệ.');
    const start=demoDateTime(action.date,slot.start),end=demoDateTime(action.date,slot.end);
    if(start<state.now)return reject('Khung giờ đã qua trên đồng hồ DEMO. Chọn ngày hoặc giờ khác.');
    if(state.bookings.some(active))return reject('Bạn đã có một lượt đặt DEMO đang hoạt động. Hãy huỷ hoặc kết thúc lượt đó trước.');
    if(demoRemaining(state,action.date,slot.id)<1)return reject('Khung giờ DEMO đã hết chỗ. Vui lòng chọn khung giờ khác.');
    const booking:DemoBooking={id:`DEMO-B2-${String(state.nextId).padStart(3,'0')}`,date:action.date,slotId:slot.id,start,end,status:'reserved'};
    return {...state,bookings:[...state.bookings,booking],nextId:state.nextId+1,accepted:true,message:`Đã tạo ${booking.id} cho một ghế DEMO. Đây không phải xác nhận đặt chỗ của ULIS.`};
  }
  const booking=state.bookings.find(item=>item.id===action.id);
  if(!booking)return reject('Không tìm thấy lượt đặt DEMO.');
  let status:BookingStatus;
  if(action.type==='cancel'){
    if(booking.status!=='reserved')return reject('Chỉ có thể huỷ lượt đặt đang chờ. Nếu đã nhận chỗ, hãy check-out.');
    status='cancelled';
  } else if(action.type==='checkin'){
    if(booking.status!=='reserved')return reject('Lượt đặt không còn đủ điều kiện check-in.');
    if(state.now<booking.start-15*MINUTE)return reject('Chưa đến thời gian check-in DEMO (từ 15 phút trước giờ bắt đầu).');
    status='checked_in';
  } else {
    if(booking.status!=='checked_in')return reject('Cần check-in trước khi check-out.');
    status='checked_out';
  }
  return {...state,bookings:state.bookings.map(item=>item.id===booking.id?{...item,status}:item),accepted:true,message:status==='cancelled'?'Đã huỷ lượt đặt DEMO.':status==='checked_in'?'Đã check-in DEMO.':'Đã check-out DEMO; ghế mô phỏng đã được trả lại.'};
}
