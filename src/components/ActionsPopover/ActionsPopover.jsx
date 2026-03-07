/**
 * ActionsPopover — positioned dropdown menu.
 * Renders children at the given { top, left } position.
 * Closes on backdrop click.
 */

export default function ActionsPopover({ isOpen, onClose, position, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[160px]"
        style={{ top: position?.top ?? 100, left: position?.left ?? 100 }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
