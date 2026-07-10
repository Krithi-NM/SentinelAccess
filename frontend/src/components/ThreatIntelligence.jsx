import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, AlertTriangle, Zap, Gauge, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ThreatIntelligence = () => {
  const [threatData, setThreatData] = useState([]);
  const [predictedRisk, setPredictedRisk] = useState(78);
  const [threatActor, setThreatActor] = useState(null);

  useEffect(() => {
    // Generate realistic threat trajectory data
    const data = [];
    for (let i = 0; i < 24; i++) {
      const baseRisk = 30 + Math.sin(i / 4) * 20;
      const trending = i > 12 ? (i - 12) * 2 : 0;
      data.push({
        hour: `${i}:00`,
        risk: Math.round(baseRisk + trending + Math.random() * 10),
        predicted: Math.round(baseRisk + trending + 15 + Math.random() * 5)
      });
    }
    setThreatData(data);

    // Simulate AI threat actor profiling
    const profiles = [
      { name: 'Insider Threat - Financial Motive', confidence: 87, tactics: ['Lateral Movement', 'Data Exfiltration', 'Privilege Escalation'] },
      { name: 'APT28 - State Sponsored', confidence: 72, tactics: ['Reconnaissance', 'Persistence', 'C2 Activation'] },
      { name: 'Credential Compromise - External', confidence: 65, tactics: ['Brute Force', 'MFA Bypass', 'Resource Access'] }
    ];
    setThreatActor(profiles[Math.floor(Math.random() * profiles.length)]);
  }, []);

  const riskIndicators = [
    { label: 'Anomaly Score', value: 92, color: 'text-red-600', icon: AlertTriangle },
    { label: 'Velocity Factor', value: 84, color: 'text-orange-600', icon: TrendingUp },
    { label: 'Threat Confidence', value: threatActor?.confidence || 78, color: 'text-yellow-600', icon: Brain }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 px-6">
        <div className="p-3 bg-accent/20 rounded-2xl">
          <Brain size={24} className="text-accent" />
        </div>
        <div>
          <h2 className="text-4xl font-display font-bold m-0">AI Threat Forecast</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Quantum-enhanced predictive threat modeling & behavioral anomaly AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Trajectory */}
        <div className="lg:col-span-2 card-premium rounded-[3rem] overflow-hidden p-8 bg-white">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">24-Hour Risk Trajectory</div>
              <div className="text-3xl font-display font-bold text-primary mt-2">Next 6 Hours: <span className="text-red-600">{predictedRisk}% Risk</span></div>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <Gauge size={32} className="text-red-600" />
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={threatData}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem' }}
                formatter={(value) => [`${value}%`, 'Risk']}
              />
              <Area type="monotone" dataKey="risk" stroke="#2563eb" fillOpacity={1} fill="url(#colorRisk)" name="Observed" />
              <Area type="monotone" dataKey="predicted" stroke="#dc2626" fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted" />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-red-600 flex-shrink-0" />
              <div className="text-sm font-bold text-red-900">
                <span className="font-black">CRITICAL ALERT:</span> Risk trajectory shows 340% increase over 48 hours. Immediate escalation recommended.
              </div>
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="space-y-4">
          {riskIndicators.map((indicator, i) => {
            const Icon = indicator.icon;
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (indicator.value / 100) * circumference;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-premium rounded-[2rem] p-6 bg-white text-center"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 bg-gray-50 rounded-lg ${indicator.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">ML Score</div>
                </div>
                
                <div className="relative h-24 flex items-center justify-center mb-4">
                  <svg width="100" height="100" className="absolute">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke="currentColor" strokeWidth="8"
                      className={indicator.color}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', transition: 'all 0.8s ease' }}
                    />
                  </svg>
                  <div className="text-center">
                    <div className={`text-3xl font-black ${indicator.color}`}>{indicator.value}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</div>
                  </div>
                </div>
                
                <div className="text-xs font-bold text-gray-700 leading-tight">{indicator.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Threat Actor Profile */}
      {threatActor && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium rounded-[3rem] p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-l-[8px] border-purple-600"
        >
          <div className="flex items-start gap-8">
            <div className="p-6 bg-white rounded-2xl border border-purple-100 flex-shrink-0">
              <Target size={32} className="text-purple-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-2xl font-display font-bold text-purple-900 m-0">Threat Actor Profile</h3>
                <span className="px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-full uppercase tracking-widest">
                  {threatActor.confidence}% Confidence
                </span>
              </div>
              
              <p className="text-lg font-bold text-purple-900 mb-6">{threatActor.name}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-purple-100">
                  <div className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-2">Attack Vector</div>
                  <div className="text-sm font-bold text-gray-700">{threatActor.tactics[0]}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-purple-100">
                  <div className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-2">Primary Tactic</div>
                  <div className="text-sm font-bold text-gray-700">{threatActor.tactics[1]}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-purple-100">
                  <div className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-2">Next Move</div>
                  <div className="text-sm font-bold text-gray-700">{threatActor.tactics[2]}</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-xl border border-purple-200 space-y-2">
                <div className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">AI Recommended Actions</div>
                <ul className="space-y-1 text-sm font-medium text-gray-700">
                  <li>✓ Isolate systems with {threatActor.tactics[1].toLowerCase()}</li>
                  <li>✓ Enable enhanced MFA for privileged accounts</li>
                  <li>✓ Deploy behavioral monitoring on {threatActor.tactics[0].toLowerCase()} vectors</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default ThreatIntelligence;
