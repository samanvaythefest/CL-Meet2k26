import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

interface HeroInvitationProps {
  onScrollToForm: () => void;
}

export const HeroInvitation: React.FC<HeroInvitationProps> = ({ onScrollToForm }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
        .fromTo('.hero-title', { opacity: 0, y: 20, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, '-=0.4')
        .fromTo('.hero-year', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.6')
        .fromTo('.hero-subtitle', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo('.hero-quote', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
        .fromTo('.hero-cta', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24 min-h-[70vh]"
    >
      {/* Samanvay Circular Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-[#C5A15D]/30 shadow-lg shadow-black/40">
          <img
            src="/samanvay-logo-circle.jpg"
            alt="Samanvay"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Eyebrow */}
      <p className="hero-eyebrow text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#C5A15D] font-medium mb-4">
        Thakur Specialized Degree College presents
      </p>

      {/* Title */}
      <h1 className="hero-title font-luxury font-bold text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-[0.04em] text-[#EDE2D0] uppercase mb-2">
        Samanvay
      </h1>

      {/* Year */}
      <p className="hero-year font-luxury font-light text-[clamp(2rem,6vw,5rem)] leading-none tracking-[0.12em] text-gold-gradient mb-6">
        2027
      </p>

      {/* Thin decorative rule */}
      <div className="flex items-center gap-4 mb-6 hero-subtitle">
        <span className="block w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#C5A15D]/40" />
        <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#C5A15D]/80 font-medium">
          Contingent Leaders' Meet
        </span>
        <span className="block w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#C5A15D]/40" />
      </div>

      {/* Quote */}
      <p className="hero-quote font-editorial text-lg sm:text-xl md:text-2xl italic text-[#EDE2D0]/60 max-w-lg leading-relaxed mb-10">
        "An evening of connection, coordination &amp; celebration."
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={onScrollToForm}
        className="hero-cta btn-gold px-8 py-3 rounded-sm text-xs tracking-[0.2em] inline-flex items-center gap-3"
      >
        <span>Accept Invitation</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};
