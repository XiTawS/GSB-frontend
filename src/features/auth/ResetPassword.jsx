import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) return setError('Les mots de passe ne correspondent pas');
    if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères');

    try {
      setIsLoading(true);
      const response = await apiFetch(`/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la réinitialisation');
      setSuccess('Mot de passe mis à jour avec succès !');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🔑</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Nouveau mot de passe</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
              <input id="password" type="password" required minLength="8" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
              <input id="confirmPassword" type="password" required minLength="8" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputCls} />
            </div>

            {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
            {success && <div className="px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">{success}</div>}

            <button type="submit" disabled={isLoading}
              className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Traitement...' : 'Réinitialiser'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
