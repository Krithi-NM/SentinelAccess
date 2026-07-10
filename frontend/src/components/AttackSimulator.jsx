import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ChevronRight, Terminal } from 'lucide-react';
import CountUp from 'react-countup';
import api from '../api';

const AttackSimulator = ({ isOpen, onClose, onComplete }) => {
  const [riskScore, setRiskScore] = useState(12);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const stepsText = [
    { time: '14:22:01', label: 'Peripheral login verified: EMP-092 (Privileged)' },
    { time: '14:22:15', label: 'SSH tunneling established via 102.16.x.x' },
    { time: '14:23:40', label: 'Lateral move detected: Core Ledger Server' },
    { time: '14:24:12', label: 'Mass decryption attempt on PII Database' },
    { time: '14:25:05', label: 'Exfiltration pipeline initiated: 4.2 GB/min' },
    { time: '14:25:32', label: 'Quantum Integrity Violation | AI ESCALATION' }
  ];

  const riskScores = [12, 18, 42, 76, 89, 98];

  const startSimulation = async () => {
    setIsSimulating(true);
    setStepIndex(0);
    setRiskScore(12);

    for (let i = 0; i < stepsText.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStepIndex(i + 1);
      setRiskScore(riskScores[i]);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await api.post('/simulate-attack');
      const eventRes = await api.get(`/events/${res.data.event_id}`);
      onComplete(eventRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startSimulation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-3xl p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 text-white"
      >
        {/* Left Side */}
        <div className="md:col-span-5 space-y-8">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center space-y-6 shadow-2xl">
             <div className="inline-flex p-4 bg-accent/20 rounded-3xl mb-4">
                <Activity className="text-accent animate-pulse" size={40} />
             </div>
             <h2 className="text-4xl font-display font-bold">Live Attack <span className="text-accent">Replay</span></h2>
             <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">SOC Intelligence Engine</p>

             <div className="py-8">
                <div className="text-sm font-black text-white/30 uppercase tracking-[0.4em] mb-4">Cumulative Risk Exposure</div>
                <div className="text-9xl font-display font-black text-white">
                   <CountUp end={riskScore} duration={1} />
                </div>
                <div className={`mt-4 inline-block px-6 py-2 rounded-full text-sm font-black uppercase tracking-[0.2em] ${
                  riskScore > 80 ? 'bg-red-600' : riskScore > 40 ? 'bg-orange-500' : 'bg-blue-600'
                }`}>
                  {riskScore > 80 ? 'Critical Breach' : riskScore > 40 ? 'Warning' : 'Monitoring'}
                </div>
             </div>
          </div>

          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
             <div className="w-4 h-4 rounded-full bg-accent animate-ping" />
             <div className="flex-1">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Quantum Safe Checksum</div>
                <div className="text-xs font-mono text-accent/60 truncate mt-1">SH3-512::TR92-X902-AM82-L019</div>
             </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:col-span-7 space-y-6 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
             <Terminal size={20} className="text-accent" />
             <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Investigative Audit Trail</span>
          </div>
          
          <div className="space-y-4 relative max-h-96 overflow-y-auto">
            {stepsText.slice(0, stepIndex).map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                  <ChevronRight size={16} className="text-white/40" />
                </div>
                <div className="pt-1">
                  <span className="font-mono text-accent text-xs font-bold">{step.time}</span>
                  <div className="text-sm font-bold text-white/90 mt-1">{step.label}</div>
                </div>
              </motion.div>
            ))}

            {isSimulating && stepIndex < stepsText.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 text-white/40 text-xs mt-6"
              >
                <div className="w-3 h-3 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
                <span className="font-mono uppercase font-black">AI Processing...</span>
              </motion.div>
            )}

            {stepIndex === stepsText.length && !isSimulating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 mt-6 border-t border-white/10"
              >
                <button
                  onClick={onClose}
                  className="bg-accent text-primary px-12 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/40 w-full"
                >
                  Access Deep Analysis
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AttackSimulator;
