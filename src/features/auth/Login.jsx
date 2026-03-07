import { useState } from 'react';
import { apiFetch } from '../../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiFetch('/auth/login', {
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
      onLogin(data.token);
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
      const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetMessage(data.message || 'Un email de réinitialisation a été envoyé');
      } else {
        setResetMessage(data.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      setResetMessage('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowModal(false);
        setResetMessage('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">📝</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">GSB</h1>
            <p className="text-sm text-gray-500 mt-1">Gestion des notes de frais</p>
            <p className="text-xs text-gray-400 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⏳ La première connexion peut prendre 1 à 2 minutes (démarrage du serveur).
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors disabled:opacity-50"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setShowModal(true)}
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>

      {/* Reset password modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => { setShowModal(false); setResetMessage(''); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Réinitialiser le mot de passe</h3>
            <p className="text-sm text-gray-500 mb-4">Entrez votre email pour recevoir le lien de réinitialisation.</p>

            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="vous@exemple.com"
              disabled={isLoading}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={handlePasswordReset}
                disabled={isLoading || !resetEmail.includes('@')}
                className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Envoi...' : 'Envoyer'}
              </button>
              <button
                onClick={() => { setShowModal(false); setResetMessage(''); }}
                disabled={isLoading}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </div>

            {resetMessage && (
              <div className={`mt-3 px-3 py-2 rounded-lg text-sm text-center ${
                resetMessage.includes('Erreur')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
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
