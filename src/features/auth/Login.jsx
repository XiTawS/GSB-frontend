import { useState } from 'react';
import { apiFetch } from '../../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

    </div>
  );
}
