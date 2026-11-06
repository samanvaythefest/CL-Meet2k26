import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onScrollToForm: () => void;
  onOpenEnvelope?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToForm, onOpenEnvelope }) => {
  return (
    <header className="relative z-30 w-full border-b border-[#C5A15D]/15 bg-[#0C0A0E]/85 backdrop-blur-md">
      {/* Topmost Institutional Authority Line */}
      <div className="w-full border-b border-[#C5A15D]/10 bg-[#141216]/90 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[10px] tracking-[0.22em] uppercase text-[#EDE2D0]/70 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15D] animate-pulse" />
            <span className="text-[#C5A15D] font-semibold">Official Conclave Accreditation</span>
            <span className="hidden sm:inline text-[#C5A15D]/40">|</span>
            <span className="hidden sm:inline">Approved by Govt. of Maharashtra</span>
            <span className="hidden md:inline text-[#C5A15D]/40">•</span>
            <span className="hidden md:inline">Affiliated to University of Mumbai</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#EDE2D0]/60 font-mono tracking-widest text-[9px]">CODE: 1235</span>
            <span className="text-[#C5A15D]/40">|</span>
            <span className="text-[#C5A15D] font-medium">EDITION 2027</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        
        {/* Left: Authentic TSPDC Transparent Logo directly on dark background */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            {/* Seamless presentation: zero white box, authentic transparent logo */}
            <img
              src="/tspdc-logo-dark-transparent.png"
              alt="Thakur Specialized Degree College (TSPDC)"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              loading="eager"
            />
          </div>
          
          {/* Subtle separator and Samanvay wordmark */}
          <div className="hidden lg:block border-l border-[#C5A15D]/20 pl-4">
            <p className="font-luxury text-sm tracking-[0.16em] uppercase text-[#EDE2D0]">
              Samanvay <span className="text-[#C5A15D] font-light">2027</span>
            </p>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#EDE2D0]/40 font-mono">
              Contingent Leaders' Conclave
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Re-Open Invitation Envelope Action */}
          <button
            type="button"
            onClick={onOpenEnvelope}
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#C5A15D]/80 hover:text-[#C5A15D] py-2 px-3 rounded-sm border border-[#C5A15D]/20 hover:border-[#C5A15D]/40 bg-[#171517]/60 transition-all duration-200"
            title="Inspect Official Summons Envelope"
          >
            <Mail className="w-3.5 h-3.5 text-[#C5A15D]" />
            <span className="hidden sm:inline">View Envelope</span>
          </button>

          {/* Register Action CTA */}
          <button
            type="button"
            onClick={onScrollToForm}
            className="btn-gold px-4 sm:px-6 py-2 sm:py-2.5 rounded-sm text-[10px] sm:text-[11px] tracking-[0.2em] uppercase inline-flex items-center gap-2"
          >
            <span>Register Delegation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
