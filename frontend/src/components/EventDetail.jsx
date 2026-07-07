import React, { useState } from 'react';
import { X, ShieldAlert, Clock, Database, MapPin, DatabaseZap, CheckCircle, Fingerprint } from 'lucide-react';
import api from '../api';
import RiskBadge from './RiskBadge';
import { format } from 'date-fns';

const EventDetail = ({ event, isOpen, onClose, onAcknowledge }) => {
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  if (!event) return null;

  const handleAcknowledge = async () => {
    setIsAcknowledging(true);
    try {
      await api.post(`/events/${event.event_id}/acknowledge`);
      onAcknowledge(event.event_id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const simulatedActions = {
    'Low': 'No action needed: Activity fits typical profile.',
    'Medium': 'Flagged for review: Security analyst notified.',
    'High': 'Step-up required: MFA challenge issued to user.',
    'Critical': 'Access Suspended: User account locked pending investigation.'
  };

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-300" 
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[500px] border-l border-gray-200'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <div className="flex items-center gap-3">
                <RiskBadge tier={event.risk_tier} />
                <span className="text-3xl font-bold text-primary">{Math.round(event.risk_score)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Risk Assessment Score</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors group">
              <X size={24} className="text-gray-400 group-hover:text-primary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* User Info */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Subject Information</h3>
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <div className="font-bold text-primary text-xl">{event.user?.name}</div>
                <div className="text-sm text-gray-600 mb-2">{event.user?.role} — {event.user?.department}</div>
                <div className="flex items-center gap-4 text-xs font-semibold text-primary/60">
                  <span>ID: {event.user_id}</span>
                  <span>•</span>
                  <span>Joined: {format(new Date(event.user?.join_date || Date.now()), 'MMM yyyy')}</span>
                </div>
              </div>
            </section>

            {/* Explainability */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Detection Explanations</h3>
              <div className="space-y-3">
                {event.top_reasons?.map((reason, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-orange-50/50 border border-orange-100 rounded-lg">
                    <ShieldAlert className="text-risk-high shrink-0" size={20} />
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{reason}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Data */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Event Context</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold mb-1">
                    <Clock size={12} /> Access Time
                  </div>
                  <div className="text-sm font-semibold">{format(new Date(event.timestamp), 'HH:mm (yyyy-MM-dd)')}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold mb-1">
                    <MapPin size={12} /> Location
                  </div>
                  <div className="text-sm font-semibold">{event.location}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold mb-1">
                    <Database size={12} /> Volume
                  </div>
                  <div className="text-sm font-semibold">{event.data_volume_mb} MB</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold mb-1">
                    <DatabaseZap size={12} /> Resource
                  </div>
                  <div className="text-sm font-semibold truncate">{event.resource_accessed}</div>
                </div>
              </div>
            </section>

            {/* Audit Verification */}
            <section>
              <div className="p-4 bg-gray-900 rounded-xl text-white">
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase mb-2">
                  <Fingerprint size={14} /> Quantum-Safe Integrity Signature
                </div>
                <div className="font-mono text-[10px] break-all text-white/50 bg-black/30 p-2 rounded border border-white/10">
                  {event.audit_hash}
                </div>
              </div>
            </section>

            {/* Response Panel */}
            <section className="pt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 italic">Simulated System Response</h3>
              <div className={`p-4 rounded-lg border flex items-center gap-4 ${
                event.risk_tier === 'Critical' ? 'bg-risk-critical/10 border-risk-critical/20 text-risk-critical' :
                event.risk_tier === 'High' ? 'bg-risk-high/10 border-risk-high/20 text-risk-high' :
                'bg-gray-100 border-gray-200 text-gray-600'
              }`}>
                <ShieldAlert size={24} />
                <p className="text-sm font-bold uppercase tracking-wide">{simulatedActions[event.risk_tier] || 'Monitoring standard activity.'}</p>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50">
            <button 
              disabled={isAcknowledging || event.is_acknowledged}
              onClick={handleAcknowledge}
              className={`flex-1 py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-lg transition-all ${
                event.is_acknowledged ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {event.is_acknowledged ? <CheckCircle size={16} /> : null}
              {event.is_acknowledged ? 'Acknowledged' : 'Acknowledge Threat'}
            </button>
            <button className="px-6 py-3 border border-red-200 text-red-600 font-bold uppercase tracking-widest text-xs hover:bg-red-50 transition-all rounded-lg">
              Escalate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
