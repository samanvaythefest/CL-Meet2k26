import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EnvelopeOpeningProps {
  onOpenComplete: () => void;
  onSkip: () => void;
}

export const EnvelopeOpening: React.FC<EnvelopeOpeningProps> = ({ onOpenComplete, onSkip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCardElevated, setIsCardElevated] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // After flap opens, slide card out
    setTimeout(() => {
      setIsCardElevated(true);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0C0A0E]/95 backdrop-blur-2xl px-4 select-none"
    >
      {/* Background Theatrical Lighting & Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 500px at 50% 45%, rgba(100, 21, 34, 0.45) 0%, rgba(58, 12, 20, 0.25) 50%, transparent 80%),
            radial-gradient(circle at 50% 50%, transparent 40%, rgba(12, 10, 14, 0.9) 100%)
          `
        }}
      />

      {/* Discrete Skip Button */}
      <button
        type="button"
        onClick={onSkip}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A15D]/60 hover:text-[#C5A15D] transition-colors py-2 px-3 rounded border border-white/5 hover:border-[#C5A15D]/30"
      >
        <span>Enter Conclave Directly</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Main Envelope Presentation Container */}
      <div className="relative flex flex-col items-center justify-center max-w-xl w-full">
        
        {/* Top Eyebrow Hint */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A15D]/25 bg-[#171517]/80 mb-2.5">
            <Sparkles className="w-3 h-3 text-[#C5A15D] animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A15D] font-medium">
              Official Formal Summons
            </span>
          </div>
          <h2 className="font-luxury text-xl sm:text-2xl text-[#EDE2D0] tracking-wide">
            Thakur Specialized Degree College
          </h2>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#EDE2D0]/50 mt-1">
            Samanvay 2027 • Contingent Leaders' Meet
          </p>
        </motion.div>

        {/* 3D Envelope Wrapper */}
        <div 
          className="relative w-[320px] sm:w-[460px] h-[220px] sm:h-[300px] cursor-pointer group"
          onClick={handleOpen}
          style={{ perspective: 1200 }}
        >
          {/* Subtle Ambient Drop Shadow below envelope */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-black/70 blur-xl rounded-full pointer-events-none" />

          {/* 1. Envelope Back Pocket (Foundation) */}
          <div 
            className="absolute inset-0 rounded-md overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1A070B 0%, #290A11 50%, #150508 100%)',
              border: '1px solid rgba(197, 161, 93, 0.25)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Interior Silk/Velvet Lining Texture */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                background: 'radial-gradient(circle at 50% 50%, #641522 0%, transparent 80%)'
              }}
            />
          </div>

          {/* 2. The Letter Card (Housed inside, slides out upon opening) */}
          <motion.div
            initial={false}
            animate={
              isCardElevated
                ? { y: -160, scale: 1.05, zIndex: 40 }
                : isOpen
                ? { y: -80, scale: 1.0, zIndex: 25 }
                : { y: 0, scale: 0.95, zIndex: 10 }
            }
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-3 sm:inset-x-5 top-3 sm:top-5 h-[190px] sm:h-[260px] rounded bg-[#FBF8F3] text-[#111115] p-5 sm:p-7 flex flex-col justify-between shadow-2xl border border-[#C5A15D]/60 select-text"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(197, 161, 93, 0.3)'
            }}
            onClick={(e) => {
              if (isCardElevated) {
                e.stopPropagation();
              }
            }}
          >
            {/* Card Gold Double Border */}
            <div className="absolute inset-2 border border-[#C5A15D]/40 pointer-events-none" />
            <div className="absolute inset-3 border border-[#C5A15D]/20 pointer-events-none" />

            {/* Letterhead Header */}
            <div className="text-center relative z-10 pt-1">
              <p className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#8C704D] font-semibold">
                Thakur Specialized Degree College
              </p>
              <h3 className="font-luxury font-bold text-2xl sm:text-3xl text-[#111115] tracking-[0.1em] uppercase mt-1">
                SAMANVAY <span className="text-[#8C704D] font-normal">2027</span>
              </h3>
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#641522] font-semibold mt-0.5">
                Contingent Leaders' Conclave
              </p>
            </div>

            {/* Letter Body */}
            <div className="text-center relative z-10 py-1">
              <p className="font-editorial italic text-xs sm:text-sm text-[#333333] leading-relaxed">
                "An evening of connection, coordination and celebration."
              </p>
              <p className="text-[9px] sm:text-[10px] text-[#555555] tracking-wide mt-1.5 max-w-sm mx-auto leading-normal">
                You are cordially invited to represent your institution's delegation. Secure priority festival accreditations and event allocations.
              </p>
            </div>

            {/* Action on Card */}
            <div className="text-center relative z-10 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenComplete();
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-[#641522] text-[#EDE2D0] hover:bg-[#7E1B2C] text-[10px] tracking-[0.2em] uppercase font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Accept Summons & Enter</span>
                <ArrowRight className="w-3 h-3 text-[#C5A15D]" />
              </button>
            </div>
          </motion.div>

          {/* 3. Envelope Front Folds (Left, Right, Bottom Triangles) */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-md">
            
            {/* Left triangle flap */}
            <div 
              className="absolute top-0 left-0 bottom-0 w-1/2"
              style={{
                clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
                background: 'linear-gradient(135deg, #1B070B 0%, #25090F 100%)',
                borderLeft: '1px solid rgba(197, 161, 93, 0.25)',
                filter: 'drop-shadow(3px 0 6px rgba(0,0,0,0.5))'
              }}
            />

            {/* Right triangle flap */}
            <div 
              className="absolute top-0 right-0 bottom-0 w-1/2"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                background: 'linear-gradient(225deg, #1B070B 0%, #25090F 100%)',
                borderRight: '1px solid rgba(197, 161, 93, 0.25)',
                filter: 'drop-shadow(-3px 0 6px rgba(0,0,0,0.5))'
              }}
            />

            {/* Bottom triangle flap (pointing up) */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[62%]"
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 0%)',
                background: 'linear-gradient(180deg, #2E0B13 0%, #1A070B 100%)',
                borderBottom: '1px solid rgba(197, 161, 93, 0.3)',
                boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Gold hairline accent on bottom flap edges */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <line x1="0" y1="100" x2="50" y2="0" stroke="#C5A15D" strokeWidth="0.75" strokeOpacity="0.4" />
                <line x1="100" y1="100" x2="50" y2="0" stroke="#C5A15D" strokeWidth="0.75" strokeOpacity="0.4" />
              </svg>
            </div>
          </div>

          {/* 4. Envelope Top Flap (Folds open in 3D: rotateX from 0deg to 180deg) */}
          <motion.div
            initial={false}
            animate={isOpen ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 30 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 h-[58%] origin-top pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of Top Flap (pointing down when closed) */}
            <div 
              className="absolute inset-0 rounded-t-md"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #21080E 0%, #3B0C16 100%)',
                boxShadow: '0 12px 25px rgba(0, 0, 0, 0.7)',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Gold hairline along flap edges */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <line x1="0" y1="0" x2="50" y2="100" stroke="#C5A15D" strokeWidth="0.75" strokeOpacity="0.5" />
                <line x1="100" y1="0" x2="50" y2="100" stroke="#C5A15D" strokeWidth="0.75" strokeOpacity="0.5" />
              </svg>
            </div>

            {/* Back of Top Flap (visible when folded open) */}
            <div 
              className="absolute inset-0 rounded-t-md"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #150508 0%, #290A11 100%)',
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden'
              }}
            />
          </motion.div>

          {/* 5. Wax Seal (Center of envelope over the top flap tip) */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.25, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center cursor-pointer pointer-events-auto"
                onClick={handleOpen}
              >
                {/* Golden seal outer ring with glow */}
                <div className="relative group/seal">
                  <div className="absolute -inset-2 rounded-full bg-[#C5A15D]/25 blur-md group-hover/seal:bg-[#C5A15D]/40 transition-all duration-300 animate-pulse" />
                  
                  {/* Wax Seal Medallion */}
                  <div 
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 flex items-center justify-center border-2 border-[#E7CE97]"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #D4AF37 0%, #AA771C 60%, #5B3A09 100%)',
                      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {/* Inner circular embossed Samanvay logo */}
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border border-[#5B3A09]/60 shadow-inner bg-black flex items-center justify-center">
                      <img
                        src="/samanvay-logo-circle.jpg"
                        alt="Samanvay Wax Seal"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom Interaction Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 text-center"
        >
          {!isOpen ? (
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#C5A15D]/40 bg-[#171517]/80 text-[11px] uppercase tracking-[0.25em] text-[#C5A15D] hover:bg-[#641522]/40 hover:border-[#C5A15D] transition-all duration-300 shadow-lg group"
            >
              <span className="w-2 h-2 rounded-full bg-[#C5A15D] animate-ping" />
              <span>Click Wax Seal to Break & Open</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#EDE2D0]/60 animate-pulse">
              Invitation Unfolded • Click 'Accept Summons' on the letter card
            </p>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
};
