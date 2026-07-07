import React, { useState, useEffect } from 'react';
import api from '../api';
import EventTable from '../components/EventTable';
import EventDetail from '../components/EventDetail';

const Alerts = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // Fetch Critical and High risk tiers that are not acknowledged
      const [critical, high] = await Promise.all([
        api.get('/events?risk_tier=Critical&limit=100'),
        api.get('/events?risk_tier=High&limit=100')
      ]);
      
      const allAlerts = [...critical.data, ...high.data]
        .filter(e => !e.is_acknowledged)
        .sort((a, b) => b.risk_score - a.risk_score);
        
      setEvents(allAlerts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleAcknowledge = (id) => {
    setEvents(events.filter(e => e.event_id !== id));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-serif">Critical Alerts Panel</h2>
        <p className="text-gray-500 mt-1">Unresolved threats requiring immediate investigator intervention.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{events.length} Pending High-Priority Alerts</span>
        </div>
        
        {loading ? (
          <div className="p-20 text-center text-gray-400 animate-pulse">Scanning audit logs...</div>
        ) : events.length > 0 ? (
          <EventTable events={events} onRowClick={handleRowClick} />
        ) : (
          <div className="p-20 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-primary">All Clear</h3>
            <p className="text-gray-500">No unacknowledged high-risk threats detected.</p>
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
