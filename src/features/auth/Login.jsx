import { useState } from 'react';
import { apiFetch } from '../../services/api';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await apiFetch('https://gsb-backend-946k.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response || !response.ok) {
        if (response && (response.status === 401 || response.status === 400)) {
          setError('Identifiant ou mot de passe incorrect.');
        } else {
          setError('Erreur lors de la connexion. Veuillez réessayer.');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Appeler la fonction onLogin pour mettre à jour l'état d'authentification
      onLogin();
    } catch (err) {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">GSB - Gestion des notes de frais</h2>
          <p className="login-subtitle">Connectez-vous à votre compte</p>
          <div className="login-info">
            ⚠️ Note : La première connexion peut prendre 2-3 minutes car le backend est hébergé sur Render et nécessite un temps de démarrage. Les connexions suivantes seront plus rapides.
          </div>
          {error && <div className="login-error">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email" className="login-label">Adresse e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="login-input"
              />
            </div>
            <div className="login-field">
              <label htmlFor="password" className="login-label">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="login-input"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 