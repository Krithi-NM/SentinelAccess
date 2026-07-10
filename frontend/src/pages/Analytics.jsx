import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area
} from 'recharts';
import StatCard from '../components/StatCard';
import { ShieldCheck, Clock, Activity, ShieldAlert, Cpu, Database, Network } from 'lucide-react';

const deptData = [
  { name: 'Finance', risk: 85, color: '#C62E2E', incidents: 12 },
  { name: 'Engineering', risk: 62, color: '#E8603C', incidents: 34 },
  { name: 'Operations', risk: 45, color: '#215868', incidents: 8 },
  { name: 'Human Resources', risk: 28, color: '#215868', incidents: 3 },
  { name: 'Global Sales', risk: 15, color: '#215868', incidents: 1 },
];

const trendData = [
  { day: 'Mon', count: 12, baseline: 15 },
  { day: 'Tue', count: 18, baseline: 16 },
  { day: 'Wed', count: 45, baseline: 18 },
  { day: 'Thu', count: 32, baseline: 17 },
  { day: 'Fri', count: 68, baseline: 19 },
  { day: 'Sat', count: 15, baseline: 14 },
  { day: 'Sun', count: 10, baseline: 12 },
];

const Analytics = () => {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-display font-bold">Cyber Intelligence <span className="text-primary/30">Analytics</span></h1>
          <p className="text-gray-500 text-xl mt-4 font-medium max-w-2xl">High-fidelity behavioral analytics and cross-departmental risk vectors monitored in real-time.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live Telemetry Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard label="Platform Integrity" value={99} colorClass="#4CA771" icon={ShieldCheck} small />
        <StatCard label="Response Latency (m)" value={4} colorClass="#215868" icon={Clock} small />
        <StatCard label="Detected Vectors" value={142} colorClass="#E8603C" icon={Activity} small />
        <StatCard label="Security Score" value={92} colorClass="#4CA771" icon={ShieldAlert} small />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          whileHover={{ y: -5 }}
          className="card overflow-hidden !p-0 border-none shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
             <Cpu size={180} />
          </div>
          <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-display font-bold">Departmental Exposure Matrix</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Cross-domain risk evaluation</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
               <Database className="text-primary/40" size={20} />
            </div>
          </div>
          <div className="p-10 h-[550px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                 <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: '#999', fontSize: 11, fontWeight: 'bold'}} 
                   dy={20} 
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: '#999', fontSize: 11, fontWeight: 'bold'}} 
                   dx={-15} 
                 />
                 <Tooltip 
                   cursor={{fill: '#f8f8f8'}} 
                   contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px 20px', fontSize: '13px'}}
                 />
                 <Bar dataKey="risk" radius={[12, 12, 0, 0]} barSize={50} animationBegin={300} animationDuration={2000}>
                   {deptData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.risk > 80 ? '#C62E2E' : entry.risk > 50 ? '#E8603C' : '#215868'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="card overflow-hidden !p-0 border-none shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
             <Network size={180} />
          </div>
          <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <div>
                <h3 className="text-2xl font-display font-bold">Threat Velocity Trend</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">7-Day Anomaly distribution</p>
             </div>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-primary" />
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Baseline</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500" />
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Anomalies</span>
                </div>
             </div>
          </div>
          <div className="p-10 h-[550px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                 <defs>
                   <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#215868" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#215868" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 11, fontWeight: 'bold'}} dy={20} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 11, fontWeight: 'bold'}} dx={-15} />
                 <Tooltip 
                   contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px 20px', fontSize: '13px'}}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="baseline" 
                   stroke="#215868" 
                   strokeWidth={4} 
                   fillOpacity={1} 
                   fill="url(#colorRisk)" 
                   animationBegin={500}
                   animationDuration={2500}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="count" 
                   stroke="#ef4444" 
                   strokeWidth={3} 
                   strokeDasharray="5 5"
                   fillOpacity={1} 
                   fill="url(#colorAnomalies)" 
                   animationBegin={800}
                   animationDuration={3000}
                 />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           {label: "Identity Security", status: "Optimal Checksum", color: "text-green-600", desc: "No biometric variance detected"},
           {label: "Data Residency", status: "SOX Compliant", color: "text-green-600", desc: "Cross-border traffic encrypted"},
           {label: "ML Calibration", status: "Active (ISF-4)", color: "text-blue-600", desc: "Model confidence at 98.4%"}
         ].map((item, i) => (
           <div key={i} className="card bg-white border border-gray-100 flex flex-col gap-4 p-10 hover:shadow-2xl hover:scale-[1.02] transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{item.label}</span>
                <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-ping" />
              </div>
              <div className={`text-xl font-bold font-display tracking-tight ${item.color}`}>{item.status}</div>
              <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Analytics;
