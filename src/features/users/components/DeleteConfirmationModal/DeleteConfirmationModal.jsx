import React from 'react';
import Modal from '../../../../components/Modal/Modal';
import './DeleteConfirmationModal.css';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="delete-confirmation-modal">
      <div className="delete-confirmation-content">
        <div className="delete-confirmation-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </div>
        <h3 className="delete-confirmation-title">Confirmer la suppression</h3>
        <p className="delete-confirmation-message">
          Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userName}</strong> ? Cette action est irréversible.
        </p>
        <div className="delete-confirmation-actions">
          <button
            type="button"
            className="delete-confirmation-cancel"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            className="delete-confirmation-confirm"
            onClick={onConfirm}
          >
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
} 