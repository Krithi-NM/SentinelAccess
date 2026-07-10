import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import RiskBadge from './RiskBadge';
import { ExternalLink, ShieldAlert, CircleCheck, CircleAlert } from 'lucide-react';

const EventTable = ({ events, onRowClick }) => {
  return (
    <div className="relative overflow-x-auto rounded-[2.5rem]">
      <table className="w-full text-left border-collapse table-auto">
        <thead className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-3xl border-b border-gray-100">
          <tr>
            <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Subject Intelligence</th>
            <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Temporal Marker</th>
            <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Risk Vector</th>
            <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Security Tier</th>
            <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
            <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Anomaly Trace</th>
            <th className="px-10 py-8"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50/50 bg-white">
          {events.map((event, i) => (
            <motion.tr 
              key={event.event_id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onRowClick(event)}
              className="table-row group hover:bg-primary/[0.02] cursor-pointer"
            >
              <td className="px-10 py-8">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary/40 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                      <ShieldAlert size={20} />
                   </div>
                   <div>
                      <div className="font-display font-bold text-xl text-primary transition-colors leading-tight">{String(event.user?.name || 'Unknown')}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1 opacity-70 group-hover:text-primary/60">{String(event.user?.role || 'N/A')} • {String(event.user?.department || 'N/A')}</div>
                   </div>
                </div>
              </td>
              <td className="px-10 py-8 text-[13px] font-bold text-gray-500 tabular-nums">
                {format(new Date(event.timestamp), 'MMM dd, HH:mm:ss')}
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Audit Logged</div>
              </td>
              <td className="px-10 py-8 text-center">
                <div className="inline-flex flex-col items-center">
                   <span className="text-2xl font-black text-primary tabular-nums group-hover:scale-110 transition-transform">{Math.round(event.risk_score)}</span>
                   <div className="h-1 w-10 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${event.risk_score}%` }} />
                   </div>
                </div>
              </td>
              <td className="px-10 py-8">
                <RiskBadge tier={event.risk_tier} />
              </td>
              <td className="px-10 py-8">
                {event.status === 'Escalated' ? (
                  <div className="flex items-center gap-2 text-red-600">
                     <CircleAlert size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Escalated</span>
                  </div>
                ) : event.is_acknowledged ? (
                  <div className="flex items-center gap-2 text-green-600">
                     <CircleCheck size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Investigated</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-500 animate-pulse">
                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Live Alert</span>
                  </div>
                )}
              </td>
              <td className="px-10 py-8">
                <div className="text-[13px] text-gray-600 font-bold max-w-[300px] truncate group-hover:text-primary transition-colors">
                  {String(event.top_reasons?.[0] || 'Behavioral baseline verified')}
                </div>
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Primary Anomaly Vector</div>
              </td>
              <td className="px-10 py-8 text-right">
                <div className="p-3 rounded-xl hover:bg-primary hover:text-white text-gray-300 transition-all inline-block">
                   <ExternalLink size={20} />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
