import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import StatCard from '../components/StatCard';
import EventTable from '../components/EventTable';
import EventDetail from '../components/EventDetail';
import AttackSimulator from '../components/AttackSimulator';
import ThreatIntelligence from '../components/ThreatIntelligence';
import { ShieldAlert, AlertTriangle, Activity, Users, Zap, Terminal, Globe } from 'lucide-react';

const Dashboard = ({ onRescore, isRescoring }) => {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterTier, setFilterTier] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveEvents, setLiveEvents] = useState([
    "Cloudflare WAF blocked SQLi attempt from 185.12.x.x",
    "Azure AD Identity Protection detected 'Unfamiliar Location' for EMP-402",
    "SentinalOne flagged suspicious process: 'mimikatz.exe' on WKSTN-09",
    "Global Risk Index: 14.2 (Stable)",
    "DLP Engine: Policy 'PII Export' triggered by U1004"
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, eventsRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get(`/events?limit=50${filterTier ? `&risk_tier=${filterTier}` : ''}`)
      ]);
      setSummary(summaryRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterTier, isRescoring]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate live events
      setLiveEvents(prev => {
        const next = [...prev];
        const last = next.pop();
        next.unshift(last);
        return next;
      });

      // Simulate a random stat fluctuation
      setSummary(prev => {
        if (!prev || prev.total_today === undefined) return prev;
        return {
          ...prev,
          total_today: (prev.total_today || 0) + (Math.random() > 0.7 ? 1 : 0)
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleAcknowledge = (id) => {
    setEvents(events.map(e => e.event_id === id ? { ...e, is_acknowledged: true } : e));
    fetchData(); // Refresh summary too
  };

  if (loading && !summary) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-primary font-bold">Initializing Intelligence Layer...</div>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="leading-tight !text-primary m-0">Security Command <span className="text-primary/10">Operations</span></h1>
          <p className="text-gray-400 text-xl font-medium max-w-3xl">Global intelligence surveillance and privileged access behavioral monitoring across banking infrastructure.</p>
        </div>
        
        <div className="flex gap-6 pb-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSimulating(true)}
            disabled
            className="flex items-center gap-4 bg-accent/50 text-primary/50 px-10 py-5 rounded-[1.5rem] text-sm font-black shadow-2xl shadow-accent/20 tracking-[0.2em] group uppercase cursor-not-allowed"
          >
            <Zap size={20} className="group-hover:animate-bounce opacity-50" fill="currentColor" /> Run Attack Simulation
          </motion.button>
          
          <div className="relative">
             <select 
              className="appearance-none bg-white border-2 border-gray-100/50 text-sm font-black uppercase tracking-[0.15em] rounded-2xl px-8 py-5 outline-none focus:ring-4 focus:ring-primary/5 transition-all text-gray-500 pr-12"
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
            >
              <option value="">All Risk Tiers</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Exposure</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white p-6 px-10 rounded-[2.5rem] flex items-center gap-10 overflow-hidden border border-white/5 shadow-[0_30px_60px_rgba(2,18,24,0.3)] relative h-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 whitespace-nowrap bg-red-600 px-6 py-2 rounded-xl text-[10px] font-black animate-pulse z-20 tracking-[0.3em] relative">
          <Terminal size={16} /> LIVE THREAT FEED
        </div>
        <div className="flex-1 scrolling-text font-mono text-sm text-white/60 italic z-10 tracking-widest relative flex items-center">
          {liveEvents.join("   •   [SEC-OPS]   •   ")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <StatCard 
            label="Critical Security Threats" 
            value={summary?.critical || 0} 
            colorClass="#C62E2E" 
            icon={ShieldAlert} 
            premium 
          />
        </div>
        <div className="md:col-span-4">
          <StatCard 
            label="High Risk Anomalies" 
            value={summary?.high || 0} 
            colorClass="#E8603C" 
            icon={AlertTriangle} 
          />
        </div>
        <div className="md:col-span-3 flex flex-col gap-8">
            <StatCard 
              label="Medium Alerts" 
              value={summary?.medium || 0} 
              colorClass="#E8A33D" 
              icon={AlertTriangle} 
              small
            />
            <StatCard 
              label="Active Analysts" 
              value={12} 
              colorClass="#215868" 
              icon={Users} 
              small
            />
        </div>
      </div>

      <ThreatIntelligence />

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center px-6">
          <div className="flex items-center gap-6">
             <h2 className="text-4xl m-0">Investigative Stream</h2>
             <div className="px-4 py-1.5 bg-primary/5 text-primary/40 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-primary/5">Real-time Buffer</div>
          </div>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">AI Ranking Logic: Enabled</span>
             <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="h-full w-20 bg-primary/30 rounded-full" 
                />
             </div>
          </div>
        </div>
        <div className="card-premium rounded-[3rem] overflow-hidden bg-white shadow-2xl border-none">
          <EventTable events={events} onRowClick={handleRowClick} />
          {events.length === 0 && (
            <div className="text-center py-48 text-gray-300 font-medium italic space-y-6">
               <div className="flex justify-center">
                  <Activity size={60} className="opacity-20 animate-pulse" />
               </div>
               <p className="text-lg">Scanning encrypted audit trails... No matching anomalies found.</p>
            </div>
          )}
        </div>
      </motion.section>

      <EventDetail 
        event={selectedEvent} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        onAcknowledge={handleAcknowledge}
      />

      <AttackSimulator 
        isOpen={isSimulating}
        onClose={() => setIsSimulating(false)}
        onComplete={(event) => {
          setSelectedEvent(event);
          setIsDetailOpen(true);
          fetchData();
        }}
      />
    </div>
  );
};

export default Dashboard;
