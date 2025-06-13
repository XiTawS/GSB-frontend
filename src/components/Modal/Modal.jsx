import './Modal.css';

export default function Modal({ isOpen, onClose, children, className = '' }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${className}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        {children}
      </div>
    </div>
  );
} 