import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Printer, Copy, Check, ArrowLeft, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubmittedRegistration } from '../types';

interface SubmissionSuccessProps {
  data: SubmittedRegistration;
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#C5A15D', '#EDE2D0', '#641522', '#DFC38A'],
        disableForReducedMotion: true
      });
    } catch { /* ignore */ }
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(data.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-20 py-12 sm:py-20 px-5 sm:px-8 max-w-3xl mx-auto">

      <div className="mb-6 no-print">
        <button type="button" onClick={onReset} className="text-[11px] tracking-[0.15em] uppercase text-[#C5A15D]/60 hover:text-[#C5A15D] flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> New Registration
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="card-elevated corner-accent rounded-sm p-6 sm:p-10"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 mb-6 border-b border-white/5 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/95 px-2.5 py-1.5 rounded-sm shrink-0">
              <img src="/tspdc-logo.png" alt="TSPDC" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C5A15D]">Official Credential</p>
              <h2 className="font-luxury text-xl text-[#EDE2D0] tracking-wide">Samanvay 2027</h2>
            </div>
          </div>

          {/* Reference code */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm sm:text-base font-semibold text-[#C5A15D] tracking-widest bg-[#0C0A0E] px-3 py-1.5 rounded-sm border border-[#C5A15D]/20">
              {data.referenceId}
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="no-print p-1.5 rounded-sm border border-[#C5A15D]/20 hover:border-[#C5A15D]/40 text-[#EDE2D0]/40 hover:text-[#C5A15D] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirmation banner */}
        <div className="flex items-center gap-3 p-4 rounded-sm bg-[#641522]/20 border border-[#C5A15D]/15 mb-8">
          <CheckCircle2 className="w-5 h-5 text-[#C5A15D] shrink-0" />
          <p className="text-sm text-[#EDE2D0]/80">
            Delegation confirmed and recorded.
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 p-5 rounded-sm card-inset mb-8">
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#C5A15D]/60 mb-0.5">Institution</p>
            <p className="font-editorial text-base text-[#EDE2D0]">{data.collegeName}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#C5A15D]/60 mb-0.5">City</p>
            <p className="text-sm text-[#EDE2D0]/80">{data.collegeCity}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#C5A15D]/60 mb-0.5">Host</p>
            <p className="text-sm text-[#EDE2D0]/80">Thakur Specialized Degree College</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#C5A15D]/60 mb-0.5">Submitted</p>
            <p className="text-sm text-[#EDE2D0]/60 font-mono">{data.submittedAt}</p>
          </div>
        </div>

        {/* Representatives */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#C5A15D]/60" />
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#C5A15D]">
              Representatives ({data.representatives.length})
            </h4>
          </div>

          <div className="space-y-2">
            {data.representatives.map((rep, idx) => (
              <div key={rep.id} className="p-3 rounded-sm card-inset flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#C5A15D]/40 font-mono w-4">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-[#EDE2D0]">{rep.name}</span>
                  <span className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm ${
                    rep.designation === 'CL' ? 'bg-[#641522]/50 text-[#C5A15D]' : 'bg-white/5 text-[#EDE2D0]/50'
                  }`}>
                    {rep.designation}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono text-[#EDE2D0]/40 pl-7 sm:pl-0">
                  <span>+91 {rep.phone}</span>
                  <span className="truncate max-w-[160px]">{rep.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="p-5 rounded-sm card-inset mb-8">
          <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#C5A15D] mb-4">Next Steps</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#EDE2D0]/60 leading-relaxed">
            <div>
              <p className="font-medium text-[#EDE2D0]/80 mb-1">1. Save your pass code</p>
              <p>Official passes will be dispatched to registered emails.</p>
            </div>
            <div>
              <p className="font-medium text-[#EDE2D0]/80 mb-1">2. Venue check-in</p>
              <p>Present your pass at the TSPDC Reception Desk, Kandivali (E), Mumbai.</p>
            </div>
            <div>
              <p className="font-medium text-[#EDE2D0]/80 mb-1">3. Conclave agenda</p>
              <p>Event slots, rulebook review, and priority coordination at the meet.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 no-print">
          <button type="button" onClick={onReset} className="text-xs tracking-[0.15em] uppercase text-[#EDE2D0]/40 hover:text-[#C5A15D] border border-white/10 hover:border-[#C5A15D]/30 px-5 py-2 rounded-sm transition-colors">
            Register Another
          </button>
          <button type="button" onClick={() => window.print()} className="btn-gold px-6 py-2.5 rounded-sm text-[11px] tracking-[0.15em] inline-flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" /> Print Pass
          </button>
        </div>
      </motion.div>
    </section>
  );
};
