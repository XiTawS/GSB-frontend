import React from 'react';
import './ActionsPopover.css';

export default function ActionsPopover({ isOpen, onClose, position, children, className = '' }) {
  if (!isOpen) return null;
  return (
    <div
      className="popover-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 1000
      }}
    >
      <div
        className={`popover-content ${className}`}
        style={{
          position: 'absolute',
          top: position?.top ?? 100,
          left: position?.left ?? 100,
          minWidth: 180,
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
          padding: '1rem',
          zIndex: 1101
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
} 