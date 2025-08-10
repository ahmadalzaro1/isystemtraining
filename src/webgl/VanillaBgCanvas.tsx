import React from 'react';
import '@/styles/canvas.css';

let __BG_MOUNTED__ = false;

export default function VanillaBgCanvas() {
  const ref = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(()=>{ if(__BG_MOUNTED__) return; __BG_MOUNTED__=true; let stop:any; (async()=>{ try{ const { mountVanillaHero } = await import('./vanillaHero'); stop = await mountVanillaHero(ref.current!); }catch(e){ /* silent */ }})(); return ()=>{ if(stop) stop(); __BG_MOUNTED__=false; }; },[]);
  
  return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />;
}