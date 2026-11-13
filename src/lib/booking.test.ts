import {describe,it,expect} from 'vitest';
import {BOOKING_SLOTS,DEMO_SEATS,bookingReducer,initialBookingState,demoDateTime,demoRemaining,demoDay,nextDemoDay} from './booking';
import {b2} from './data';
const day='2026-11-14';
const at=(time:string)=>demoDateTime(day,time);
const fresh=()=>initialBookingState(at('06:00'));
const reserve=()=>bookingReducer(fresh(),{type:'reserve',date:day,slotId:'morning'});
describe('Homies demo reservations',()=>{
 it('requests one seat and returns a clearly fictional confirmation without changing real observations',()=>{
  const before=JSON.stringify(b2);const state=reserve();expect(state.accepted).toBe(true);expect(state.bookings[0].id).toBe('DEMO-B2-001');expect(state.bookings[0].status).toBe('reserved');expect(state.message).toContain('không phải xác nhận');expect(demoRemaining(state,day,'morning')).toBe(0);expect(JSON.stringify(b2)).toBe(before);
 });
 it('rejects duplicate active reservations across dates/slots and does not issue another ID',()=>{
  const state=reserve();for(const [date,slotId] of [[day,'morning'],['2026-11-15','evening']]){const rejected=bookingReducer(state,{type:'reserve',date,slotId});expect(rejected.accepted).toBe(false);expect(rejected.bookings).toHaveLength(1);expect(rejected.nextId).toBe(2);}
 });
 it('rejects a full fixture instead of overbooking',()=>{
  const state=bookingReducer(fresh(),{type:'reserve',date:day,slotId:'full'});expect(state.accepted).toBe(false);expect(state.bookings).toEqual([]);expect(demoRemaining(state,day,'full')).toBe(0);expect(state.message).toContain('hết chỗ');
 });
 it('cancels a hold, releases only its simulated seat and permits a new unique reservation',()=>{
  const state=reserve();const cancelled=bookingReducer(state,{type:'cancel',id:state.bookings[0].id});expect(cancelled.bookings[0].status).toBe('cancelled');expect(demoRemaining(cancelled,day,'morning')).toBe(1);
  const again=bookingReducer(cancelled,{type:'reserve',date:day,slotId:'morning'});expect(again.accepted).toBe(true);expect(again.bookings[1].id).toBe('DEMO-B2-002');expect(demoRemaining(again,day,'morning')).toBe(0);
 });
 it('rejects invalid, impossible or past dates and nonexistent slots',()=>{
  for(const date of ['','2026-02-30','2026-13-01','2026-11-13','14/11/2026'])expect(bookingReducer(fresh(),{type:'reserve',date,slotId:'morning'}).accepted).toBe(false);
  expect(bookingReducer(fresh(),{type:'reserve',date:day,slotId:'invalid'}).accepted).toBe(false);
  expect(bookingReducer(initialBookingState(at('08:01')),{type:'reserve',date:day,slotId:'morning'}).accepted).toBe(false);
 });
 it('supports check-in only in its window and check-out after check-in',()=>{
  let state=reserve();const id=state.bookings[0].id;expect(bookingReducer(state,{type:'checkin',id}).accepted).toBe(false);expect(bookingReducer(state,{type:'checkout',id}).accepted).toBe(false);
  state=bookingReducer(state,{type:'advance',minutes:105});expect(state.now).toBe(at('07:45'));state=bookingReducer(state,{type:'checkin',id});expect(state.accepted).toBe(true);expect(state.bookings[0].status).toBe('checked_in');expect(bookingReducer(state,{type:'cancel',id}).accepted).toBe(false);
  state=bookingReducer(state,{type:'checkout',id});expect(state.bookings[0].status).toBe('checked_out');expect(demoRemaining(state,day,'morning')).toBe(1);expect(bookingReducer(state,{type:'checkout',id}).accepted).toBe(false);
 });
 it('marks no-show after the grace period, releases the hold and rejects late check-in',()=>{
  let state=reserve();const id=state.bookings[0].id;state=bookingReducer(state,{type:'go_to_start',id});state=bookingReducer(state,{type:'advance',minutes:15});expect(state.bookings[0].status).toBe('reserved');
  state=bookingReducer(state,{type:'advance',minutes:1});expect(state.bookings[0].status).toBe('no_show');expect(demoRemaining(state,day,'morning')).toBe(1);expect(bookingReducer(state,{type:'checkin',id}).accepted).toBe(false);
  expect(bookingReducer(state,{type:'reserve',date:day,slotId:'noon'}).accepted).toBe(true);
 });
 it('expires a checked-in session at the end even when the user forgets check-out',()=>{
  let state=reserve();const id=state.bookings[0].id;state=bookingReducer(state,{type:'go_to_start',id});state=bookingReducer(state,{type:'checkin',id});state=bookingReducer(state,{type:'advance',minutes:120});expect(state.bookings[0].status).toBe('expired');expect(demoRemaining(state,day,'morning')).toBe(1);const rejected=bookingReducer(state,{type:'checkout',id});expect(rejected.accepted).toBe(false);expect(rejected.message).not.toContain('Đã check-out');
 });
 it('resets holds/status/clock/sequence without modifying the original state',()=>{
  const state=reserve();const reset=bookingReducer(state,{type:'reset',now:at('06:00')});expect(reset.bookings).toEqual([]);expect(reset.nextId).toBe(1);expect(reset.now).toBe(at('06:00'));expect(demoRemaining(reset,day,'morning')).toBe(1);expect(state.bookings[0].status).toBe('reserved');
 });
 it('rejects missing IDs, backwards/invalid time advances and terminal transitions',()=>{
  for(const type of ['checkin','checkout','cancel','go_to_start'] as const)expect(bookingReducer(fresh(),{type,id:'missing'}).accepted).toBe(false);
  for(const minutes of [-1,0,NaN,Infinity])expect(bookingReducer(fresh(),{type:'advance',minutes}).accepted).toBe(false);
 });
 it('keeps all fictional booking slots within owner-specified prototype hours and Vietnam date boundaries',()=>{
  const homies=b2[0].details;if(homies.kind!=='homies')throw Error('Wrong fixture');expect(homies.openingHours.opens).toBe('06:45');expect(homies.openingHours.closes).toBe('20:00');
  for(const slot of BOOKING_SLOTS){expect(slot.start>=homies.openingHours.opens).toBe(true);expect(slot.end<=homies.openingHours.closes).toBe(true);expect(slot.others).toBeGreaterThanOrEqual(0);expect(slot.others).toBeLessThanOrEqual(DEMO_SEATS);expect(slot.start<slot.end).toBe(true);}
  expect(DEMO_SEATS).not.toBe(homies.seatingObserved);expect(homies.availableSeats).toBeNull();expect(homies.realTimeOccupancy).toBeNull();expect(demoDay(Date.parse('2026-11-13T18:00:00Z'))).toBe('2026-11-14');expect(nextDemoDay(at('06:00'))).toBe('2026-11-15');
 });
});
