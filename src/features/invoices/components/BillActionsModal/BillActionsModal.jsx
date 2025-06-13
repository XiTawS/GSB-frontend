import React, { useRef, useLayoutEffect, useState } from 'react';
import ActionsPopover from '../../../../components/ActionsPopover/ActionsPopover';
import './BillActionsModal.css';

export default function BillActionsModal({ isOpen, onClose, onEdit, onDelete, onChangeStatus, bill, position }) {
  const popoverRef = useRef(null);
  const [popoverHeight, setPopoverHeight] = useState(80);
  const userRole = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role : '';

  useLayoutEffect(() => {
    if (popoverRef.current) {
      setPopoverHeight(popoverRef.current.offsetHeight);
    }
  }, [isOpen]);

  if (!isOpen || !position) return null;
  const POPOVER_WIDTH = 180;
  const buttonCenter = position.top + (position.height / 2);
  const top = position.top + (position.height / 2) - (popoverHeight / 4.5);
  const left = position.left - POPOVER_WIDTH - 2;
  const arrowTop = (popoverHeight / 2) - 6; // 6 = moitié de la hauteur de la flèche

  return (
    <ActionsPopover isOpen={isOpen} onClose={onClose} position={{ top, left }} className="billactions-popover-content">
      <div className="billactions-popover-inner" ref={popoverRef}>
        {userRole === 'admin' && (
          <>
            <button className="billactions-btn" onClick={onEdit}>Modifier</button>
            <button className="billactions-btn" onClick={onChangeStatus}>Changer le statut</button>
          </>
        )}
        <button
          className="billactions-btn billactions-btn-danger"
          onClick={() => {
            if (window.confirm('Voulez-vous vraiment supprimer cette facture ? Cette action est irréversible.')) {
              onDelete();
            }
          }}
        >
          Supprimer
        </button>
      </div>
    </ActionsPopover>
  );
}