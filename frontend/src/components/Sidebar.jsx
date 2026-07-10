import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bell, ShieldCheck, Database, Users, Activity, Settings, UserCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-80 bg-primary h-screen fixed left-0 top-0 text-white flex flex-col z-20 shadow-[20px_0_60px_rgba(0,0,0,0.15)]">
      <div className="p-10">
        <h1 className="text-3xl font-display text-white flex items-center gap-4">
          <div className="p-2.5 bg-accent/20 rounded-2xl shadow-lg shadow-accent/20">
            <ShieldCheck size={32} className="text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight leading-none">Sentinel<span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-4">Access</span></span>
            <span className="text-white/30 text-[9px] mt-2 font-black tracking-[0.4em] uppercase">Intelligence Node</span>
          </div>
        </h1>
      </div>

      <nav className="flex-1 mt-8 px-4 space-y-2">
        <NavLink to="/" className="nav-link rounded-2xl">
          <LayoutDashboard size={22} /> 
          <span className="tracking-tight text-sm">Command Center</span>
        </NavLink>
        <NavLink to="/alerts" className="nav-link rounded-2xl">
          <Bell size={22} /> 
          <span className="tracking-tight text-sm">Incident Queue</span>
        </NavLink>
        <NavLink to="/analytics" className="nav-link rounded-2xl">
          <Activity size={22} /> 
          <span className="tracking-tight text-sm">Risk Analytics</span>
        </NavLink>
      </nav>

      <div className="p-10 mt-auto">
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:bg-white/[0.08] transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
             <ShieldCheck size={80} />
          </div>
          <div className="flex items-center gap-3 text-accent font-black text-sm mb-3 uppercase tracking-[0.2em]">
            <ShieldCheck size={14} /> 256-Bit Integrity
          </div>
          <p className="text-sm text-white/50 leading-relaxed font-bold">
            SHA-3 immutable audit trail active for all sessions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
