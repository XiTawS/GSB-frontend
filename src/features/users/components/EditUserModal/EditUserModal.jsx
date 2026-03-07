import { useState, useEffect } from 'react';
import Modal from '../../../../components/Modal/Modal';

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) { setFirstName(user.firstName || ''); setLastName(user.lastName || ''); setEmail(user.email || ''); setRole(user.role || 'user'); }
    setError('');
    setIsLoading(false);
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSave({ firstName, lastName, email, role });
    } catch { setError("Erreur lors de la modification."); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Modifier l'utilisateur</h2>
      {error && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Rôle</label>
          <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isLoading}
            className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
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
