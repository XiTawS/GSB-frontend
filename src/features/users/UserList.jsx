import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import AddUserModal from './components/AddUser/AddUserModal';
import UserActionsModal from './components/UserActionsModal/UserActionsModal';
import EditUserModal from './components/EditUserModal/EditUserModal';
import ResetPasswordModal from './components/ResetPasswordModal/ResetPasswordModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import Pagination from '../../components/Pagination/Pagination';
import { SkeletonCard, SkeletonTable } from '../../components/Skeleton/Skeleton';
import { useToast } from '../../components/Toast/ToastContext';
import { getAllUsers, updateUser, deleteUser, resetUserPassword } from '../../services/userService';

export default function UserList({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionsModalPosition, setActionsModalPosition] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 500) setUsersPerPage(3);
      else if (w < 1024) setUsersPerPage(5);
      else setUsersPerPage(8);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, [isAddModalOpen]);

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (`${u.firstName} ${u.lastName}`).toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  const showNotification = (type, message) => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  };

  const openActionsModal = (user, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedUser(user);
    setActionsModalPosition({ top: rect.bottom + 4, left: rect.left - 120 });
    setIsActionsModalOpen(true);
  };

  const handleEditUser = async ({ firstName, lastName, email, role }) => {
    try {
      const data = await updateUser(selectedUser.email, { firstName, lastName, newEmail: email, role });
      if (!data || data.error) { showNotification('error', data?.message || "Erreur lors de la modification."); return; }
      setUsers(await getAllUsers());
      setIsEditModalOpen(false);
    } catch { showNotification('error', "Erreur lors de la modification."); }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const data = await deleteUser(selectedUser.email);
      if (!data || data.error) { showNotification('error', data?.message || "Erreur lors de la suppression."); return; }
      setUsers(u => u.filter(x => x._id !== selectedUser._id));
      setIsDeleteModalOpen(false);
      setIsActionsModalOpen(false);
      showNotification('success', 'Utilisateur supprimé.');
    } catch { showNotification('error', "Erreur lors de la suppression."); }
  };

  const handleResetPassword = async (password) => {
    if (!resetUser) return;
    try {
      const data = await updateUser(resetUser.email, { name: resetUser.name, newEmail: resetUser.email, password, role: resetUser.role });
      if (!data || data.error) { showNotification('error', data?.message || 'Erreur réinitialisation.'); return; }
      showNotification('success', `Mot de passe réinitialisé !`);
      setIsResetModalOpen(false);
      setResetUser(null);
    } catch { showNotification('error', 'Erreur réinitialisation.'); }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto animate-fade-in">
          {/* Header */}
          <div className="mb-6 pt-10 lg:pt-0">
            <h1 className="text-2xl font-semibold text-gray-900">Utilisateurs</h1>
            <p className="text-gray-500 text-sm mt-1">Gérez les comptes utilisateurs de la plateforme.</p>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-scale-in">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-3xl font-semibold text-gray-900">{totalUsers}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-scale-in" style={{ animationDelay: '50ms' }}>
                <p className="text-sm text-gray-500 mb-1">Administrateurs</p>
                <p className="text-3xl font-semibold text-gray-900">{adminCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-scale-in" style={{ animationDelay: '100ms' }}>
                <p className="text-sm text-gray-500 mb-1">Utilisateurs</p>
                <p className="text-3xl font-semibold text-gray-900">{userCount}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors sm:ml-auto"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Ajouter un utilisateur
            </button>
          </div>

          {/* Table */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <p className="text-sm font-medium text-gray-900 mb-1">Aucun utilisateur trouvé</p>
              <p className="text-sm text-gray-500">{searchQuery ? "Ajustez votre recherche." : "Créez votre premier utilisateur."}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=e5e7eb&color=6b7280&size=36`}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-400 sm:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-500 hidden sm:table-cell">{user.email}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            onClick={e => openActionsModal(user, e)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}
            indexOfFirstBill={indexOfFirstUser} indexOfLastBill={indexOfLastUser} totalResults={filteredUsers.length}
          />
        </main>

        <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onUserAdded={() => setIsAddModalOpen(false)} />
        <UserActionsModal isOpen={isActionsModalOpen} onClose={() => { setIsActionsModalOpen(false); setActionsModalPosition(null); }}
          onEdit={() => { setIsActionsModalOpen(false); setIsEditModalOpen(true); }}
          onDelete={() => { setIsActionsModalOpen(false); setIsDeleteModalOpen(true); }}
          onResetPassword={() => { setResetUser(selectedUser); setIsActionsModalOpen(false); setIsResetModalOpen(true); }}
          user={selectedUser} position={actionsModalPosition} />
        <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} onSave={handleEditUser} />
        <ResetPasswordModal isOpen={isResetModalOpen} onClose={() => { setIsResetModalOpen(false); setResetUser(null); }} onReset={handleResetPassword} user={resetUser} />
        <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteUser}
          userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''} />
      </div>
    </div>
  );
}
