import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import UserProfile from './pages/UserProfile';
import api from './api';

const App = () => {
  const [isRescoring, setIsRescoring] = useState(false);

  const handleRescore = async () => {
    setIsRescoring(true);
    try {
      await api.post('/rescore');
      // Briefly show loading for effect
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err) {
      console.error(err);
    } finally {
      setIsRescoring(false);
    }
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-secondary">
        <Sidebar />
        
        <div className="flex-1 ml-64">
          <Topbar onRescore={handleRescore} isRescoring={isRescoring} />
          
          <main className="mt-16 p-8 min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Dashboard isRescoring={isRescoring} />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/users/:userId" element={<UserProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
