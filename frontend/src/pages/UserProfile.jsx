import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import RiskBadge from '../components/RiskBadge';
import { User, Shield, Clock, Database } from 'lucide-react';
import EventTable from '../components/EventTable';
import EventDetail from '../components/EventDetail';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${userId}`);
      setUserData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) return <div className="p-20 text-center animate-pulse text-primary font-bold">Retrieving User Risk Profile...</div>;
  if (!userData) return <div className="p-20 text-center text-red-500">User not found.</div>;

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      {/* Header Profile */}
      <div className="card overflow-hidden !p-0">
        <div className="h-24 bg-primary flex items-end px-8 pb-4">
          <div className="h-20 w-20 bg-white rounded-2xl border-4 border-white shadow-xl flex items-center justify-center transform translate-y-8">
            <User size={40} className="text-primary" />
          </div>
        </div>
        <div className="pt-12 px-8 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-serif">{userData.name}</h2>
            <p className="text-gray-500 font-medium">{userData.role} • {userData.department}</p>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield size={12} /> ID: {userData.user_id}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> Joined {format(new Date(userData.join_date), 'MMMM yyyy')}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
              <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Avg Vol</div>
              <div className="text-lg font-bold text-primary">{userData.avg_data_volume} MB</div>
            </div>
            <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
              <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Typical Time</div>
              <div className="text-lg font-bold text-primary">{userData.typical_hours}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Trend Chart */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
             Risk Exposure Trend (30 Days)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userData.risk_trend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#215868" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#215868" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  hide
                />
                <YAxis domain={[0, 100]} stroke="#999" fontSize={10} />
                <Tooltip 
                  labelFormatter={(val) => format(new Date(val), 'MMM dd, HH:mm')}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#215868" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resources Panel */}
        <div className="card">
          <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
            <Database size={18} /> Typical Resources
          </h3>
          <div className="space-y-3">
            {userData.typical_resources.map((res, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-primary/30 transition-colors">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm font-medium text-gray-700">{res}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent History */}
      <section className="space-y-4">
        <h3 className="text-xl font-serif">Detailed Access Archive</h3>
        <EventTable 
          events={userData.recent_events.map(e => ({ ...e, user: userData }))} 
          onRowClick={(e) => { setSelectedEvent(e); setIsDetailOpen(true); }} 
        />
      </section>

      <EventDetail 
        event={selectedEvent} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        onAcknowledge={fetchUser}
      />
    </div>
  );
};

export default UserProfile;
