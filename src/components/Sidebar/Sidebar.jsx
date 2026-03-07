/**
 * Sidebar — vertical icon navigation.
 * Collapses into a burger menu on mobile.
 * Shows nav icons, settings, logout, and user avatar.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserByEmail } from '../../services/userService';

// ── Helpers ──

function isAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    return JSON.parse(atob(token.split('.')[1])).role === 'admin';
  } catch {
    return false;
  }
}

// ── Nav items config ──

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Accueil',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    path: '/invoices',
    label: 'Factures',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" /><path d="M12 2v4" /><path d="M16 2v4" />
        <rect width="16" height="18" x="4" y="4" rx="2" />
        <path d="M8 10h6" /><path d="M8 14h8" /><path d="M8 18h5" />
      </svg>
    ),
  },
  {
    path: '/users',
    label: 'Utilisateurs',
    adminOnly: true,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
];

// ── Component ──

const Sidebar = ({ onLogout }) => {
  const admin = isAdmin();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch current user profile
  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    getUserByEmail(payload.email).then(setUser).catch(() => {});
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile burger button ── */}
      <button
        className="fixed top-4 left-4 z-50 p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm lg:hidden hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir la navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ── Sidebar panel ── */}
      <aside className={`
        fixed top-0 left-0 h-screen w-[72px] bg-white border-r border-gray-200 z-50
        transform transition-transform duration-200 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="h-full flex flex-col">

          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-100">
            <span className="text-2xl">📝</span>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 flex flex-col items-center gap-2 py-4">
            {NAV_ITEMS.map((item) => {
              if (item.adminOnly && !admin) return null;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  title={item.label}
                  className={`
                    w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-150
                    ${active
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>

          {/* Footer: settings, logout, avatar */}
          <div className="flex flex-col items-center gap-2 pb-4 border-t border-gray-100 pt-3">
            {/* Settings */}
            <Link
              to="/setting"
              onClick={() => setIsOpen(false)}
              title="Réglages"
              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-150 ${
                isActive('/setting') ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Déconnexion"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>

            {/* Avatar */}
            <div className="mt-1">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=U&background=e5e7eb&color=6b7280&size=44'}
                alt="Profil"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
