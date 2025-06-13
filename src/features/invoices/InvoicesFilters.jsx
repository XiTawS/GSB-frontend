import React from 'react';

export default function InvoicesFilters({ searchQuery, setSearchQuery, filterStatus, setFilterStatus, openAddBillModal }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 w-full mt-2 mb-6 mx-2 sm:mx-4">
      <div className="flex items-center w-full max-w-xs bg-gray-100 rounded-lg px-3 py-2 shadow-sm mb-2 sm:mb-0">
        <span className="text-gray-400 mr-2 flex items-center">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </span>
        <input
          type="text"
          className="flex-1 bg-transparent outline-none border-none text-base text-gray-800 placeholder-gray-400"
          placeholder="Rechercher une facture..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto flex justify-center">
        <select
          className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full sm:w-auto"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="All">Tous</option>
          <option value="Approved">Validées</option>
          <option value="Rejected">Rejetées</option>
          <option value="Pending">En attente</option>
        </select>
      </div>
      <div className="w-full sm:w-auto flex justify-end">
        <button
          type="button"
          onClick={openAddBillModal}
          className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition w-auto sm:mr-8"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Ajouter une facture
        </button>
      </div>
    </div>
  );
} 