/**
 * Modal — reusable centered overlay dialog.
 * Closes on backdrop click or close button.
 * Animated entry via CSS keyframe (modalIn).
 */

export default function Modal({ isOpen, onClose, children, className = '' }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          onClick={onClose}
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
