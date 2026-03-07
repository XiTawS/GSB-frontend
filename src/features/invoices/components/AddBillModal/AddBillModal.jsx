import { useState, useEffect, useRef } from 'react';
import { createInvoice } from '../../../../services/invoiceService';
import Modal from '../../../../components/Modal/Modal';

export default function AddBillModal({ isOpen, onClose, onSave }) {
  const [data, setData] = useState({ title: '', date: '', type: '', amount: '', status: 'Pending', description: '', proof: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setData({ title: '', date: '', type: '', amount: '', status: 'Pending', description: '', proof: null });
      setIsSubmitting(false);
      setPreviewUrl(null);
      setError('');
    } else {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (data.proof?.type?.startsWith('image/')) {
      const url = URL.createObjectURL(data.proof);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [data.proof]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setData(d => ({ ...d, [name]: type === 'file' ? (e.target.files[0] || null) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!data.date || !data.type || !data.amount || !data.description) {
      setError('Merci de remplir tous les champs obligatoires.');
      setIsSubmitting(false);
      return;
    }

    try {
      let dateToSend = data.date;
      if (data.date && !data.date.endsWith('Z')) dateToSend = new Date(data.date).toISOString();
      const billData = await createInvoice({ ...data, date: dateToSend });
      onSave(billData);
      onClose();
    } catch {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Ajouter une facture</h2>
      <p className="text-sm text-gray-500 mb-5">Remplissez le formulaire pour créer une nouvelle facture.</p>

      {error && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre</label>
          <input ref={firstInputRef} name="title" type="text" required value={data.title} onChange={handleChange} maxLength={80}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input name="date" type="datetime-local" required value={data.date} onChange={handleChange}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant (€)</label>
            <input name="amount" type="number" min="0.01" step="0.01" required value={data.amount} onChange={handleChange}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <input name="type" type="text" required value={data.type} onChange={handleChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea name="description" required value={data.description} onChange={handleChange} rows={3} maxLength={400}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Justificatif</label>
          <input name="proof" type="file" accept="image/*,application/pdf" onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
          {previewUrl && <img src={previewUrl} alt="Aperçu" className="mt-3 rounded-xl border border-gray-200 max-h-48 mx-auto" />}
          {data.proof?.type === 'application/pdf' && <p className="mt-2 text-sm text-gray-500 text-center">📄 PDF sélectionné</p>}
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? 'Enregistrement...' : 'Ajouter la facture'}
        </button>
      </form>
    </Modal>
  );
}
