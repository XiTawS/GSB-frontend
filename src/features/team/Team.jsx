/**
 * Équipe — page manager (lecture seule).
 * Affiche les utilisateurs standards rattachés au manager connecté
 * (ceux dont le champ `manager` pointe vers son id).
 */

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { SkeletonTable } from '../../components/Skeleton/Skeleton';
import { useToast } from '../../components/Toast/ToastContext';
import { getAllUsers } from '../../services/userService';

export default function Team({ onLogout }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const token = localStorage.getItem('token');
  const myId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  // ── Data fetching: filtre les users dont le manager est l'utilisateur connecté ──
  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      try {
        const all = await getAllUsers();
        setMembers(all.filter(u => u.manager === myId));
      } catch {
        toast.error("Erreur lors de la récupération de l'équipe.");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const avatarUrl = (u) =>
    u.avatar || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=e5e7eb&color=6b7280&size=40`;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-5xl w-full mx-auto animate-fade-in">

          {/* Header */}
          <div className="mb-6 pt-10 lg:pt-0">
            <h1 className="text-2xl font-semibold text-gray-900">Mon équipe</h1>
            <p className="text-gray-500 text-sm mt-1">Les collaborateurs dont vous validez les factures.</p>
          </div>

          {loading ? (
            <SkeletonTable rows={4} cols={3} />
          ) : members.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 21a8 8 0 0 0-16 0" />
                  <circle cx="10" cy="8" r="5" />
                  <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Aucun membre dans votre équipe</p>
              <p className="text-sm text-gray-500">Un administrateur doit vous assigner des collaborateurs.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">{members.length} membre{members.length > 1 ? 's' : ''}</p>

              {/* Desktop table */}
              <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden animate-fade-in">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {members.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="flex items-center gap-3">
                            <img src={avatarUrl(u)} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <span className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-500">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Utilisateur</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden flex flex-col gap-3 animate-fade-in">
                {members.map((u) => (
                  <div key={u._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                    <img src={avatarUrl(u)} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
