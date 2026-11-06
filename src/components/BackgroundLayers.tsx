import React, { useEffect, useRef } from 'react';

export const BackgroundLayers: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(197,161,93,0.03) 0%, transparent 60%)`;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      
      {/* Layer 1: Base — pure dark foundation */}
      <div className="absolute inset-0" style={{ background: '#0C0A0E' }} />

      {/* Layer 2: AUREL-style burgundy warmth — top ambient glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% -10%, rgba(100,21,34,0.55) 0%, rgba(58,12,20,0.3) 35%, transparent 70%),
            radial-gradient(ellipse 80% 50% at 85% 20%, rgba(126,27,44,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 15% 30%, rgba(100,21,34,0.15) 0%, transparent 55%)
          `
        }}
      />

      {/* Layer 3: Golden warm ambient — like studio lighting on burgundy velvet */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 15%, rgba(197,161,93,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 80% 60%, rgba(140,112,77,0.04) 0%, transparent 50%),
            radial-gradient(ellipse 35% 30% at 20% 70%, rgba(197,161,93,0.03) 0%, transparent 50%)
          `
        }}
      />

      {/* Layer 4: Interactive subtle spotlight following cursor */}
      <div ref={spotlightRef} className="absolute inset-0 transition-[background] duration-700 ease-out" />

      {/* Layer 5: Oversized editorial watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none">
        <span 
          className="font-luxury font-bold uppercase whitespace-nowrap"
          style={{
            fontSize: 'clamp(120px, 18vw, 320px)',
            letterSpacing: '0.15em',
            color: 'rgba(237,226,208,0.018)',
            lineHeight: 1,
            transform: 'translateY(-5%)'
          }}
        >
          SAMANVAY
        </span>
      </div>

      {/* Layer 6: Subtle film grain texture */}
      <div className="absolute inset-0 bg-grain opacity-50 mix-blend-overlay" />

      {/* Layer 7: Vignette — deeper at edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgba(12,10,14,0.5) 75%, rgba(12,10,14,0.85) 100%)
          `
        }}
      />

      {/* Layer 8: Bottom burgundy warmth (like the terrain in AUREL) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        style={{
          background: 'linear-gradient(to top, rgba(58,12,20,0.18) 0%, transparent 100%)'
        }}
      />
    </div>
  );
};
