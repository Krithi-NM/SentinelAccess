import React from 'react';
import { format } from 'date-fns';
import RiskBadge from './RiskBadge';
import { ExternalLink } from 'lucide-react';

const EventTable = ({ events, onRowClick }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 font-sans">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Resource</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Score</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tier</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason Preview</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {events.map((event) => (
            <tr 
              key={event.event_id} 
              onClick={() => onRowClick(event)}
              className="hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="font-semibold text-primary">{event.user?.name}</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{event.user?.role} • {event.user?.department}</div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-700 text-sm">
                {event.resource_accessed}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-lg font-bold text-primary">{Math.round(event.risk_score)}</span>
              </td>
              <td className="px-6 py-4">
                <RiskBadge tier={event.risk_tier} />
              </td>
              <td className="px-6 py-4 text-xs text-gray-500 italic max-w-[200px] truncate" title={event.top_reasons?.[0]}>
                {event.top_reasons?.[0] || 'No anomalies detected'}
              </td>
              <td className="px-6 py-4 text-right">
                <ExternalLink size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
