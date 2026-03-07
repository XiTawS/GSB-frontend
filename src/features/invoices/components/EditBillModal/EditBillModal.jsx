import { useState, useEffect, useRef } from 'react';
import { updateInvoice } from '../../../../services/invoiceService';
import Modal from '../../../../components/Modal/Modal';

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
    if (isOpen) setTimeout(() => firstInputRef.current?.focus(), 100);
  }, [bill, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await updateInvoice(bill._id, { title, date, type, amount, description });
      onSave({ title, date, type, amount, description });
      onClose();
    } catch {
      setError('Erreur lors de la modification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Modifier la facture</h2>
      {error && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre</label>
          <input ref={firstInputRef} type="text" value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <input type="text" value={type} onChange={e => setType(e.target.value)} required
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant (€)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors resize-none" />
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
