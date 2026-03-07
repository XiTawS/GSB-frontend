/**
 * Invoices page — full invoice management.
 * Features: list, search, filter, sort, paginate, CRUD, export CSV.
 * Includes skeleton loaders and pull-to-refresh on mobile.
 */

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BillModal from './components/BillModal/BillModal';
import AddBillModal from './components/AddBillModal/AddBillModal';
import BillActionsModal from './components/BillActionsModal/BillActionsModal';
import EditBillModal from './components/EditBillModal/EditBillModal';
import ChangeStatusModal from './components/ChangeStatusModal/ChangeStatusModal';
import { SkeletonCard, SkeletonTable } from '../../components/Skeleton/Skeleton';
import { getAllInvoices, updateInvoice, deleteInvoice } from '../../services/invoiceService';
import { getAllUsers } from '../../services/userService';
import { useToast } from '../../components/Toast/ToastContext';
import FacturesTable from './FacturesTable';
import Pagination from '../../components/Pagination/Pagination';
import InvoicesFilters from './InvoicesFilters';

export default function Invoices({ onLogout }) {
  // ── State ──
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
  const [billsPerPage, setBillsPerPage] = useState(6);
  const [actionsModalPosition, setActionsModalPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');

  const token = localStorage.getItem('token');
  const toast = useToast();

  // ── Data fetching ──

  useEffect(() => { getAllUsers().then(setUsers).catch(() => {}); }, []);

  const fetchBills = async () => {
    setLoading(true);
    try { setBills(await getAllInvoices()); }
    catch { toast.error('Erreur lors de la récupération des factures.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBills(); }, []);

  // ── Responsive bills per page ──
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBillsPerPage(w < 500 ? 3 : w < 1024 ? 5 : 8);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [bills, filterStatus, searchQuery]);

  // Extract user role from token
  useEffect(() => {
    if (!token) return;
    setUserRole(JSON.parse(atob(token.split('.')[1])).role);
  }, [token]);

  // ── Pull to refresh (mobile) ──
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (e.changedTouches[0].clientY - startY > 100 && window.scrollY === 0) fetchBills();
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // ── Filtering & sorting ──

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });

  const sortedBills = [...bills].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const filteredBills = sortedBills.filter(bill => {
    if (filterStatus !== 'All' && bill.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        bill.title?.toLowerCase().includes(q) ||
        bill.type?.toLowerCase().includes(q) ||
        bill.description?.toLowerCase().includes(q) ||
        bill.amount?.toString().includes(q)
      );
    }
    return true;
  });

  // ── Pagination ──

  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  // ── Computed stats ──

  const totalAmount = bills.reduce((a, b) => a + b.amount, 0);
  const approvedCount = bills.filter(b => b.status === 'Approved').length;
  const pendingCount = bills.filter(b => b.status === 'Pending').length;

  // ── Actions ──

  const refreshBills = async () => { setBills(await getAllInvoices()); };

  const openActionsModal = (bill, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedBill(bill);
    setActionsModalPosition({ top: rect.bottom + 4, left: rect.left - 120 });
    setIsActionsModalOpen(true);
  };

  const handleDeleteBill = async () => {
    if (!selectedBill) return;
    try { await deleteInvoice(selectedBill._id); await refreshBills(); toast.success('Facture supprimée.'); }
    catch { toast.error('Erreur lors de la suppression.'); }
    setIsActionsModalOpen(false);
  };

  const handleEditBill = async (updatedBill) => {
    if (!selectedBill) return;
    try { await updateInvoice(selectedBill._id, updatedBill); await refreshBills(); toast.success('Facture modifiée.'); }
    catch { toast.error('Erreur lors de la modification.'); }
    setIsActionsModalOpen(false);
  };

  const handleChangeStatus = async (status) => {
    if (!selectedBill) return;
    try { await updateInvoice(selectedBill._id, { status }); await refreshBills(); toast.success('Statut mis à jour.'); }
    catch { toast.error('Erreur lors du changement de statut.'); }
    setIsActionsModalOpen(false);
  };

  // ── Render ──

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto animate-fade-in">

          {/* ── Header ── */}
          <div className="mb-6 pt-10 lg:pt-0">
            <h1 className="text-2xl font-semibold text-gray-900">Factures</h1>
            <p className="text-gray-500 text-sm mt-1">Visualisez, créez et gérez vos factures.</p>
          </div>

          {/* ── Stats cards ── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total', value: bills.length, color: 'text-gray-900' },
                { label: 'Montant total', value: `${totalAmount.toFixed(2)} €`, color: 'text-gray-900' },
                { label: 'Validées', value: approvedCount, color: 'text-emerald-600' },
                { label: 'En attente', value: pendingCount, color: 'text-amber-600' },
              ].map((stat, i) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Filters + CSV export ── */}
          <InvoicesFilters
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            openAddBillModal={() => setIsAddModalOpen(true)}
            filteredBills={filteredBills}
          />

          {/* ── Table / Empty state ── */}
          {loading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : filteredBills.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Aucune facture trouvée</p>
              <p className="text-sm text-gray-500">
                {searchQuery || filterStatus !== 'All' ? "Ajustez votre recherche ou filtre." : 'Créez votre première facture.'}
              </p>
            </div>
          ) : (
            <>
              <FacturesTable
                bills={currentBills}
                onRowClick={(b) => { setSelectedBill({ ...b }); setIsDetailModalOpen(true); }}
                openActionsModal={openActionsModal}
                formatDate={formatDate}
                users={users}
                userRole={userRole}
              />
              <Pagination
                currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}
                indexOfFirstBill={indexOfFirstBill} indexOfLastBill={indexOfLastBill} totalResults={filteredBills.length}
              />
            </>
          )}
        </main>

        {/* ── Modals ── */}
        <BillModal bill={selectedBill} isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedBill(null); }} />

        <AddBillModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
          onSave={(b) => { setBills([b, ...bills]); toast.success('Facture ajoutée !'); }} />

        <BillActionsModal isOpen={isActionsModalOpen}
          onClose={() => { setIsActionsModalOpen(false); setActionsModalPosition(null); }}
          onEdit={() => { setIsActionsModalOpen(false); setIsEditModalOpen(true); }}
          onDelete={handleDeleteBill}
          onChangeStatus={() => { setIsActionsModalOpen(false); setIsStatusModalOpen(true); }}
          bill={selectedBill} position={actionsModalPosition} />

        <EditBillModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} bill={selectedBill} onSave={handleEditBill} />

        <ChangeStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}
          status={selectedBill?.status} onSave={handleChangeStatus} billId={selectedBill?._id} />
      </div>
    </div>
  );
}
