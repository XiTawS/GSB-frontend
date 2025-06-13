import { useState, useEffect, useRef } from 'react';
import { createInvoice } from '../../../../services/invoiceService';
import Modal from '../../../../components/Modal/Modal';
import './AddBillModal.css';

export default function AddBillModal({ isOpen, onClose, onSave }) {
  const [data, setData] = useState({
    title: '',
    date: '',
    type: '',
    amount: '',
    status: 'Pending',
    description: '',
    proof: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const firstInputRef = useRef(null);

  // Reset form data and preview when the modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setData({
        title: '',
        date: '',
        type: '',
        amount: '',
        status: 'Pending',
        description: '',
        proof: null
      });
      setIsSubmitting(false);
      setPreviewUrl(null);
      setError('');
    } else {
      // Focus sur le premier champ à l'ouverture
      setTimeout(() => {
        if (firstInputRef.current) firstInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Met à jour l'aperçu dès qu'un fichier est sélectionné
  useEffect(() => {
    if (data.proof) {
      const file = data.proof;
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else if (file.type === 'application/pdf') {
        setPreviewUrl(null); // Pas d'aperçu image, mais on peut afficher un lien
      }
    } else {
      setPreviewUrl(null);
    }
  }, [data.proof]);

  useEffect(() => {
    // Handle escape key press
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Handle click outside modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      setData({
        ...data,
        proof: e.target.files[0] || null
      });
    } else {
      setData({
        ...data,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setIsSubmitting(true);

    // Vérification des champs obligatoires côté JS
    if (!data.date || !data.type || !data.amount || !data.description) {
      setError('Merci de remplir tous les champs obligatoires.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Conversion de la date au format ISO si besoin
      let dateToSend = data.date;
      if (data.date && !data.date.endsWith('Z')) {
        dateToSend = new Date(data.date).toISOString();
      }
      const billData = await createInvoice({ ...data, date: dateToSend });
      onSave(billData);
      onClose();
    } catch (error) {
      setError("Erreur lors de l'enregistrement de la facture. Veuillez réessayer.");
      console.error('Error saving bill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setData({
        ...data,
        proof: e.dataTransfer.files[0]
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="addbill-modal-content">
      <h2 className="addbill-title">Ajouter une facture</h2>
      <p className="addbill-subtitle">Remplissez le formulaire pour créer une nouvelle facture.</p>
      {error && <div className="addbill-error">{error}</div>}
      <form className="addbill-form" onSubmit={handleSubmit}>
        <div className="addbill-field">
          <label htmlFor="title">Titre</label>
                    <input
            id="title"
            name="title"
                      type="text"
            required
                      value={data.title}
                      onChange={handleChange}
            autoComplete="off"
            maxLength={80}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    />
                  </div>
        <div className="addbill-form-row">
          <div className="addbill-field">
            <label htmlFor="date">Date et heure</label>
                    <input
              id="date"
              name="date"
                      type="datetime-local"
              required
                      value={data.date}
                      onChange={handleChange}
                    />
                  </div>
          <div className="addbill-field">
            <label htmlFor="amount">Montant (€)</label>
                    <input
              id="amount"
              name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
              required
                      value={data.amount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
        <div className="addbill-field">
          <label htmlFor="type">Type</label>
                  <input
            id="type"
            name="type"
                    type="text"
            required
                    value={data.type}
                    onChange={handleChange}
                  />
                </div>
        <div className="addbill-field">
          <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
            required
                    value={data.description}
                    onChange={handleChange}
            rows={3}
            maxLength={400}
            style={{ maxHeight: 120, resize: 'vertical' }}
                  />
                </div>
        <div className="addbill-field">
          <label htmlFor="proof">Justificatif (image ou PDF)</label>
                          <input
            id="proof"
            name="proof"
                            type="file"
            accept="image/*,application/pdf"
                            onChange={handleChange}
          />
          {data.proof && data.proof.type && (
            <div className="addbill-preview-wrapper">
              {data.proof.type.startsWith('image/') && previewUrl && (
                <img src={previewUrl} alt="Aperçu justificatif" className="addbill-preview-img" style={{ maxWidth: '100%', maxHeight: 320, margin: '1rem auto', display: 'block', borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)' }} />
              )}
              {data.proof.type === 'application/pdf' && (
                <iframe src={previewUrl || URL.createObjectURL(data.proof)} title="Aperçu PDF" className="addbill-preview-pdf" style={{ width: '100%', height: 400, border: 'none', borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)', margin: '1rem 0' }} />
                          )}
                        </div>
                      )}
                    </div>
        <button type="submit" className="addbill-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Ajouter la facture'}
              </button>
          </form>
    </Modal>
  );
} 