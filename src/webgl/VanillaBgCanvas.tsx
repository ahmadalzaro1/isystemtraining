import React from 'react';

export default function VanillaBgCanvas() {
  const ref = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    const el = ref.current!;
    let cleanup: any;
    
    const run = async () => {
      try {
        const mod = await import('./vanillaHero');
        cleanup = await mod.mountVanillaHero(el);
      } catch (e) {
        // Fallback: Canvas2D gradient
        const ctx = el.getContext('2d');
        if (!ctx) return;
        
        let raf = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        
        const resize = () => {
          el.width = innerWidth * dpr;
          el.height = innerHeight * dpr;
          el.style.width = innerWidth + 'px';
          el.style.height = innerHeight + 'px';
          ctx.scale(dpr, dpr);
        };
        
        const paint = (t: number) => {
          const g = ctx.createLinearGradient(0, 0, innerWidth, innerHeight);
          g.addColorStop(0, '#f7fbff');
          g.addColorStop(1, '#e9f2ff');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, innerWidth, innerHeight);
          raf = requestAnimationFrame(paint);
        };
        
        resize();
        addEventListener('resize', resize, { passive: true });
        raf = requestAnimationFrame(paint);
        
        cleanup = () => {
          cancelAnimationFrame(raf);
          removeEventListener('resize', resize);
        };
      }
    };
    
    run();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);
  
  return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />;
}