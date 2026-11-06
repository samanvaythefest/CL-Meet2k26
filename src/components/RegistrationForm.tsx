import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, MapPin, User, Phone, Mail,
  Plus, Trash2, AlertCircle, ShieldCheck, Sparkles
} from 'lucide-react';
import {
  Representative,
  FormValidationErrors,
  SubmittedRegistration
} from '../types';
import { POPULAR_COLLEGES } from '../data/colleges';
import { submitDelegation } from '../services/googleSheets';

interface RegistrationFormProps {
  onSuccessfulSubmission: (submission: SubmittedRegistration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccessfulSubmission }) => {
  const [collegeName, setCollegeName] = useState('');
  const [collegeCity, setCollegeCity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [representatives, setRepresentatives] = useState<Representative[]>([
    { id: 'rep-1', name: '', designation: 'CL', phone: '', email: '' }
  ]);
  
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredColleges = POPULAR_COLLEGES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectCollege = (name: string, city: string) => {
    setCollegeName(name);
    setCollegeCity(city);
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, collegeName: undefined, collegeCity: undefined }));
  };

  const addRepresentative = () => {
    if (representatives.length >= 6) {
      alert("A maximum of 6 contingent representatives can be accredited per institution.");
      return;
    }
    setRepresentatives([...representatives, {
      id: `rep-${Date.now()}`,
      name: '',
      designation: 'ACL',
      phone: '',
      email: ''
    }]);
  };

  const removeRepresentative = (id: string) => {
    if (representatives.length <= 1) return;
    setRepresentatives(representatives.filter(r => r.id !== id));
  };

  const updateRep = (idx: number, field: 'name' | 'phone' | 'email' | 'designation', value: string) => {
    const updated = [...representatives];
    updated[idx] = { ...updated[idx], [field]: value };
    setRepresentatives(updated);
    
    if (field !== 'designation' && errors.representatives?.[idx]?.[field]) {
      setErrors(prev => {
        const re = { ...prev.representatives };
        if (re[idx]) delete re[idx][field];
        return { ...prev, representatives: re };
      });
    }
  };

  const validate = (): boolean => {
    const e: FormValidationErrors = {};
    let ok = true;

    if (!collegeName.trim() || collegeName.trim().length < 3) {
      e.collegeName = 'Please enter your collegiate institution name.';
      ok = false;
    }
    if (!collegeCity.trim()) {
      e.collegeCity = 'Please enter your institution city / district.';
      ok = false;
    }

    const repE: typeof e.representatives = {};
    const phones = new Set<string>();
    const names = new Set<string>();
    let hasCL = false;

    representatives.forEach((r, i) => {
      const err: { name?: string; phone?: string; email?: string } = {};
      if (r.designation === 'CL') hasCL = true;

      // Name validation
      if (!r.name.trim() || r.name.trim().length < 2) {
        err.name = 'Full name is required.';
        ok = false;
      } else {
        const n = r.name.trim().toLowerCase();
        if (names.has(n)) {
          err.name = 'Duplicate representative name.';
          ok = false;
        } else {
          names.add(n);
        }
      }

      // Phone validation (10 digits starting 6,7,8,9)
      const p = r.phone.replace(/[\s-]/g, '');
      if (!p) {
        err.phone = 'Mobile number is required.';
        ok = false;
      } else if (!/^[6-9]\d{9}$/.test(p)) {
        err.phone = 'Enter a valid 10-digit Indian mobile number.';
        ok = false;
      } else if (phones.has(p)) {
        err.phone = 'This mobile number is already assigned above.';
        ok = false;
      } else {
        phones.add(p);
      }

      // Email validation
      if (!r.email.trim()) {
        err.email = 'Official email is required for pass delivery.';
        ok = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim())) {
        err.email = 'Enter a valid email address.';
        ok = false;
      }

      if (Object.keys(err).length) repE[i] = err;
    });

    if (Object.keys(repE).length) e.representatives = repE;
    
    if (!hasCL) {
      e.duplicates = 'At least one representative must be designated as Contingent Leader (CL).';
      ok = false;
    }

    if (!consent) {
      e.consent = 'Official declaration confirmation is required.';
      ok = false;
    }

    setErrors(e);
    return ok;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, duplicates: undefined }));

    const cl = representatives.find(r => r.designation === 'CL') || representatives[0];
    const acl = representatives.find(r => r.designation === 'ACL') || representatives[1] || { name: 'N/A', phone: '9999999999' };

    try {
      const result = await submitDelegation({
        college: collegeName.trim(),
        clName: cl.name.trim(),
        clPhone: cl.phone.replace(/\D/g, ''),
        aclName: acl.name.trim(),
        aclPhone: acl.phone.replace(/\D/g, ''),
        institutionSecret: ''
      });

      if (result.status === 'duplicate') {
        setErrors(prev => ({ ...prev, duplicates: result.message }));
        setIsSubmitting(false);
        return;
      }

      onSuccessfulSubmission({
        referenceId: result.refId,
        collegeName: collegeName.trim(),
        collegeCity: collegeCity.trim(),
        representatives: representatives.map(r => ({
          ...r,
          name: r.name.trim(),
          phone: r.phone.replace(/[\s-]/g, ''),
          email: r.email.trim()
        })),
        submittedAt: result.timestamp || new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      });
    } catch (err: any) {
      setErrors(prev => ({ ...prev, duplicates: err.message || 'Submission error. Please retry.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp-section" className="relative z-10 py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto">

      {/* Editorial Section Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#C5A15D] font-medium mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A15D]" />
          <span>Delegation Registry Protocol</span>
        </div>
        <h2 className="font-luxury text-3xl sm:text-5xl text-[#EDE2D0] tracking-wide font-normal">
          Contingent Leaders' Accreditation
        </h2>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="w-10 h-px bg-gradient-to-r from-transparent to-[#C5A15D]/40" />
          <p className="font-editorial italic text-sm sm:text-base text-[#EDE2D0]/60">
            Official registration for student leadership representation
          </p>
          <span className="w-10 h-px bg-gradient-to-l from-transparent to-[#C5A15D]/40" />
        </div>
      </div>

      {/* Main Bespoke Editorial Card */}
      <div className="relative rounded-sm overflow-hidden border border-[#C5A15D]/30 shadow-2xl bg-gradient-to-b from-[#18131A] via-[#141116] to-[#0E0C10]">
        
        {/* Subtle Ambient Burgundy Inner Light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#641522]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C5A15D]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Art Deco Gold Corner Brackets */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#C5A15D]/60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#C5A15D]/60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#C5A15D]/60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#C5A15D]/60 pointer-events-none" />

        {/* Card Content Padding */}
        <div className="p-6 sm:p-12 relative z-10">
          
          <form onSubmit={handleSubmit} noValidate className="space-y-12">

            {/* ================= CHAPTER 01: INSTITUTION ================= */}
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#C5A15D]/20">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#C5A15D] tracking-widest font-bold">
                    01 //
                  </span>
                  <h3 className="font-luxury text-xl text-[#EDE2D0] tracking-wide">
                    Collegiate Institution
                  </h3>
                </div>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#EDE2D0]/40 font-mono">
                  ACCREDITATION DESK
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* College Name input */}
                <div className="md:col-span-2 relative">
                  <label className="block text-[10px] tracking-[0.22em] uppercase text-[#C5A15D] font-semibold mb-2">
                    College / Institution Name <span className="text-[#C5A15D]">*</span>
                  </label>
                  
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A15D]/50" />
                    <input
                      type="text"
                      value={collegeName}
                      onChange={e => {
                        setCollegeName(e.target.value);
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                        if (errors.collegeName) setErrors(p => ({ ...p, collegeName: undefined }));
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                      placeholder="e.g. Thakur Specialized Degree College"
                      className={`w-full pl-10 pr-3.5 py-3 rounded-sm bg-[#0B090D] border ${
                        errors.collegeName ? 'border-red-400' : 'border-[#C5A15D]/25 focus:border-[#C5A15D]'
                      } text-sm text-[#EDE2D0] placeholder-[#EDE2D0]/30 focus:outline-none focus:ring-1 focus:ring-[#C5A15D]/40 transition-all`}
                    />
                  </div>

                  {/* Suggestions List */}
                  <AnimatePresence>
                    {showSuggestions && filteredColleges.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute left-0 right-0 mt-1.5 z-40 max-h-56 overflow-y-auto rounded-sm border border-[#C5A15D]/30 bg-[#141216]/98 backdrop-blur-xl shadow-2xl"
                      >
                        <div className="px-3.5 py-1.5 text-[9px] tracking-[0.25em] uppercase text-[#C5A15D]/60 border-b border-white/5">
                          Maharashtra Collegiate Registry (Click to auto-fill)
                        </div>
                        {filteredColleges.slice(0, 7).map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={() => selectCollege(c.name, c.city)}
                            className="w-full text-left px-4 py-2.5 text-xs text-[#EDE2D0]/80 hover:bg-[#641522]/40 hover:text-white border-b border-white/5 last:border-0 flex justify-between items-center transition-colors"
                          >
                            <span className="truncate pr-3 font-medium">{c.name}</span>
                            <span className="text-[10px] text-[#C5A15D]/60 font-mono uppercase shrink-0">{c.city}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {errors.collegeName && (
                    <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.collegeName}</span>
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-[10px] tracking-[0.22em] uppercase text-[#C5A15D] font-semibold mb-2">
                    City / District <span className="text-[#C5A15D]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A15D]/50" />
                    <input
                      type="text"
                      value={collegeCity}
                      onChange={e => {
                        setCollegeCity(e.target.value);
                        if (errors.collegeCity) setErrors(p => ({ ...p, collegeCity: undefined }));
                      }}
                      placeholder="e.g. Mumbai"
                      className={`w-full pl-10 pr-3.5 py-3 rounded-sm bg-[#0B090D] border ${
                        errors.collegeCity ? 'border-red-400' : 'border-[#C5A15D]/25 focus:border-[#C5A15D]'
                      } text-sm text-[#EDE2D0] placeholder-[#EDE2D0]/30 focus:outline-none focus:ring-1 focus:ring-[#C5A15D]/40 transition-all`}
                    />
                  </div>
                  {errors.collegeCity && (
                    <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.collegeCity}</span>
                    </p>
                  )}
                </div>

              </div>

            </div>

            {/* ================= CHAPTER 02: REPRESENTATIVES ================= */}
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#C5A15D]/20 gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#C5A15D] tracking-widest font-bold">
                    02 //
                  </span>
                  <div>
                    <h3 className="font-luxury text-xl text-[#EDE2D0] tracking-wide">
                      Delegation Leadership
                    </h3>
                    <p className="text-[10px] text-[#EDE2D0]/50 tracking-wider">
                      Register Chief Contingent Leader (CL) and Assistant Contingent Leaders (ACL)
                    </p>
                  </div>
                </div>

                {/* Add Representative Button */}
                <button
                  type="button"
                  onClick={addRepresentative}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm border border-[#C5A15D]/40 bg-[#641522]/30 hover:bg-[#641522]/50 text-[#C5A15D] hover:text-[#EDE2D0] text-[10px] tracking-[0.2em] uppercase font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Representative</span>
                </button>
              </div>

              {errors.duplicates && (
                <div className="p-3.5 rounded-sm bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.duplicates}</span>
                </div>
              )}

              {/* Repeatable Executive Delegate Cards */}
              <div className="space-y-5">
                <AnimatePresence initial={false}>
                  {representatives.map((rep, idx) => (
                    <motion.div
                      key={rep.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-sm p-5 sm:p-6 bg-[#0E0C10] border border-[#C5A15D]/20 hover:border-[#C5A15D]/40 transition-all shadow-md group"
                    >
                      {/* Top Delegate Card Ribbon */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-[#C5A15D] tracking-widest font-semibold">
                            DELEGATE [{String(idx + 1).padStart(2, '0')}]
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15D]/40" />
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#EDE2D0]/60">
                            {rep.designation === 'CL' ? 'Primary Contingent Leader' : 'Assistant Contingent Leader'}
                          </span>
                        </div>

                        {representatives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRepresentative(rep.id)}
                            className="text-[#EDE2D0]/30 hover:text-red-400 p-1 rounded transition-colors"
                            title="Remove representative"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
                        
                        {/* Designation Selector */}
                        <div className="lg:col-span-3">
                          <label className="block text-[10px] tracking-[0.18em] uppercase text-[#C5A15D] font-medium mb-1.5">
                            Role / Designation <span className="text-[#C5A15D]">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-sm bg-[#17141A] border border-[#C5A15D]/20">
                            <button
                              type="button"
                              onClick={() => updateRep(idx, 'designation', 'CL')}
                              className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                                rep.designation === 'CL'
                                  ? 'bg-[#641522] text-[#EDE2D0] border border-[#C5A15D]/50 shadow-sm'
                                  : 'text-[#EDE2D0]/40 hover:text-[#EDE2D0]'
                              }`}
                            >
                              CL
                            </button>
                            <button
                              type="button"
                              onClick={() => updateRep(idx, 'designation', 'ACL')}
                              className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                                rep.designation === 'ACL'
                                  ? 'bg-[#641522] text-[#EDE2D0] border border-[#C5A15D]/50 shadow-sm'
                                  : 'text-[#EDE2D0]/40 hover:text-[#EDE2D0]'
                              }`}
                            >
                              ACL
                            </button>
                          </div>
                        </div>

                        {/* Full Name */}
                        <div className="lg:col-span-4">
                          <label className="block text-[10px] tracking-[0.18em] uppercase text-[#C5A15D] font-medium mb-1.5">
                            Representative Full Name <span className="text-[#C5A15D]">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A15D]/40" />
                            <input
                              type="text"
                              value={rep.name}
                              onChange={e => updateRep(idx, 'name', e.target.value)}
                              placeholder="e.g. Aarav Sharma"
                              className={`w-full pl-9 pr-3 py-2.5 rounded-sm bg-[#151218] border ${
                                errors.representatives?.[idx]?.name ? 'border-red-400' : 'border-[#C5A15D]/20 focus:border-[#C5A15D]'
                              } text-sm text-[#EDE2D0] placeholder-[#EDE2D0]/30 focus:outline-none focus:ring-1 focus:ring-[#C5A15D]/30 transition-all`}
                            />
                          </div>
                          {errors.representatives?.[idx]?.name && (
                            <p className="mt-1 text-[10px] text-red-400">{errors.representatives[idx].name}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="lg:col-span-3">
                          <label className="block text-[10px] tracking-[0.18em] uppercase text-[#C5A15D] font-medium mb-1.5">
                            Mobile (+91) <span className="text-[#C5A15D]">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A15D]/40" />
                            <input
                              type="tel"
                              maxLength={10}
                              value={rep.phone}
                              onChange={e => updateRep(idx, 'phone', e.target.value.replace(/\D/g, ''))}
                              placeholder="10-digit number"
                              className={`w-full pl-9 pr-3 py-2.5 rounded-sm bg-[#151218] border ${
                                errors.representatives?.[idx]?.phone ? 'border-red-400' : 'border-[#C5A15D]/20 focus:border-[#C5A15D]'
                              } text-sm font-mono text-[#EDE2D0] placeholder-[#EDE2D0]/30 focus:outline-none focus:ring-1 focus:ring-[#C5A15D]/30 transition-all`}
                            />
                          </div>
                          {errors.representatives?.[idx]?.phone && (
                            <p className="mt-1 text-[10px] text-red-400">{errors.representatives[idx].phone}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="lg:col-span-2">
                          <label className="block text-[10px] tracking-[0.18em] uppercase text-[#C5A15D] font-medium mb-1.5">
                            Official Email <span className="text-[#C5A15D]">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A15D]/40" />
                            <input
                              type="email"
                              value={rep.email}
                              onChange={e => updateRep(idx, 'email', e.target.value)}
                              placeholder="lead@college.edu"
                              className={`w-full pl-9 pr-3 py-2.5 rounded-sm bg-[#151218] border ${
                                errors.representatives?.[idx]?.email ? 'border-red-400' : 'border-[#C5A15D]/20 focus:border-[#C5A15D]'
                              } text-sm text-[#EDE2D0] placeholder-[#EDE2D0]/30 focus:outline-none focus:ring-1 focus:ring-[#C5A15D]/30 transition-all`}
                            />
                          </div>
                          {errors.representatives?.[idx]?.email && (
                            <p className="mt-1 text-[10px] text-red-400">{errors.representatives[idx].email}</p>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>

            {/* ================= CHAPTER 03: DECLARATION ================= */}
            <div className="pt-6 border-t border-[#C5A15D]/20 space-y-4">
              
              <div className="p-4 rounded-sm bg-[#100D13] border border-[#C5A15D]/20">
                <label className="flex items-start gap-3.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => {
                      setConsent(e.target.checked);
                      if (errors.consent) setErrors(p => ({ ...p, consent: undefined }));
                    }}
                    className="mt-1 h-4 w-4 rounded-sm border-[#C5A15D]/40 bg-[#0C0A0E] text-[#C5A15D] focus:ring-[#C5A15D]/30"
                  />
                  <span className="text-xs text-[#EDE2D0]/70 group-hover:text-[#EDE2D0] leading-relaxed transition-colors">
                    We hereby confirm that the designated representatives are officially authorized by our collegiate institution to attend the <strong>Samanvay 2027 Contingent Leaders' Meet</strong> at Thakur Specialized Degree College. We agree to uphold conclave decorum and receive official festival coordination documents.
                  </span>
                </label>
              </div>

              {errors.consent && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.consent}</span>
                </p>
              )}

            </div>

            {/* ================= SUBMIT ACTION ================= */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-gold px-10 py-4 rounded-sm text-xs tracking-[0.25em] inline-flex items-center gap-3 shadow-xl ${
                  isSubmitting ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0C0A0E] border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Accreditation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#0C0A0E]" />
                    <span>Confirm Delegation & Issue Conclave Pass</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#EDE2D0]/40 font-mono mt-3">
                Official delegation pass code will be generated instantly
              </p>
            </div>

          </form>

        </div>

      </div>

    </section>
  );
};
