import { useState } from 'react';
import { createUser } from '../../../../services/userService';
import Modal from '../../../../components/Modal/Modal';
import './AddUserModal.css';

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  function generatePassword(length = 14) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=.,';
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }

  const handleGeneratePassword = () => {
    setPassword(generatePassword(14));
    setShowPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      const data = await createUser({ firstName, lastName, email, password, role, avatar });
      if (!data || data.error) {
        setError(data.message || "Erreur lors de l'ajout. Veuillez réessayer.");
        console.error('Erreur API:', data);
      } else {
        setSuccess(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setRole('user');
        setAvatar('');
        setShowPassword(false);
        if (onUserAdded) onUserAdded();
      }
    } catch (err) {
      setError("Erreur réseau ou serveur. Veuillez réessayer.");
      console.error('Erreur réseau:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setError('');
    setSuccess(false);
    setShowPassword(false);
    setAvatar('');
  };

  const handleClose = () => {
    resetForm();
    if (onClose) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="adduser-modal-content">
          <h2 className="adduser-title">Ajouter un utilisateur</h2>
          <p className="adduser-subtitle">Remplissez le formulaire pour créer un nouvel utilisateur.</p>
          {error && <div className="adduser-error">{error}</div>}
          {success && <div className="adduser-success">Utilisateur ajouté avec succès !</div>}
          <form className="adduser-form" onSubmit={handleSubmit}>
            <div className="adduser-form-row">
            <div className="adduser-field">
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="adduser-field">
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                autoComplete="username"
              />
            </div>
            </div>
            <div className="adduser-field">
                <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                style={{ textTransform: 'lowercase' }}
              />
            </div>
            <div className="adduser-field">
              <label htmlFor="password">Mot de passe</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="adduser-generate-btn"
                  onClick={handleGeneratePassword}
                  title="Générer un mot de passe fort"
                  tabIndex={-1}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2v2M10 16v2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M2 10h2M16 10h2M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Générer
                </button>
                <button
                  type="button"
                  className="adduser-show-btn"
                  onClick={() => setShowPassword(v => !v)}
                  title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  tabIndex={-1}
                  style={{ background: 'none', border: 'none', padding: 0, marginLeft: 2, color: '#2563eb', cursor: 'pointer' }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-5.97"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="adduser-field">
              <label htmlFor="role">Rôle</label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <button type="submit" className="adduser-btn" disabled={isLoading}>
              {isLoading ? 'Ajout en cours...' : "Ajouter l'utilisateur"}
            </button>
          </form>
    </Modal>
  );
} 