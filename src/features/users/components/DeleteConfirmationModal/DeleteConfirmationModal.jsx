import Modal from '../../../../components/Modal/Modal';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
        <p className="text-sm text-gray-500 mb-6">
          Êtes-vous sûr de vouloir supprimer <span className="font-medium text-gray-900">{userName}</span> ? Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors">
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}
