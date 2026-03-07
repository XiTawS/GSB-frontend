import { useEffect, useRef } from 'react';

const STATUS_MAP = {
  Approved: { label: 'Validée', cls: 'bg-emerald-50 text-emerald-700' },
  Rejected: { label: 'Rejetée', cls: 'bg-red-50 text-red-700' },
  Pending: { label: 'En attente', cls: 'bg-amber-50 text-amber-700' },
};

export default function BillModal({ bill, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    const handleClickOutside = (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !bill) return null;

  const status = STATUS_MAP[bill.status] || STATUS_MAP.Pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Détail de la facture</h3>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
              {status.label}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xl font-semibold text-gray-900 text-center mb-6">{bill.title}</h4>

          {/* Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">ID</p>
                <p className="text-sm text-gray-900 font-mono">#{bill._id?.slice(-8)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-sm text-gray-900">{new Date(bill.date).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm text-gray-900">{bill.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Montant</p>
              <p className="text-2xl font-semibold text-gray-900">{bill.amount.toFixed(2)} €</p>
            </div>
            {bill.description && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{bill.description}</p>
              </div>
            )}
            {bill.proof && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Justificatif</p>
                {typeof bill.proof === 'string' && bill.proof.endsWith('.pdf') ? (
                  <a
                    href={bill.proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    📄 Ouvrir le PDF
                  </a>
                ) : (
                  <img
                    src={typeof bill.proof === 'object' ? URL.createObjectURL(bill.proof) : bill.proof}
                    alt="Justificatif"
                    className="w-full rounded-xl border border-gray-200"
                  />
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
