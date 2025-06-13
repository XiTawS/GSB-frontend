import React, { useState } from 'react';
import { updateUser } from '../../../../services/userService';
import Modal from '../../../../components/Modal/Modal';
import './ResetPasswordModal.css';

export default function ResetPasswordModal({ isOpen, onClose, onReset, user }) {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function generatePassword(length = 14) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=.,';
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      if (!user) throw new Error('Utilisateur non défini');
      const data = await updateUser(user.email, {
        name: user.name,
        newEmail: user.email,
        password,
        role: user.role
      });
      if (!data || data.error) {
        setError(data.message || 'Erreur lors de la réinitialisation du mot de passe.');
      } else {
        setSuccess(true);
        if (onReset) onReset(password);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError('Erreur lors de la réinitialisation du mot de passe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="resetpassword-modal-content">
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{
        minWidth: 340,
        maxWidth: 400,
        padding: '2rem 1.5rem 1.5rem 1.5rem',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.13)',
        background: '#fff',
        margin: '1rem',
      }}>
        <h3 style={{ marginBottom: 24, fontWeight: 600, fontSize: 20, color: '#222' }}>Réinitialiser le mot de passe</h3>
        {error && <div style={{ color: '#b91c1c', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 500 }}>Mot de passe réinitialisé !</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ color: '#444', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>
            Nouveau mot de passe
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '0.6rem 0.9rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 15,
                  background: '#f9fafb',
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                onBlur={e => e.target.style.border = '1px solid #e5e7eb'}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </label>
          <button type="button" onClick={() => generatePassword(14)} style={{
            background: '#f3f4f6',
            color: '#2563eb',
            border: 'none',
            borderRadius: 8,
            padding: '0.6rem 0',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: 8,
          }}>Générer un mot de passe sécurisé</button>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button type="submit" style={{
              flex: 1,
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 0',
              fontSize: 16,
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.18s',
            }}
            disabled={isLoading}
            onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
            >{isLoading ? 'Enregistrement...' : 'Valider'}</button>
            <button type="button" style={{
              flex: 1,
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 0',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
            onClick={onClose}
            onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
            onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >Annuler</button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 