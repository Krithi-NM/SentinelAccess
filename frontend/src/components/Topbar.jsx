import React from 'react';
import { RefreshCw, Shield, Globe, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Topbar = ({ onRescore, isRescoring }) => {
  const handleRescore = async () => {
    const promise = onRescore();
    toast.promise(promise, {
      loading: 'Calibrating AI Behavioral Model...',
      success: 'Risk Parameters Synchronized',
      error: 'Synchronization Failed',
    }, {
      style: {
        background: '#091E24',
        color: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        fontSize: '13px',
        fontWeight: '700',
      }
    });
    await promise;
  };

  return (
    <div className="h-20 bg-white border-b border-gray-100/60 fixed top-0 right-0 left-80 z-10 px-10 flex items-center justify-between backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50">
           <Globe size={14} className="text-gray-400" />
           <span className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Zone: MH-East-V2</span>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
          <Shield size={16} className="text-blue-600" />
          <span className="text-sm font-black text-blue-900 uppercase tracking-[0.15em]">SHA-3 Integrity Active</span>
        </div>
        
        <button 
          onClick={handleRescore}
          disabled={isRescoring}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all bg-primary text-white ${
            isRescoring ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/10'
          }`}
        >
          <RefreshCw size={14} className={isRescoring ? 'animate-spin' : ''} />
          {isRescoring ? 'Processing...' : 'Rescore System'}
        </button>

        <div className="h-8 w-px bg-gray-100" />

        <div className="flex items-center gap-3 group cursor-pointer">
           <div className="text-right">
              <div className="text-xs font-bold text-primary group-hover:text-accent transition-colors">Admin_Maharashtra</div>
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Master Security Ops</div>
           </div>
           <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
              <UserCircle size={24} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
