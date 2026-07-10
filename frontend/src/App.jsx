import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck, ShieldCheck, User, Shield, Lock } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import UserProfile from './pages/UserProfile';
import Analytics from './pages/Analytics';
import api from './api';

const BootSequence = ({ onComplete }) => {
  const [checks, setChecks] = useState([
    { label: 'AI Behaviour Engine Connected', done: false },
    { label: 'Threat Intelligence Synced', done: false },
    { label: 'Quantum Integrity Verified', done: false }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChecks(prev => {
        const nextToComplete = prev.findIndex(c => !c.done);
        if (nextToComplete === -1) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
        const next = [...prev];
        next[nextToComplete] = { ...next[nextToComplete], done: true };
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-primary flex flex-col items-center justify-center text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 w-[400px] p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center gap-6 mb-8 justify-center">
          <div className="p-6 bg-accent/20 rounded-[2rem] shadow-2xl shadow-accent/20">
             <ShieldCheck size={48} className="text-accent animate-pulse" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl !text-white !font-display !p-0 !m-0">Sentinel<span className="text-accent">Access</span></h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black mt-2">Enterprise Security Layer</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center justify-between group bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-all ${check.done ? 'text-white' : 'text-white/30'}`}>
                {check.label}
              </span>
              {check.done ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CircleCheck size={20} className="text-accent" />
                </motion.div>
              ) : (
                <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const App = () => {
  const [isRescoring, setIsRescoring] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const handleRescore = async () => {
    setIsRescoring(true);
    try {
      await api.post('/rescore');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err) {
      console.error(err);
    } finally {
      setIsRescoring(false);
    }
  };

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#091E24',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          },
        }}
      />
      <AnimatePresence mode="wait">
        {/* {isBooting && <BootSequence key="boot" onComplete={() => setIsBooting(false)} />} */}
      </AnimatePresence>

      <div className="flex min-h-screen bg-secondary selection:bg-accent/30">
        <Sidebar />
        
        <div className="flex-1 ml-80">
          <Topbar onRescore={handleRescore} isRescoring={isRescoring} />
          
          <main className="mt-20 p-12 min-h-[calc(100vh-80px)] max-page-width">
            <Routes>
              <Route path="/" element={<Dashboard isRescoring={isRescoring} />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/users/:userId" element={<UserProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
