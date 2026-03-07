import ActionsPopover from '../../../../components/ActionsPopover/ActionsPopover';

export default function BillActionsModal({ isOpen, onClose, onEdit, onDelete, onChangeStatus, bill, position }) {
  const userRole = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role : '';

  if (!isOpen || !position) return null;

  return (
    <ActionsPopover isOpen={isOpen} onClose={onClose} position={position}>
      <div className="py-1 min-w-[140px]">
        {userRole === 'admin' && (
          <>
            <button onClick={onEdit} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Modifier
            </button>
            <button onClick={onChangeStatus} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Changer le statut
            </button>
          </>
        )}
        <button
          onClick={() => { if (window.confirm('Voulez-vous vraiment supprimer cette facture ?')) onDelete(); }}
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Supprimer
        </button>
      </div>
    </ActionsPopover>
  );
}
