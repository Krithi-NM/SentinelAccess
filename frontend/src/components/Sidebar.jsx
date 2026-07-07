import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bell, ShieldCheck, Database, Users } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-primary h-screen fixed left-0 top-0 text-white flex flex-col z-20">
      <div className="p-6">
        <h1 className="text-2xl font-serif text-accent flex items-center gap-2">
          <ShieldCheck size={28} /> SentinelAccess
        </h1>
        <p className="text-white/50 text-xs mt-1 font-sans tracking-widest uppercase">Security Platform</p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 font-sans">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell size={20} /> Admin Alerts
        </NavLink>
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-1">
            <ShieldCheck size={14} /> QUANTUM-SAFE
          </div>
          <p className="text-[10px] text-white/70 leading-relaxed">
            Audit logs protected by SHA-3 hash signatures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
