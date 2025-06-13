import React, { useState, useEffect, useRef } from 'react';
import { updateInvoice } from '../../../../services/invoiceService';
import Modal from '../../../../components/Modal/Modal';
import './EditBillModal.css';

export default function EditBillModal({ isOpen, onClose, bill, onSave }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (bill) {
      setTitle(bill.title || '');
      setDate(bill.date ? bill.date.slice(0, 10) : '');
      setType(bill.type || '');
      setAmount(bill.amount || '');
      setDescription(bill.description || '');
    }
    setError('');
    setIsSubmitting(false);
    if (isOpen) {
      setTimeout(() => {
        if (firstInputRef.current) firstInputRef.current.focus();
      }, 100);
    }
  }, [bill, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await updateInvoice(bill._id, { title, date, type, amount, description });
      onSave({ title, date, type, amount, description });
      onClose();
    } catch (e) {
      setError("Erreur lors de la modification de la facture. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="editbill-modal-content">
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{
        minWidth: 340,
        maxWidth: 400,
        padding: '2rem 1.5rem 1.5rem 1.5rem',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.13)',
        background: '#fff',
        margin: '1rem',
      }}>
        <h3 style={{ marginBottom: 24, fontWeight: 600, fontSize: 20, color: '#222' }}>Modifier la facture</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && <div className="modal-error-message">{error}</div>}
          <label>
            Titre
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required ref={firstInputRef} />
          </label>
          <label>
            Date
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </label>
          <label>
            Type
            <input type="text" value={type} onChange={e => setType(e.target.value)} required />
          </label>
          <label>
            Montant (€)
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" />
          </label>
          <label>
            Description
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
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