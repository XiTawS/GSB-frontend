import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Invoices from './features/invoices/Invoices';
import UserList from './features/users/UserList';
import Setting from './features/setting/Setting';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérification du token auprès du serveur
      fetch('https://gsb-backend-946k.onrender.com/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.status === 401) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    // In a real app, this would verify credentials
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Supprimer le token lors de la déconnexion
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/invoices" 
          element={
            isAuthenticated ? 
              <Invoices onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/users" 
          element={
            isAuthenticated ? 
              <UserList onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/setting" 
          element={
            isAuthenticated ? 
              <Setting onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
