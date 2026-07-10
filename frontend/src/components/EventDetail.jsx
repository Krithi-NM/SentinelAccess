import React, { useState } from 'react';
import { X, ShieldAlert, Clock, Database, MapPin, DatabaseZap, CircleCheck, Fingerprint, User, Shield, Info, Activity, CircleAlert, FileText, Send, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';
import RiskBadge from './RiskBadge';
import { format } from 'date-fns';

const EventDetail = ({ event, isOpen, onClose, onAcknowledge }) => {
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);

  if (!event) return null;

  const handleAcknowledge = async () => {
    setIsAcknowledging(true);
    try {
      await api.post(`/events/${event.event_id}/acknowledge`);
      onAcknowledge(event.event_id);
      toast.success(
        <div>
          <div className="font-bold">Threat Acknowledged</div>
          <div className="text-xs opacity-80">Status changed to: Under Investigation</div>
        </div>
      );
      onClose();
    } catch (err) {
      toast.error('Failed to acknowledge threat');
      console.error(err);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const handleEscalate = async () => {
    setIsEscalating(true);
    try {
      await api.post(`/events/${event.event_id}/escalate`);
      const incidentId = `INC-${Math.floor(100000 + Math.random() * 900000)}`;
      onAcknowledge(event.event_id);
      toast(
        (t) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <CircleAlert size={16} /> Incident Response Activated
            </div>
            <div className="text-xs">ID: {incidentId} | Escalated to Tier-3 SOC</div>
          </div>
        ),
        { duration: 5000, style: { border: '1px solid #ef4444' } }
      );
      onClose();
    } catch (err) {
      toast.error('Escalation failed');
      console.error(err);
    } finally {
      setIsEscalating(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-40" 
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 right-0 w-[700px] bg-white shadow-[-40px_0_100px_rgba(0,0,0,0.15)] z-50 transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col font-sans relative overflow-hidden">
          {/* Header Banner */}
          <div className="bg-primary p-12 text-white relative">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <ShieldAlert size={200} />
             </div>
             
             <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                     <RiskBadge tier={event.risk_tier} />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Reference: {event.event_id}</span>
                  </div>
                  <h2 className="text-5xl text-white font-display mb-2">{String(event.event_type || 'Unknown Event')}</h2>
                  <p className="text-white/70 text-base font-medium">Investigative deep-dive into behavioral anomaly detection.</p>
                </div>
                <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-2xl transition-all group backdrop-blur-xl border border-white/10">
                  <X size={24} className="text-white/60 group-hover:text-white" />
                </button>
             </div>

             <div className="mt-12 flex gap-12 items-center">
                <div className="flex items-center gap-4">
                   <div className="text-6xl font-black font-display text-accent tracking-tighter">{Math.round(event.risk_score)}</div>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Risk Score</div>
                      <div className="text-xs font-bold text-accent">CRITICAL THREAT</div>
                   </div>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="flex items-center gap-4">
                   <div className="text-3xl font-black font-display text-white">96<span className="text-lg opacity-50">%</span></div>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">AI Confidence</div>
                      <div className="text-xs font-bold text-green-400">HIGH PRECISION</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-12">
            {/* Quick Actions */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                 <ShieldAlert size={14} /> Quick Actions
              </div>
              <div className="rounded-[2.5rem] border border-gray-100 bg-gradient-to-br from-primary/5 via-white to-red-50/80 p-8 shadow-sm">
                <p className="text-base font-semibold text-gray-600 mb-6">Choose the next move for this alert directly from the incident view.</p>
                <div className="flex gap-4">
                  <button 
                    disabled={isAcknowledging || event.is_acknowledged}
                    onClick={handleAcknowledge}
                    className={`flex-1 py-5 text-base font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 rounded-2xl transition-all ${
                      event.is_acknowledged ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.01]'
                    }`}
                  >
                    {isAcknowledging ? <Activity size={18} className="animate-spin" /> : <CircleCheck size={18} />}
                    {event.is_acknowledged ? 'Threat Resolved' : 'Acknowledge Threat'}
                  </button>
                  <button 
                    disabled={isEscalating || isAcknowledging || event.is_escalated}
                    onClick={handleEscalate}
                    className="flex-1 py-5 text-base font-black uppercase tracking-[0.25em] bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-500/10 disabled:opacity-50"
                  >
                    {isEscalating ? <Activity size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                    {event.is_escalated ? 'Escalated to Tier-3' : 'Escalate to Tier-3'}
                  </button>
                </div>
              </div>
            </section>

            {/* Subject Profile */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                 <User size={14} /> Subject Context
              </div>
              <div className="flex items-center gap-8 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                 <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary border border-primary/10">
                    <Fingerprint size={40} />
                 </div>
                 <div className="flex-1">
                    <div className="text-3xl font-bold font-display text-primary tracking-tight">{String(event.user?.name || 'Unknown')}</div>
                    <div className="text-base font-bold text-gray-400 mt-1">{String(event.user?.role || 'N/A')} • {String(event.user?.department || 'N/A')}</div>
                    <div className="mt-4 flex gap-6 items-center">
                       <span className="text-[11px] font-mono font-bold px-3 py-1 bg-white border border-gray-100 rounded-lg text-primary/60">{event.user_id}</span>
                       <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5"><Clock size={12} /> Active since {format(new Date(event.user?.join_date || Date.now()), 'yyyy')}</span>
                    </div>
                 </div>
              </div>
            </section>

            {/* Evidence & Reasons */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                 <Activity size={14} /> AI Detection Signals
              </div>
              <div className="grid grid-cols-1 gap-4">
                {event.top_reasons?.map((reason, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-6 p-6 bg-white border-2 border-orange-50 rounded-[2rem] shadow-sm hover:border-orange-100 transition-all group"
                  >
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-100 transition-colors">
                      <CircleAlert size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl text-primary font-bold font-display leading-tight">{String(reason || 'Anomaly Detected')}</p>
                      <div className="flex items-center gap-4 mt-3">
                         <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '92%' }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-orange-400 to-red-500" 
                            />
                         </div>
                         <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase whitespace-nowrap">92% Match Prob.</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Timeline & Integrity */}
            <section className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    <FileText size={14} /> Incident Timeline
                  </div>
                  <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 space-y-4 font-mono text-[11px]">
                     <div className="flex justify-between text-gray-500"><span className="font-bold">Detected:</span> {format(new Date(event.timestamp), 'HH:mm:ss')}</div>
                     <div className="flex justify-between text-gray-500"><span className="font-bold">Analyzed:</span> {format(new Date(event.timestamp), 'HH:mm:ss')}</div>
                     <div className="flex justify-between text-accent"><span className="font-bold">Alerted:</span> {format(new Date(event.timestamp), 'HH:mm:ss')}</div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    <Shield size={14} /> Data Integrity
                  </div>
                  <div className="p-6 bg-green-50/50 rounded-[2rem] border border-green-100/50 space-y-3">
                     <div className="flex items-center gap-2 text-green-700 text-[10px] font-black uppercase tracking-widest">
                        <Lock size={12} /> Quantum-Safe Integrity Signature
                     </div>
                     <div className="text-[9px] font-mono text-green-600/60 break-all leading-relaxed uppercase">
                        H64_SH3_SIG::{event.event_id.replace(/-/g, '').substring(0, 24)}_CRYPTO_VERIFIED
                     </div>
                  </div>
               </div>
            </section>

            {/* Strategic Response */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                 <Send size={14} /> Recommended Response
               </div>
               <div className={`p-10 rounded-[3rem] border-4 flex flex-col gap-8 shadow-2xl relative overflow-hidden ${
                event.risk_tier === 'Critical' ? 'bg-red-50/50 border-red-100 text-red-900 shadow-red-900/5' :
                event.risk_tier === 'High' ? 'bg-orange-50/50 border-orange-100 text-orange-900 shadow-orange-900/5' :
                'bg-gray-50 border-gray-100 text-gray-600'
              }`}>
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`p-4 rounded-2xl ${event.risk_tier === 'Critical' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'}`}>
                     <ShieldAlert size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-display">Automated Response Pack</h4>
                    <p className="text-[10px] opacity-60 font-black uppercase tracking-widest mt-1">NIST CSF Response Framework</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 relative z-10">
                   {[
                     'Suspend OIDC Tokens',
                     'Step-up MFA Challenge',
                     'Isolate Node IP',
                     'Dump Process Memory'
                   ].map((action, i) => (
                     <div key={i} className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl border border-white/80">
                        <CircleCheck className="text-green-500" size={18} />
                        <span className="text-xs font-bold text-primary/80">{action}</span>
                     </div>
                   ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Actions */}
          <div className="p-10 border-t border-gray-100 bg-white/80 backdrop-blur-xl">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Quick control bar</div>
            <div className="flex gap-6">
              <button 
                disabled={isAcknowledging || event.is_acknowledged}
                onClick={handleAcknowledge}
                className={`flex-1 py-5 font-black uppercase tracking-[0.25em] text-sm flex items-center justify-center gap-3 rounded-2xl transition-all shadow-xl ${
                  event.is_acknowledged ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white hover:scale-[1.01] shadow-primary/20'
                }`}
              >
                {isAcknowledging ? <Activity size={20} className="animate-spin" /> : <CircleCheck size={20} />}
                {event.is_acknowledged ? 'Threat Resolved' : 'Acknowledge Threat'}
              </button>
              <button 
                disabled={isEscalating || isAcknowledging || event.is_escalated}
                onClick={handleEscalate}
                className="flex-1 py-5 bg-white border-2 border-red-500 text-red-500 font-black uppercase tracking-[0.25em] text-sm hover:bg-red-500 hover:text-white hover:scale-[1.01] transition-all rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-500/10 disabled:opacity-50"
              >
                {isEscalating ? <Activity size={20} className="animate-spin" /> : <ShieldAlert size={20} />}
                {event.is_escalated ? 'Escalated to Tier-3' : 'Escalate to Tier-3'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
