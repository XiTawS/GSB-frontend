import React, { useState, useEffect } from 'react';
import { updateUser } from '../../../../services/userService';
import Modal from '../../../../components/Modal/Modal';
import './EditUserModal.css';

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setRole(user.role || 'user');
    }
    setError('');
    setSuccess(false);
    setIsLoading(false);
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      const data = await updateUser(user.email, { firstName, lastName, newEmail: email, role });
      if (!data || data.error) {
        setError(data.message || "Erreur lors de la modification de l'utilisateur.");
      } else {
        setSuccess(true);
        if (onSave) onSave({ firstName, lastName, email, role });
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1000);
      }
    } catch (err) {
      setError("Erreur lors de la modification de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="edituser-modal-content">
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{
        minWidth: 340,
        maxWidth: 400,
        padding: '2rem 1.5rem 1.5rem 1.5rem',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.13)',
        background: '#fff',
        margin: '1rem',
      }}>
        <h3 style={{ marginBottom: 24, fontWeight: 600, fontSize: 20, color: '#222' }}>Modifier l'utilisateur</h3>
        {error && <div style={{ color: '#b91c1c', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 500 }}>Utilisateur modifié !</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ color: '#444', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>
            Prénom
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required style={{
              width: '100%',
              marginTop: 6,
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
          </label>
          <label style={{ color: '#444', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>
            Nom
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required style={{
              width: '100%',
              marginTop: 6,
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
          </label>
          <label style={{ color: '#444', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>
              Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{
              width: '100%',
              marginTop: 6,
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
          </label>
          <label style={{ color: '#444', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>
            Rôle
            <select value={role} onChange={e => setRole(e.target.value)} style={{
              width: '100%',
              marginTop: 6,
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
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </label>
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
            >{isLoading ? 'Enregistrement...' : 'Enregistrer'}</button>
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