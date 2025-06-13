import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserByEmail } from '../../services/userService';

function isAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

const Sidebar = ({ onLogout, onOpenAddUserModal }) => {
  const admin = isAdmin();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!token) return;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email;
        const userData = await getUserByEmail(email);
        setUser(userData);
      } catch (e) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', e);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bouton burger mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir la navigation"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-28 bg-white border-r border-gray-200 shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:block
        `}
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-center p-6 border-b border-gray-200">
            <a href="#" className="flex items-center text-4xl">
              📝
            </a>
          </header>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 flex flex-col items-center gap-4">
            <Link to="/dashboard" className={`w-14 h-14 flex items-center justify-center rounded-full border transition ${location.pathname.startsWith('/dashboard') ? 'bg-gray-900 text-white border-gray-900 shadow' : 'text-gray-800 border-transparent hover:bg-gray-100'}`}>
              <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </Link>
            <Link to="/invoices" className={`w-14 h-14 flex items-center justify-center rounded-full border transition ${location.pathname.startsWith('/invoices') ? 'bg-gray-900 text-white border-gray-900 shadow' : 'text-gray-800 border-transparent hover:bg-gray-100'}`}>
              <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/><rect width="16" height="18" x="4" y="4" rx="2"/><path d="M8 10h6"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>
            </Link>
            {admin && (
              <Link to="/users" className={`w-14 h-14 flex items-center justify-center rounded-full border transition ${location.pathname.startsWith('/users') ? 'bg-gray-900 text-white border-gray-900 shadow' : 'text-gray-800 border-transparent hover:bg-gray-100'}`}>
                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
              </Link>
            )}
          </nav>

          {/* Footer */}
          <div className="p-2 border-t border-gray-200 flex flex-col items-center w-full">
            <div className="flex flex-col gap-2 w-full items-center">
              <Link to="/setting" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </Link>
              <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
              </button>
            </div>
            <hr className="w-full border-gray-200 my-2" />
            <button className="mt-2">
              <img src={user?.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover border" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;