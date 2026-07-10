import React, { useState, useEffect } from 'react';
import api from '../api';
import EventTable from '../components/EventTable';
import EventDetail from '../components/EventDetail';

const Alerts = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events?limit=100');
      
      const filtered = res.data.filter(e => {
        if (e.is_acknowledged) return false;
        if (activeTab === 'Escalated') return e.status === 'Escalated';
        return e.status === 'Pending' && (e.risk_tier === 'Critical' || e.risk_tier === 'High');
      }).sort((a, b) => b.risk_score - a.risk_score);
        
      setEvents(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [activeTab]);

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleAcknowledge = (id) => {
    setEvents(events.filter(e => e.event_id !== id));
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-12">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-6xl tracking-tight">Response <span className="text-primary/30">Intelligence</span></h1>
           <p className="text-gray-500 text-lg mt-2 font-medium">Prioritized investigation queue for anomalous behavioral patterns.</p>
           <p className="text-primary/70 text-sm mt-2 font-semibold">Click any person to open their alert and take action.</p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md rounded-[2rem] p-2 border-2 border-gray-100 shadow-xl shadow-gray-200/50">
          {['Pending', 'Escalated'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-4 rounded-[1.5rem] text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 ${activeTab === tab ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-gray-400 hover:text-primary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="card-premium rounded-[3rem] overflow-hidden bg-white min-h-[600px] border-none">
        <div className="p-8 px-12 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Querying Global Threat Database...</span>
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-accent/20 px-4 py-1.5 rounded-full">{events.length} ACTIVE RECORDS</span>
        </div>
        
        {loading ? (
          <div className="p-40 flex flex-col items-center gap-8">
             <div className="w-20 h-20 border-8 border-primary/5 border-t-primary rounded-full animate-spin shadow-2xl" />
             <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] animate-pulse">Syncing Cryptographic Hash Chains</div>
          </div>
        ) : events.length > 0 ? (
          <EventTable events={events} onRowClick={handleRowClick} />
        ) : (
          <div className="p-40 text-center space-y-6">
            <div className="text-8xl mb-8 opacity-20">🛡️</div>
            <h3 className="text-3xl font-display font-bold text-primary">Cyber-Clearance Optimized</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">All identified high-risk vectors for current epoch have been mitigated or acknowledged.</p>
            <button onClick={fetchAlerts} className="btn-outline border-none shadow-none text-xs tracking-widest hover:bg-transparent hover:text-primary/50">
               Force Refresh Subsystems
            </button>
          </div>
        )}
      </div>

      <EventDetail 
        event={selectedEvent} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        onAcknowledge={handleAcknowledge}
      />
    </div>
  );
};

export default Alerts;
