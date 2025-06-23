import { useState } from 'react';
import { apiFetch } from '../../services/api';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modale de réinitialisation
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await apiFetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      localStorage.setItem('token', data.token);
      onLogin();
    } catch (err) {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setResetMessage('');
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetMessage('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiFetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResetMessage(data.message || 'Un email de réinitialisation a été envoyé');
        // Affiche le lien dans la console pour le développement
        console.log('Lien de réinitialisation (pour test) :', 
          `http://localhost:3000/reset-password/[token]`);
      } else {
        setResetMessage(data.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      setResetMessage('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowModal(false);
        setResetMessage('');
      }, 3000);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">GSB - Gestion des notes de frais</h2>
          <p className="login-subtitle">Connectez-vous à votre compte</p>
          <div className="login-info">
            ⚠️ Note : La première connexion peut prendre 2-3 minutes car le backend est hébergé sur Render et nécessite un temps de démarrage.
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="login-options">
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => setShowModal(true)}
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`login-btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Réinitialiser le mot de passe</h3>
            <p>Entrez votre email pour recevoir le lien de réinitialisation</p>
            
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="votre@email.com"
              className="modal-input"
              disabled={isLoading}
            />
            
            <div className="modal-buttons">
              <button 
                onClick={handlePasswordReset} 
                className="modal-btn primary"
                disabled={isLoading || !resetEmail.includes('@')}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer'}
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setResetMessage('');
                }} 
                className="modal-btn"
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>
            
            {resetMessage && (
              <div className={`modal-message ${
                resetMessage.includes('Erreur') ? 'error' : 'success'
              }`}>
                {resetMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}