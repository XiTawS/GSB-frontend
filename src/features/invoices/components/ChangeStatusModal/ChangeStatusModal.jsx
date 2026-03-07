import { useState, useEffect, useRef } from 'react';
import { updateInvoice } from '../../../../services/invoiceService';
import Modal from '../../../../components/Modal/Modal';

export default function ChangeStatusModal({ isOpen, onClose, status, onSave, billId }) {
  const [newStatus, setNewStatus] = useState('Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const selectRef = useRef(null);

  useEffect(() => {
    if (status) setNewStatus(status);
    setError('');
    setIsSubmitting(false);
    if (isOpen) setTimeout(() => selectRef.current?.focus(), 100);
  }, [status, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await updateInvoice(billId, { status: newStatus });
      onSave(newStatus);
      onClose();
    } catch {
      setError('Erreur lors du changement de statut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Changer le statut</h2>
      {error && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
          <select ref={selectRef} value={newStatus} onChange={e => setNewStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors">
            <option value="Pending">En attente</option>
            <option value="Approved">Validée</option>
            <option value="Rejected">Rejetée</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
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
