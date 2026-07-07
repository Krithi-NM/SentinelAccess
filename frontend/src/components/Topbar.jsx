import React from 'react';
import { RefreshCw, Shield } from 'lucide-react';

const Topbar = ({ onRescore, isRescoring }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-100 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Internal Security Operations</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          <Shield size={14} className="text-accent" />
          <span className="text-[10px] font-bold text-primary">🔒 Quantum-Safe Audit Log (SHA-3)</span>
        </div>
        
        <button 
          onClick={onRescore}
          disabled={isRescoring}
          className="btn-primary py-1.5 text-sm"
        >
          <RefreshCw size={16} className={isRescoring ? 'animate-spin' : ''} />
          {isRescoring ? 'Rescoring...' : 'Rescore System'}
        </button>
      </div>
    </div>
  );
};

export default Topbar;
