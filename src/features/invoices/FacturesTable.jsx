import { useState } from 'react';

const STATUS_MAP = {
  Approved: { label: 'Validée', cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  Rejected: { label: 'Rejetée', cls: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  Pending: { label: 'En attente', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

export default function FacturesTable({ bills, users = [], onRowClick, openActionsModal, formatDate, userRole }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...bills].sort((a, b) => {
    if (!sortKey) return 0;
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === 'date') { va = new Date(va || 0); vb = new Date(vb || 0); }
    if (sortKey === 'amount') { va = Number(va) || 0; vb = Number(vb) || 0; }
    if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb || '').toLowerCase(); }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }) => (
    <svg className={`w-3 h-3 inline ml-1 transition-transform ${sortKey === col ? 'text-gray-900' : 'text-gray-300'} ${sortKey === col && sortDir === 'desc' ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 2l4 5H2z" />
    </svg>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('title')}>
                  Titre <SortIcon col="title" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('date')}>
                  Date <SortIcon col="date" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                {userRole === 'admin' && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demandeur</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('amount')}>
                  Montant <SortIcon col="amount" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('status')}>
                  Statut <SortIcon col="status" />
                </th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((bill) => {
                const status = STATUS_MAP[bill.status] || STATUS_MAP.Pending;
                const demandeur = users.find(u => u._id === bill.createdBy || u._id === bill.user || u._id === bill.owner);
                return (
                  <tr key={bill._id} onClick={() => onRowClick(bill)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-gray-900">{bill.title}</span>
                      <span className="block text-xs text-gray-400 mt-0.5">#{bill._id?.slice(-8)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{formatDate(bill.date)}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{bill.type}</td>
                    {userRole === 'admin' && (
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {demandeur ? (
                          <span className="flex items-center gap-2">
                            <img src={demandeur.avatar || `https://ui-avatars.com/api/?name=${demandeur.firstName}+${demandeur.lastName}&background=e5e7eb&color=6b7280&size=28`} alt="" className="w-6 h-6 rounded-full object-cover" />
                            {demandeur.firstName} {demandeur.lastName}
                          </span>
                        ) : '—'}
                      </td>
                    )}
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{bill.amount.toFixed(2)} €</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        onClick={e => { e.stopPropagation(); openActionsModal(bill, e); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-3 animate-fade-in">
        {sorted.map((bill) => {
          const status = STATUS_MAP[bill.status] || STATUS_MAP.Pending;
          return (
            <div key={bill._id} onClick={() => onRowClick(bill)}
              className="bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{bill.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(bill.date)} · {bill.type}</p>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>{status.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900">{bill.amount.toFixed(2)} €</p>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                  onClick={e => { e.stopPropagation(); openActionsModal(bill, e); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
