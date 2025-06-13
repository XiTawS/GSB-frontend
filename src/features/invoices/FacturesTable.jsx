import React from 'react';

export default function FacturesTable({ bills, users = [], onRowClick, openActionsModal, getStatusClasses, formatDate, userRole }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre / ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                {userRole === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Demandeur</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-100">
                {bills.map((bill) => {
                  const demandeur = users.find(u =>
                    u._id === bill.createdBy ||
                    u._id === bill.user ||
                    u._id === bill.owner
                  );
                  return (
                  <tr key={bill.id} onClick={() => onRowClick(bill)} className="hover:bg-gray-50 cursor-pointer transition">
                    {/* Titre + ID (ID visible uniquement sur desktop) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex flex-col">
                      <span className="text-base font-semibold text-gray-900">{bill.title}</span>
                      <span className="text-xs text-gray-400 hidden sm:inline-block mt-1">#{bill._id}</span>
                      </td>
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(bill.date)}</td>
                    {/* Type desktop uniquement */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{bill.type}</td>
                    {/* Demandeur (admin, desktop uniquement) */}
                      {userRole === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {demandeur ? (
                          <span className="flex items-center gap-2">
                              <img
                                src={demandeur.avatar || '/default-avatar.png'}
                                alt={demandeur.firstName}
                              className="w-7 h-7 rounded-full object-cover mr-1"
                              />
                              {demandeur.firstName} {demandeur.lastName}
                            </span>
                          ) : (
                            bill.createdBy || bill.user || bill.owner || '—'
                          )}
                        </td>
                      )}
                    {/* Montant */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{bill.amount.toFixed(2)} €</td>
                    {/* Statut */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={
                        bill.status === 'Approved'
                          ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                          : bill.status === 'Rejected'
                          ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
                          : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
                      }>
                        {bill.status}
                      </span>
                      </td>
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                        className="text-gray-400 hover:text-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={e => {
                            e.stopPropagation();
                            openActionsModal(bill, e);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          <span className="sr-only">, facture #{bill.id}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
} 