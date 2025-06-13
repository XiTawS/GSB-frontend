import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BillModal from '../invoices/components/BillModal/BillModal';
import AddBillModal from '../invoices/components/AddBillModal/AddBillModal';
import AddUserModal from '../users/components/AddUser/AddUserModal';
import { getAllInvoices } from '../../services/invoiceService';
import { getUserByEmail } from '../../services/userService';
import './Dashboard.css';

export default function Dashboard({ onLogout }) {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [billsToShow, setBillsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 5;
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email;
      const data = await getUserByEmail(email);
      setUser(data);
    };
    fetchUser();
  }, [token]);

  const fetchBills = useCallback(async () => {
    try {
      const data = await getAllInvoices(token);
      setBills(data);
    } catch (e) {
      console.error('Erreur lors de la récupération des factures:', e);
    }
  }, [token]);

  useEffect(() => {
    const updateBillsToShow = () => {
      const width = window.innerWidth;
      if (width < 500) setBillsToShow(2);
      else if (width < 800) setBillsToShow(3);
      else if (width < 1024) setBillsToShow(4);
      else if (width < 1400) setBillsToShow(5);
      else setBillsToShow(6);
    };
    updateBillsToShow();
    window.addEventListener('resize', updateBillsToShow);
    return () => window.removeEventListener('resize', updateBillsToShow);
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Pagination automatique : si la page courante est pleine et qu'une nouvelle facture est ajoutée, passer à la page suivante
  useEffect(() => {
    const totalPages = Math.ceil(filteredBills.length / billsPerPage);
    if (currentPage < totalPages && filteredBills.length > currentPage * billsPerPage) {
      setCurrentPage(currentPage + 1);
    }
    // Si on supprime des factures et qu'on est sur une page trop haute, revenir à la dernière page existante
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [bills, filterStatus, searchQuery]);

  const handleAddBill = (newBill) => {
    setBills([newBill, ...bills]);
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setIsDetailModalOpen(true);
  };

  // Function to determine status badge color
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-badge status-badge-approved';
      case 'Rejected':
        return 'status-badge status-badge-rejected';
      case 'Pending':
      default:
        return 'status-badge status-badge-pending';
    }
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Trier les factures du plus récent au plus ancien
  const sortedBills = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredBills = sortedBills.filter(bill => {
    // Filter by status
    if (filterStatus !== 'All' && bill.status !== filterStatus) {
      return false;
    }
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        bill.type.toLowerCase().includes(query) ||
        bill.description?.toLowerCase().includes(query) ||
        bill.amount.toString().includes(query)
      );
    }
    return true;
  });

  // Afficher uniquement les bills selon la taille d'écran
  const recentBills = filteredBills.slice(0, billsToShow);

  const handleRowClick = (bill) => {
    console.log('Opening bill details:', bill);
    setSelectedBill({ ...bill });
    setTimeout(() => {
      setIsDetailModalOpen(true);
    }, 0);
  };

  const openAddBillModal = () => {
    console.log('Opening add bill modal');
    setIsAddModalOpen(true);
  };

  const closeDetailModal = () => {
    console.log('Closing detail modal');
    setIsDetailModalOpen(false);
    setTimeout(() => {
      setSelectedBill(null);
    }, 300);
  };

  const closeAddModal = () => {
    console.log('Closing add modal');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="h-screen flex-shrink-0">
        <Sidebar onLogout={onLogout} onOpenAddUserModal={() => setIsAddUserModalOpen(true)} />
      </aside>
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
            {/* Header Section */}
          <div className="mb-6 ml-2 sm:ml-4 flex flex-col items-start sm:items-start justify-start sm:justify-start text-left sm:text-left md:text-left text-center sm:text-left">
            <div className="w-full flex flex-col items-center justify-center sm:items-start sm:justify-start">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1 w-full text-center sm:text-left">Bonjour, {user?.firstName}</h2>
              <p className="text-gray-500 text-base w-full text-center sm:text-left">Bienvenue sur votre application de notes de frais.</p>
            </div>
          </div>
          <hr className="border-gray-200 my-4" />

            {/* Stats Section */}
          <div className="mb-6">
            <dl className="flex flex-col gap-4 sm:flex-row sm:gap-8 text-center">
              <div className="flex-1">
                <dt className="text-base text-gray-500">Nombre de factures</dt>
                <dd className="text-4xl font-semibold text-gray-900">{bills.length}</dd>
                    </div>
              <div className="flex-1">
                <dt className="text-base text-gray-500">Montant total des factures</dt>
                <dd className="text-4xl font-semibold text-gray-900">{bills.reduce((acc, bill) => acc + bill.amount, 0).toFixed(2)} €</dd>
              </div>
              <div className="flex-1">
                <dt className="text-base text-gray-500">Nombres de factures en attente</dt>
                <dd className="text-4xl font-semibold text-gray-900">{bills.filter(bill => bill.status === 'Pending').length}</dd>
              </div>
            </dl>
          </div>

          {/* Filters + bouton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos dernières factures</h2>
                <button
                  type="button"
                  onClick={openAddBillModal}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                >
              <svg className="w-5 h-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Ajouter une facture
                </button>
            </div>
            
          {/* Bills Table ou Empty State */}
            {filteredBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune facture trouvée</h3>
              <p className="text-gray-500 mb-4">
                  {searchQuery || filterStatus !== 'All'
                    ? "Essayez d'ajuster votre recherche ou le filtre."
                    : 'Commencez par créer une nouvelle facture.'}
                </p>
                {!searchQuery && filterStatus === 'All' && (
                    <button
                      type="button"
                      onClick={openAddBillModal}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                    >
                  <svg className="w-5 h-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                      </svg>
                      Ajouter une facture
                    </button>
                )}
              </div>
            ) : (
            <div className="mt-6 overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre / ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {recentBills.map((bill) => (
                        <tr
                          key={bill.id}
                          onClick={() => handleRowClick(bill)}
                          className="hover:bg-gray-50 cursor-pointer transition"
                        >
                          {/* Titre + ID (ID visible uniquement sur desktop) */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex flex-col">
                            <span className="text-base font-semibold text-gray-900">{bill.title}</span>
                            <span className="text-xs text-gray-400 hidden sm:inline-block mt-1">#{bill._id}</span>
                          </td>
                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(bill.date)}</td>
                          {/* Type desktop uniquement */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{bill.type}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}
        </main>
        {/* Modals */}
        <BillModal
          bill={selectedBill}
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
        />
        <AddBillModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSave={handleAddBill}
        />
        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onUserAdded={() => setIsAddUserModalOpen(false)}
        />
      </div>
    </div>
  );
} 