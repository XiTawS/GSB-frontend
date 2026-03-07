import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { getUserByEmail, updateUser } from '../../services/userService';
import { useDarkMode } from '../../components/DarkMode/DarkModeContext';
import { useToast } from '../../components/Toast/ToastContext';
import { SkeletonProfile } from '../../components/Skeleton/Skeleton';

export default function Setting({ onLogout }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', avatar: '' });
  const token = localStorage.getItem('token');
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const toast = useToast();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(f => ({ ...f, avatar: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (user) setForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', password: '', avatar: user.avatar || '' });
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const updated = await updateUser(user.email, { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, avatar: form.avatar });
      setUser(updated);
      setEditMode(false);
      toast.success('Profil mis à jour !');
    } catch { toast.error("Erreur lors de la mise à jour du profil."); }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!token) return;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const data = await getUserByEmail(payload.email);
        setUser(data);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', password: '', avatar: user.avatar || '' });
  }, [user]);

  if (isLoading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 px-4 sm:px-8 py-6 max-w-3xl mx-auto">
        <div className="mb-6 pt-10 lg:pt-0 space-y-2">
          <div className="h-7 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
        <SkeletonProfile />
      </div>
    </div>
  );

  if (!user) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex items-center justify-center text-gray-500">Utilisateur non trouvé.</div>
    </div>
  );

  const inputCls = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-3xl w-full mx-auto">
          {/* Header */}
          <div className="mb-6 pt-10 lg:pt-0">
            <h1 className="text-2xl font-semibold text-gray-900">Réglages</h1>
            <p className="text-gray-500 text-sm mt-1">Modifiez vos informations personnelles.</p>
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-5">
              {editMode ? (
                <label className="cursor-pointer group">
                  <img
                    src={form.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=e5e7eb&color=6b7280&size=80`}
                    alt={user.firstName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 group-hover:opacity-70 transition-opacity"
                  />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <p className="text-xs text-gray-400 mt-1 text-center">Modifier</p>
                </label>
              ) : (
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=e5e7eb&color=6b7280&size=80`}
                  alt={user.firstName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                </span>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Modifier ✏️
                </button>
              ) : (
                <button onClick={handleCancel} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Annuler
                </button>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Prénom</label>
                  {editMode ? (
                    <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 py-2.5">{user.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Nom</label>
                  {editMode ? (
                    <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 py-2.5">{user.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Email</label>
                  {editMode ? (
                    <input name="email" value={form.email} onChange={handleChange} className={inputCls} />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 py-2.5">{user.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Mot de passe</label>
                  {editMode ? (
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Nouveau mot de passe" className={inputCls} />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 py-2.5 tracking-widest">••••••••</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Rôle</label>
                  <p className="text-sm font-medium text-gray-900 py-2.5">{user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                  <button type="submit"
                    className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
                    Enregistrer
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Apparence */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apparence</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Mode sombre</p>
                <p className="text-sm text-gray-500">Activer le thème sombre pour l'application.</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center text-xs ${isDark ? 'translate-x-5' : ''}`}>
                  {isDark ? '🌙' : '☀️'}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
