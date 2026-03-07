import { exportToCSV } from '../../utils/exportCSV';

export default function InvoicesFilters({ searchQuery, setSearchQuery, filterStatus, setFilterStatus, openAddBillModal, filteredBills = [] }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <select
        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
      >
        <option value="All">Tous les statuts</option>
        <option value="Approved">Validées</option>
        <option value="Rejected">Rejetées</option>
        <option value="Pending">En attente</option>
      </select>

      <div className="flex gap-2 sm:ml-auto">
        {/* CSV export */}
        {filteredBills.length > 0 && (
          <button
            onClick={() => exportToCSV(filteredBills)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
            title="Exporter en CSV"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="hidden sm:inline">CSV</span>
          </button>
        )}

        {/* Add button */}
        <button
          onClick={openAddBillModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Ajouter une facture
        </button>
      </div>
    </div>
  );
}
