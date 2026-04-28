import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Appointments from './pages/Appointments';
import Expiry from './pages/Expiry';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      window.location.href = '/login';
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/expiry" element={<Expiry />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
