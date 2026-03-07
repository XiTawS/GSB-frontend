import { useState } from 'react';
import Modal from '../../../../components/Modal/Modal';

function generatePassword(length = 14) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=.,';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

export default function ResetPasswordModal({ isOpen, onClose, onReset, user }) {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onReset(password);
    } catch { setError('Erreur lors de la réinitialisation.'); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Réinitialiser le mot de passe</h2>
      {error && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
          <div className="flex gap-2">
            <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className={`flex-1 ${inputCls}`} />
            <button type="button" onClick={() => setShowPwd(v => !v)} className="px-2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="button" onClick={() => { setPassword(generatePassword()); setShowPwd(true); }}
          className="w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
          Générer un mot de passe sécurisé
        </button>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isLoading}
            className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
            {isLoading ? 'Enregistrement...' : 'Valider'}
          </button>
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
