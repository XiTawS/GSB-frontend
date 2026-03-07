import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './features/auth/Login';
import ResetPassword from './features/auth/ResetPassword';
import Dashboard from './features/dashboard/Dashboard';
import Invoices from './features/invoices/Invoices';
import UserList from './features/users/UserList';
import Setting from './features/setting/Setting';

/**
 * Root component — handles auth state and routing.
 * Auth is verified client-side via JWT expiration check.
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Auth verification (client-side JWT check) ──
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp && payload.exp * 1000 < Date.now();
      setIsAuthenticated(!isExpired);
      if (isExpired) localStorage.removeItem('token');
    } catch {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Auth handlers ──
  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // ── Loading screen ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  // ── Helper: protect routes behind auth ──
  const protect = (element) =>
    isAuthenticated ? element : <Navigate to="/login" replace />;

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected */}
        <Route path="/dashboard" element={protect(<Dashboard onLogout={handleLogout} />)} />
        <Route path="/invoices" element={protect(<Invoices onLogout={handleLogout} />)} />
        <Route path="/users" element={protect(<UserList onLogout={handleLogout} />)} />
        <Route path="/setting" element={protect(<Setting onLogout={handleLogout} />)} />

        {/* Fallback */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
