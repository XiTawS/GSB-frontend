import React, { useState, useEffect, useRef } from 'react';
import { updateInvoice } from '../../../../services/invoiceService';
import Modal from '../../../../components/Modal/Modal';
import './ChangeStatusModal.css';

export default function ChangeStatusModal({ isOpen, onClose, status, onSave, billId }) {
  const [newStatus, setNewStatus] = useState('Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const selectRef = useRef(null);

  useEffect(() => {
    if (status) setNewStatus(status);
    setError('');
    setIsSubmitting(false);
    if (isOpen) {
      setTimeout(() => {
        if (selectRef.current) selectRef.current.focus();
      }, 100);
    }
  }, [status, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await updateInvoice(billId, { status: newStatus });
      onSave(newStatus);
      onClose();
    } catch (e) {
      setError("Erreur lors du changement de statut. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="changestatus-modal-content">
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{
        minWidth: 340,
        maxWidth: 400,
        padding: '2rem 1.5rem 1.5rem 1.5rem',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.13)',
        background: '#fff',
        margin: '1rem',
      }}>
        <h3 style={{ marginBottom: 24, fontWeight: 600, fontSize: 20, color: '#222' }}>Changer le statut</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && <div className="modal-error-message">{error}</div>}
          <label>
            Statut
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} ref={selectRef}>
              <option value="Pending">En attente</option>
              <option value="Approved">Validée</option>
              <option value="Rejected">Rejetée</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button type="submit" style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontSize: 16, fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.18s' }} disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontSize: 16, fontWeight: 500, cursor: 'pointer', transition: 'background 0.18s' }} onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 