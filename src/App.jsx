import React, { useEffect } from 'react';

window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
});
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocalDB } from './config/localStorage';
import BottomNav from './components/BottomNav';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Reports from './pages/Reports';
import Vault from './pages/Vault';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Analyzer from './pages/Analyzer';
import Guide from './pages/Guide';

function PrivateRoute({ children, hideNav }) {
  const { currentUser } = useAuth();
  const profile = LocalDB.getProfile();
  
  if (!currentUser) return <Navigate to="/login" />;
  
  const isMissingInfo = profile && (!profile.age || !profile.persona);
  
  if (isMissingInfo && !hideNav) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <>
      {children}
      {!hideNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<PrivateRoute hideNav={true}><Onboarding /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/timeline" element={<PrivateRoute><Timeline /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/vault" element={<PrivateRoute><Vault /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/analyzer" element={<PrivateRoute><Analyzer /></PrivateRoute>} />
          <Route path="/guide" element={<PrivateRoute><Guide /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
