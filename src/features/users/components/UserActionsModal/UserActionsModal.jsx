import React, { useRef, useLayoutEffect, useState } from 'react';
import ActionsPopover from '../../../../components/ActionsPopover/ActionsPopover';
import './UserActionsModal.css';

export default function UserActionsModal({ isOpen, onClose, onEdit, onDelete, onResetPassword, user, position }) {
  const popoverRef = useRef(null);
  const [popoverHeight, setPopoverHeight] = useState(80);

  useLayoutEffect(() => {
    if (popoverRef.current) {
      setPopoverHeight(popoverRef.current.offsetHeight);
    }
  }, [isOpen]);

  if (!isOpen || !position) return null;
  const POPOVER_WIDTH = 180;
  const left = position.left - POPOVER_WIDTH - 75;
  const top = position.top + (position.height / 2) - (popoverHeight / 4.5);
  return (
    <ActionsPopover isOpen={isOpen} onClose={onClose} position={{ top, left }} className="useractions-popover-content">
      <div className="useractions-popover-inner" ref={popoverRef}>
        <button className="useractions-btn" onClick={onEdit}>Modifier</button>
        <button className="useractions-btn useractions-btn-danger" onClick={onDelete}>Supprimer</button>
        <button className="useractions-btn" onClick={onResetPassword}>Réinitialiser le mot de passe</button>
      </div>
    </ActionsPopover>
  );
}