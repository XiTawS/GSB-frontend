import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import AddUserModal from './components/AddUser/AddUserModal';
import UserActionsModal from './components/UserActionsModal/UserActionsModal';
import EditUserModal from './components/EditUserModal/EditUserModal';
import ResetPasswordModal from './components/ResetPasswordModal/ResetPasswordModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import { getAllUsers, updateUser, deleteUser, resetUserPassword } from '../../services/userService';
import '../../features/dashboard/Dashboard.css';
import './UserList.css';

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

  useEffect(() => {
    const updateUsersPerPage = () => {
      const width = window.innerWidth;
      if (width < 500) setUsersPerPage(2);
      else if (width < 800) setUsersPerPage(3);
      else if (width < 1024) setUsersPerPage(5);
      else if (width < 1400) setUsersPerPage(8);
      else setUsersPerPage(12);
    };
    updateUsersPerPage();
    window.addEventListener('resize', updateUsersPerPage);
    return () => window.removeEventListener('resize', updateUsersPerPage);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (e) {
        console.error('Erreur lors de la récupération des utilisateurs:', e);
      }
    })();
  }, [isAddModalOpen]);

  // Recherche
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  // Handlers
  const openAddUserModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const handleAddUser = () => {
    setIsAddModalOpen(false);
  };
  const openActionsModal = (user, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedUser(user);
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

  const handleEditUser = async ({ firstName, lastName, email, role }) => {
    try {
      const data = await updateUser(selectedUser.email, { firstName, lastName, newEmail: email, role });
      if (!data || data.error) {
        setNotification({ type: 'error', message: data.message || "Erreur lors de la modification de l'utilisateur." });
        setTimeout(() => setNotification(null), 6000);
      } else {
        const updatedUsers = await getAllUsers();
        setUsers(updatedUsers);
        setIsEditModalOpen(false);
      }
    } catch (err) {
      setNotification({ type: 'error', message: "Erreur lors de la modification de l'utilisateur." });
      setTimeout(() => setNotification(null), 6000);
    }
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const data = await deleteUser(selectedUser.email);
      if (!data || data.error) {
        setNotification({ type: 'error', message: data.message || "Erreur lors de la suppression de l'utilisateur." });
        setTimeout(() => setNotification(null), 6000);
      } else {
        setUsers(users => users.filter(u => u._id !== selectedUser._id));
        setIsActionsModalOpen(false);
        setIsDeleteModalOpen(false);
        setNotification({ type: 'success', message: `Utilisateur supprimé avec succès.` });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: "Erreur lors de la suppression de l'utilisateur." });
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const openResetPasswordModal = () => {
    setResetUser(selectedUser);
    setIsActionsModalOpen(false);
    setIsResetModalOpen(true);
  };
  const closeResetPasswordModal = () => {
    setIsResetModalOpen(false);
    setResetUser(null);
  };

  const handleResetPassword = async (password) => {
    if (!resetUser) return;
    try {
      const data = await resetUserPassword(resetUser.email, password);
      if (!data || data.error) {
        setNotification({ type: 'error', message: data.message || 'Erreur lors de la réinitialisation du mot de passe.' });
        setTimeout(() => setNotification(null), 6000);
      } else {
        setUsers(users => users.map(u => (u._id === resetUser._id ? { ...u, password } : u)));
        setNotification({ type: 'success', message: `Mot de passe réinitialisé ! Nouveau mot de passe : ${password}` });
        setTimeout(() => setNotification(null), 6000);
        closeResetPasswordModal();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Erreur lors de la réinitialisation du mot de passe.' });
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const openDeleteConfirmation = () => {
    setIsActionsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {notification && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'success' ? '#22c55e' : '#f87171',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: 8,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
          zIndex: 2000,
          fontSize: 17,
          fontWeight: 500,
        }}>
          {notification.message}
        </div>
      )}
      <div className="dashboard-sidebar">
        <Sidebar onLogout={onLogout} onOpenAddUserModal={openAddUserModal} />
      </div>
      <div className="dashboard-content">
        <main className="dashboard-main">
          {/* Header Section */}
          <div className="mb-6 ml-2 sm:ml-4 flex flex-col items-start sm:items-start justify-start sm:justify-start text-left sm:text-left md:text-left text-center sm:text-left">
            <div className="w-full flex flex-col items-center justify-center sm:items-start sm:justify-start">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1 w-full text-center sm:text-left">Utilisateurs</h2>
              <p className="text-gray-500 text-base w-full text-center sm:text-left">Gérez les comptes utilisateurs de la plateforme.</p>
            </div>
          </div>
          <hr className="dashboard-header-divider" />
          {/* Stats Section */}
          <div className="mb-6">
            <dl className="flex flex-col gap-4 sm:flex-row sm:gap-8 text-center">
              <div className="flex-1">
                <dt className="text-base text-gray-500">Total utilisateurs</dt>
                <dd className="text-4xl font-semibold text-gray-900">{totalUsers}</dd>
              </div>
              <div className="flex-1">
                <dt className="text-base text-gray-500">Administrateurs</dt>
                <dd className="text-4xl font-semibold text-gray-900">{adminCount}</dd>
              </div>
              <div className="flex-1">
                <dt className="text-base text-gray-500">Utilisateurs standards</dt>
                <dd className="text-4xl font-semibold text-gray-900">{userCount}</dd>
              </div>
            </dl>
          </div>
          {/* Filters */}
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
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <button
                type="button"
                onClick={openAddUserModal}
                className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition w-auto sm:mr-8"
              >
                <svg className="w-5 h-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Ajouter un utilisateur
              </button>
            </div>
          </div>
          
          {/* Users Table */}
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="empty-state-title">Aucun utilisateur trouvé</h3>
              <p className="empty-state-text">
                {searchQuery
                  ? "Essayez d'ajuster votre recherche."
                  : 'Commencez par créer un nouvel utilisateur.'}
              </p>
              {!searchQuery && (
                <div className="empty-state-button">
                  <button
                    type="button"
                    onClick={openAddUserModal}
                    className="add-bill-btn"
                  >
                    <svg className="add-bill-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                    Ajouter un utilisateur
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="table-container">
              <div className="table-scroll-wrapper">
                <div className="table-inner-wrapper">
                  <div className="table-shadow">
                    <table className="dashboard-table">
                      <thead className="table-header">
                        <tr>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Rôle</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody className="table-body">
                          {currentUsers.map((user) => (
                            <tr key={user.id || user._id}>
                              <td className="table-cell table-cell-id">
                                <span className="table-cell-title">{user.firstName} {user.lastName}</span>
                                #{user._id}
                              </td>
                              <td className="table-cell table-cell-text">
                                {user.email}
                              </td>
                              <td className="table-cell table-cell-text">
                                {user.role}
                              </td>
                              <td className="table-cell">
                                <button 
                                  className="table-action-btn"
                                  style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
                                  onClick={e => openActionsModal(user, e)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                  <span className="sr-only">, utilisateur #{user.id}</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Pagination adaptée pour la page des utilisateurs */}
          <div className="pagination-container">
            <div className="pagination-mobile">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
            <div className="pagination-desktop">
              <div>
                <p className="pagination-info">
                  Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span> — Affichage de <span className="font-medium">{indexOfFirstUser + 1}</span> à <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> sur <span className="font-medium">{filteredUsers.length}</span> utilisateurs
                </p>
              </div>
              <div>
                <nav className="pagination-nav" aria-label="Pagination">
                  <button
                    className="pagination-nav-button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Précédent</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {/* Affichage des numéros de page */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`pagination-nav-button${currentPage === i + 1 ? ' pagination-nav-button-active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="pagination-nav-button"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Suivant</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </main>
        {/* Modal d'ajout d'utilisateur */}
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onUserAdded={handleAddUser}
        />
        <UserActionsModal
          isOpen={isActionsModalOpen}
          onClose={closeActionsModal}
          onEdit={openEditModal}
          onDelete={openDeleteConfirmation}
          onResetPassword={openResetPasswordModal}
          user={selectedUser}
          position={actionsModalPosition}
        />
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          user={selectedUser}
          onSave={handleEditUser}
        />
        <ResetPasswordModal
          isOpen={isResetModalOpen}
          onClose={closeResetPasswordModal}
          onReset={handleResetPassword}
          user={resetUser}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteUser}
          userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
        />
      </div>
    </div>
  );
} 