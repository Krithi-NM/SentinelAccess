import React, { useState, useEffect } from 'react';
import api from '../api';
import StatCard from '../components/StatCard';
import EventTable from '../components/EventTable';
import EventDetail from '../components/EventDetail';
import { ShieldAlert, AlertTriangle, Activity, Users } from 'lucide-react';

const Dashboard = ({ onRescore, isRescoring }) => {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterTier, setFilterTier] = useState('');
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif">Security Dashboard</h2>
          <p className="text-gray-500 mt-1">Real-time privileged access monitoring and threat detection.</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="">All Tiers</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Events Today" value={summary?.total_today || 0} colorClass="#215868" icon={Activity} />
        <StatCard label="Critical Threats" value={summary?.critical || 0} colorClass="#C62E2E" icon={ShieldAlert} />
        <StatCard label="High Risk" value={summary?.high || 0} colorClass="#E8603C" icon={AlertTriangle} />
        <StatCard label="Medium Risk" value={summary?.medium || 0} colorClass="#E8A33D" icon={AlertTriangle} />
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-serif">Recent Access Events</h3>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Sorted by risk priority</span>
        </div>
        <EventTable events={events} onRowClick={handleRowClick} />
        {events.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            No events found matching the current filters.
          </div>
        )}
      </section>

      <EventDetail 
        event={selectedEvent} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        onAcknowledge={handleAcknowledge}
      />
    </div>
  );
};

export default Dashboard;
