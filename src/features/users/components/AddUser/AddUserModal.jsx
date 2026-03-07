import { useState } from 'react';
import { createUser } from '../../../../services/userService';
import Modal from '../../../../components/Modal/Modal';

function generatePassword(length = 14) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=.,';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      const data = await createUser({ firstName, lastName, email, password, role });
      if (!data || data.error) { setError(data?.message || "Erreur lors de l'ajout."); }
      else { setSuccess(true); resetForm(); if (onUserAdded) onUserAdded(); }
    } catch { setError("Erreur réseau. Veuillez réessayer."); }
    finally { setIsLoading(false); }
  };

  const resetForm = () => {
    setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setRole('user'); setShowPassword(false);
  };

  const handleClose = () => { resetForm(); setError(''); setSuccess(false); onClose(); };

  const inputCls = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors";

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Ajouter un utilisateur</h2>
      <p className="text-sm text-gray-500 mb-5">Remplissez le formulaire pour créer un nouvel utilisateur.</p>

      {error && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">Utilisateur ajouté avec succès !</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} style={{ textTransform: 'lowercase' }} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
          <div className="flex gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              required value={password} onChange={e => setPassword(e.target.value)}
              className={`flex-1 ${inputCls}`}
            />
            <button type="button" onClick={() => { setPassword(generatePassword()); setShowPassword(true); }}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
              Générer
            </button>
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="px-2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Rôle</label>
          <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Ajout en cours...' : "Ajouter l'utilisateur"}
        </button>
      </form>
    </Modal>
  );
}
