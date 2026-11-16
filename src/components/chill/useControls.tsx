'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {Controls} from './World';
export function useChillControls(onInteract:()=>void){
 const controls=useRef<Controls>({x:0,z:0,interact:0});const interact=useRef(onInteract);
 useEffect(()=>{interact.current=onInteract;},[onInteract]);
 useEffect(()=>{const input=controls.current;const keys=new Set<string>();const update=()=>{controls.current.x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);controls.current.z=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);};
  const down=(event:KeyboardEvent)=>{if((event.target as HTMLElement)?.closest('input,textarea,select,[contenteditable=true]'))return;const key=event.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){event.preventDefault();keys.add(key);update();}if(key==='e'&&!event.repeat){event.preventDefault();interact.current();}};
  const up=(event:KeyboardEvent)=>{keys.delete(event.key.toLowerCase());update();};const blur=()=>{keys.clear();update();};window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);input.x=0;input.z=0;};
 },[]);const setDirection=useCallback((x:number,z:number)=>{controls.current.x=x;controls.current.z=z;},[]);return {controls,setDirection};
}
export function Joystick({setDirection}:{setDirection:(x:number,z:number)=>void}){
 const [knob,setKnob]=useState({x:0,z:0});const pointer=useRef<number|null>(null);
 function update(event:React.PointerEvent<HTMLDivElement>){const box=event.currentTarget.getBoundingClientRect();let x=(event.clientX-box.left-box.width/2)/32,z=(event.clientY-box.top-box.height/2)/32;const length=Math.hypot(x,z);if(length>1){x/=length;z/=length;}setDirection(x,z);setKnob({x,z});}
 return <div className="chill-joystick" role="group" aria-label="Joystick di chuyển" onPointerDown={event=>{pointer.current=event.pointerId;event.currentTarget.setPointerCapture(event.pointerId);update(event);}} onPointerMove={event=>{if(pointer.current===event.pointerId)update(event);}} onPointerUp={()=>{pointer.current=null;setDirection(0,0);setKnob({x:0,z:0});}} onPointerCancel={()=>{pointer.current=null;setDirection(0,0);setKnob({x:0,z:0});}}><span style={{transform:`translate(${knob.x*27}px,${knob.z*27}px)`}}/><small>Di chuyển</small></div>;
}
