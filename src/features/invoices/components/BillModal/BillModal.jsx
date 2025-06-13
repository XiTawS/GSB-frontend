import { useEffect, useRef } from 'react';
import './BillModal.css';

export default function BillModal({ bill, isOpen, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

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
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (closeBtnRef.current) closeBtnRef.current.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed or no bill data
  if (!isOpen || !bill) return null;

  // Function to determine status badge color
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Approved':
        return 'bill-modal-status approved';
      case 'Rejected':
        return 'bill-modal-status rejected';
      case 'Pending':
      default:
        return 'bill-modal-status pending';
    }
  };

  return (
    <div className="bill-modal-overlay" aria-labelledby="modal-title" role="dialog" aria-modal="true" aria-label="Détail de la facture" tabIndex={-1}>
      <div className="bill-modal-wrapper">
        {/* Modal content */}
        <div 
          ref={modalRef}
          className="bill-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bill-modal-header">
            <h3 className="bill-modal-title">Détail de la facture</h3>
            <span className={getStatusClasses(bill.status)}>
              {bill.status}
            </span>
          </div>
          <div style={{ marginBottom: '1.2rem', marginTop: '-0.5rem' }}>
            <h4 className="bill-modal-title-main" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#23272f', textAlign: 'center', letterSpacing: '-0.5px' }}>{bill.title}</h4>
          </div>
          <div className="bill-modal-section">
            <div className="bill-modal-fields">
              <div className="bill-modal-row">
                <div>
                  <p className="bill-modal-label">ID</p>
                  <p className="bill-modal-value">#{bill._id}</p>
                </div>
                <div>
                  <p className="bill-modal-label">Date</p>
                  <p className="bill-modal-value">{new Date(bill.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="bill-modal-label">Type</p>
                <p className="bill-modal-value">{bill.type}</p>
              </div>
              <div>
                <p className="bill-modal-label">Montant</p>
                <p className="bill-modal-value bill-modal-amount">{bill.amount.toFixed(2)} €</p>
              </div>
              {bill.description && (
                <div>
                  <p className="bill-modal-label">Description</p>
                  <p className="bill-modal-value">{bill.description}</p>
                </div>
              )}
              {bill.proof && (
                <div>
                  <p className="bill-modal-label">Justificatif</p>
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    {(() => {
                      let isPDF = false;
                      let src = bill.proof;
                      if (typeof bill.proof === 'object' && bill.proof.type === 'application/pdf') {
                        isPDF = true;
                        src = URL.createObjectURL(bill.proof);
                      } else if (typeof bill.proof === 'string' && bill.proof.endsWith('.pdf')) {
                        isPDF = true;
                      }
                      if (isPDF) {
                        return (
                          <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'underline', fontSize: '1.1rem', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', background: '#f3f4f6', display: 'inline-block', marginTop: '1rem' }}>
                            Ouvrir le PDF dans un nouvel onglet
                          </a>
                        );
                      } else {
                        return <img
                          src={typeof bill.proof === 'object' ? URL.createObjectURL(bill.proof) : bill.proof}
                          alt="Justificatif"
                          style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0.5rem', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)' }}
                        />;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bill-modal-footer">
            <button
              type="button"
              className="bill-modal-close-btn"
              ref={closeBtnRef}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 