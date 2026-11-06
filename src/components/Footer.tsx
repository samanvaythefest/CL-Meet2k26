import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="bg-white/95 px-3 py-1.5 rounded-sm inline-block mb-3">
              <img src="/tspdc-logo.png" alt="TSPDC" className="h-8 w-auto object-contain" />
            </div>
            <p className="text-xs text-[#EDE2D0]/35 leading-relaxed max-w-xs">
              Thakur Specialized Degree College — Approved by Govt. of Maharashtra, Affiliated to University of Mumbai.
            </p>
          </div>

          {/* Venue */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#C5A15D]/60 mb-2">Venue</h4>
            <p className="text-xs text-[#EDE2D0]/35 leading-relaxed">
              Thakur Educational Campus,<br />
              Kandivali (East), Mumbai — 400 101
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#C5A15D]/60 mb-2">Contact</h4>
            <p className="text-xs text-[#EDE2D0]/35 leading-relaxed font-mono">
              samanvay@tspdc.in<br />
              +91 22 6730 8000
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="gold-rule mb-4" />
        <p className="text-[10px] text-[#EDE2D0]/20 tracking-wider text-center">
          © 2027 Thakur Specialized Degree College · Samanvay 2027
        </p>
      </div>
    </footer>
  );
};
