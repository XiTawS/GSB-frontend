import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BillModal from '../invoices/components/BillModal/BillModal';
import AddBillModal from '../invoices/components/AddBillModal/AddBillModal';
import AddUserModal from '../users/components/AddUser/AddUserModal';
import MiniChart from '../../components/MiniChart/MiniChart';
import StatusDonut from '../../components/StatusDonut/StatusDonut';
import { SkeletonCard, SkeletonTable } from '../../components/Skeleton/Skeleton';
import { getAllInvoices } from '../../services/invoiceService';
import { getUserByEmail } from '../../services/userService';

const STATUS_MAP = {
  Approved: { label: 'Validée', cls: 'bg-emerald-50 text-emerald-700' },
  Rejected: { label: 'Rejetée', cls: 'bg-red-50 text-red-700' },
  Pending: { label: 'En attente', cls: 'bg-amber-50 text-amber-700' },
};

export default function Dashboard({ onLogout }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [billsToShow, setBillsToShow] = useState(5);
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    getUserByEmail(payload.email).then(setUser).catch(() => {});
  }, [token]);

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      setBills(await getAllInvoices(token));
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 500) setBillsToShow(3);
      else if (w < 1024) setBillsToShow(4);
      else setBillsToShow(6);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  // Pull to refresh
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      const diff = e.changedTouches[0].clientY - startY;
      if (diff > 100 && window.scrollY === 0) fetchBills();
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); };
  }, [fetchBills]);

  const sortedBills = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentBills = sortedBills.slice(0, billsToShow);
  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  const totalAmount = bills.reduce((acc, b) => acc + b.amount, 0);
  const pendingCount = bills.filter(b => b.status === 'Pending').length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto animate-fade-in">
          {/* Header */}
          <div className="mb-6 pt-10 lg:pt-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              Bonjour{user?.firstName ? `, ${user.firstName}` : ''} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Voici un aperçu de vos notes de frais.</p>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-scale-in">
                <p className="text-sm text-gray-500 mb-1">Total factures</p>
                <p className="text-3xl font-semibold text-gray-900">{bills.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-scale-in" style={{ animationDelay: '50ms' }}>
                <p className="text-sm text-gray-500 mb-1">Montant total</p>
                <p className="text-3xl font-semibold text-gray-900">{totalAmount.toFixed(2)} €</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-scale-in" style={{ animationDelay: '100ms' }}>
                <p className="text-sm text-gray-500 mb-1">En attente</p>
                <p className="text-3xl font-semibold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          )}

          {/* Charts */}
          {!loading && bills.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <MiniChart bills={bills} />
              <StatusDonut bills={bills} />
            </div>
          )}

          {/* Recent bills */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Dernières factures</h2>
            <button onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Ajouter
            </button>
          </div>

          {loading ? (
            <SkeletonTable rows={4} cols={5} />
          ) : bills.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Aucune facture</p>
              <p className="text-sm text-gray-500 mb-4">Commencez par créer votre première facture.</p>
              <button onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
                Créer une facture
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden animate-fade-in">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBills.map((bill) => {
                      const status = STATUS_MAP[bill.status] || STATUS_MAP.Pending;
                      return (
                        <tr key={bill._id} onClick={() => { setSelectedBill({ ...bill }); setIsDetailModalOpen(true); }}
                          className="hover:bg-gray-50 cursor-pointer transition-colors">
                          <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{bill.title}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-500">{formatDate(bill.date)}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-500">{bill.type}</td>
                          <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{bill.amount.toFixed(2)} €</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>{status.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden flex flex-col gap-3 animate-fade-in">
                {recentBills.map((bill) => {
                  const status = STATUS_MAP[bill.status] || STATUS_MAP.Pending;
                  return (
                    <div key={bill._id} onClick={() => { setSelectedBill({ ...bill }); setIsDetailModalOpen(true); }}
                      className="bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{bill.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(bill.date)} · {bill.type}</p>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>{status.label}</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{bill.amount.toFixed(2)} €</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>

        <BillModal bill={selectedBill} isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedBill(null); }} />
        <AddBillModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={(b) => setBills([b, ...bills])} />
        <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onUserAdded={() => setIsAddUserModalOpen(false)} />
      </div>
    </div>
  );
}
