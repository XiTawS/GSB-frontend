import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BillModal from './components/BillModal/BillModal';
import AddBillModal from './components/AddBillModal/AddBillModal';
import BillActionsModal from './components/BillActionsModal/BillActionsModal';
import EditBillModal from './components/EditBillModal/EditBillModal';
import ChangeStatusModal from './components/ChangeStatusModal/ChangeStatusModal';
import { getAllInvoices, updateInvoice, deleteInvoice } from '../../services/invoiceService';
import { getAllUsers } from '../../services/userService';
import './Invoices.css';
import FacturesTable from './FacturesTable';
import Pagination from '../../components/Pagination/Pagination';
import InvoicesFilters from './InvoicesFilters';

export default function Invoices({ onLogout }) {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(5);
  const [actionsModalPosition, setActionsModalPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const updateBillsPerPage = () => {
      const width = window.innerWidth;
      if (width < 500) setBillsPerPage(2);
      else if (width < 800) setBillsPerPage(3);
      else if (width < 1024) setBillsPerPage(5);
      else if (width < 1400) setBillsPerPage(6);
      else setBillsPerPage(6);
    };
    updateBillsPerPage();
    window.addEventListener('resize', updateBillsPerPage);
    return () => window.removeEventListener('resize', updateBillsPerPage);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllInvoices();
        setBills(data);
      } catch (e) {
        setError('Erreur lors de la récupération des factures.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Toujours rester sur la première page lors d'un changement de filtre, de recherche ou de modification des factures
  useEffect(() => {
    setCurrentPage(1);
  }, [bills, filterStatus, searchQuery]);

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUserRole(payload.role);
  }, [token]);

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

  // Trier les factures du plus récent au plus ancien (version robuste)
  const sortedBills = [...bills].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
  // Log pour vérifier l'ordre des dates
  console.log('Dates triées :', sortedBills.map(b => b.date));

  const filteredBills = sortedBills.filter(bill => {
    // Filter by status
    if (filterStatus !== 'All' && bill.status !== filterStatus) {
      return false;
    }
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        bill.title.toLowerCase().includes(query) ||
        bill.type.toLowerCase().includes(query) ||
        bill.description?.toLowerCase().includes(query) ||
        bill.amount.toString().includes(query)
      );
    }
    return true;
  });

  // Pagination : factures à afficher sur la page courante
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

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

  const openActionsModal = (bill, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedBill(bill);
    setActionsModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      height: rect.height
    });
    setIsActionsModalOpen(true);
  };

  const closeActionsModal = () => {
    setIsActionsModalOpen(false);
    setActionsModalPosition(null);
  };

  const openEditModal = () => {
    setIsActionsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openStatusModal = () => {
    setIsActionsModalOpen(false);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleChangeStatus = async (updatedStatus) => {
    if (!selectedBill) return;
    setLoading(true);
    setError('');
    try {
      await updateInvoice(selectedBill._id, { status: updatedStatus });
      const data = await getAllInvoices();
      setBills(data);
    } catch (e) {
      setError('Erreur lors du changement de statut.');
    } finally {
      setLoading(false);
    }
    setIsActionsModalOpen(false);
  };

  const handleEditBill = async (updatedBill) => {
    if (!selectedBill) return;
    setLoading(true);
    setError('');
    try {
      await updateInvoice(selectedBill._id, updatedBill);
      const data = await getAllInvoices();
      setBills(data);
    } catch (e) {
      setError('Erreur lors de la modification de la facture.');
    } finally {
      setLoading(false);
    }
    setIsActionsModalOpen(false);
  };

  const handleDeleteBill = async () => {
    if (!selectedBill) return;
    setLoading(true);
    setError('');
    try {
      await deleteInvoice(selectedBill._id);
      const data = await getAllInvoices();
      setBills(data);
    } catch (e) {
      setError('Erreur lors de la suppression de la facture.');
    } finally {
      setLoading(false);
    }
    setIsActionsModalOpen(false);
  };

  console.log('Current state:', { 
    isDetailModalOpen, 
    isAddModalOpen, 
    selectedBill: selectedBill ? `Bill #${selectedBill.id}` : 'None' 
  });

  if (loading) return <div className="loader">Chargement des factures...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <Sidebar onLogout={onLogout} />
      </div>
      <div className="dashboard-content">
        <main className="dashboard-main">
            {/* Header Section */}
            <div className="mb-6 ml-2 sm:ml-4 flex flex-col items-start sm:items-start justify-start sm:justify-start text-left sm:text-left md:text-left text-center sm:text-left">
              <div className="w-full flex flex-col items-center justify-center sm:items-start sm:justify-start">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1 w-full text-center sm:text-left">Factures</h2>
                <p className="text-gray-500 text-base w-full text-center sm:text-left">Visualisez, créez et gérez vos factures.</p>
              </div>
            </div>
            <hr className="dashboard-header-divider" />
            {/* Stats Section */}
            <div className="mb-6">
              <dl className="flex flex-col gap-4 sm:flex-row sm:gap-8 text-center">
                <div className="flex-1">
                  <dt className="text-base text-gray-500">Nombre de factures totales</dt>
                  <dd className="text-4xl font-semibold text-gray-900">{bills.length}</dd>
                    </div>
                <div className="flex-1">
                  <dt className="text-base text-gray-500">Montant total des factures totales</dt>
                  <dd className="text-4xl font-semibold text-gray-900">{bills.reduce((total, bill) => total + bill.amount, 0)} €</dd>
                    </div>
                <div className="flex-1">
                  <dt className="text-base text-gray-500">Nombre de factures validées</dt>
                  <dd className="text-4xl font-semibold text-gray-900">{bills.filter(bill => bill.status === 'Approved').length}</dd>
                    </div>
                <div className="flex-1">
                  <dt className="text-base text-gray-500">Nombre de factures en attente</dt>
                  <dd className="text-4xl font-semibold text-gray-900">{bills.filter(bill => bill.status === 'Pending').length}</dd>
                </div>
              </dl>
            </div>
            {/* Filters */}
            <InvoicesFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              openAddBillModal={openAddBillModal}
            />
            
            {/* Bills Table */}
            {filteredBills.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="empty-state-title">Aucune facture trouvée</h3>
                <p className="empty-state-text">
                  {searchQuery || filterStatus !== 'All'
                    ? "Essayez d'ajuster votre recherche ou le filtre."
                    : 'Commencez par créer une nouvelle facture.'}
                </p>
                {!searchQuery && filterStatus === 'All' && (
                  <div className="empty-state-button">
                    <button
                      type="button"
                      onClick={openAddBillModal}
                      className="add-bill-btn"
                    >
                      <svg className="add-bill-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                      </svg>
                      Ajouter une facture
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <FacturesTable
                  bills={currentBills}
                  onRowClick={handleRowClick}
                  openActionsModal={openActionsModal}
                  getStatusClasses={getStatusClasses}
                  formatDate={formatDate}
                  users={users}
                  userRole={userRole}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  indexOfFirstBill={indexOfFirstBill}
                  indexOfLastBill={indexOfLastBill}
                  totalResults={filteredBills.length}
                />
              </>
            )}
        </main>
        
        {/* Bill Detail Modal */}
        <BillModal
          bill={selectedBill}
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
        />
        
        {/* Add Bill Modal */}
        <AddBillModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSave={handleAddBill}
        />
        <BillActionsModal
          isOpen={isActionsModalOpen}
          onClose={closeActionsModal}
          onEdit={openEditModal}
          onDelete={handleDeleteBill}
          onChangeStatus={openStatusModal}
          bill={selectedBill}
          position={actionsModalPosition}
        />
        <EditBillModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          bill={selectedBill}
          onSave={handleEditBill}
        />
        <ChangeStatusModal
          isOpen={isStatusModalOpen}
          onClose={closeStatusModal}
          status={selectedBill?.status}
          onSave={handleChangeStatus}
          billId={selectedBill?._id}
        />
      </div>
    </div>
  );
} 