import React, { useState, useEffect } from 'react';
import './Setting.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import { getUserByEmail, updateUser } from '../../services/userService';

export default function Setting({ onLogout }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        avatar: '',
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditMode(false);
        if (user) {
            setForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: '',
                avatar: user.avatar || '',
            });
        }
    };

    const handleSave = async e => {
        e.preventDefault();
        try {
            const updated = await updateUser(user.email, {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
                avatar: form.avatar
            });
            setUser(updated);
            setEditMode(false);
        } catch (err) {
            alert("Erreur lors de la mise à jour du profil.");
            console.error(err);
        }
    };

    const token = localStorage.getItem('token');

    useEffect(() => {
        async function fetchUser() {
            try {
                if (!token) return;
                const payload = JSON.parse(atob(token.split('.')[1]));
                const email = payload.email;
                const userData = await getUserByEmail(email);
                setUser(userData);
                setIsLoading(false);
            } catch (e) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', e);
                setIsLoading(false);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    if (isLoading) return <div>Chargement...</div>;
    if (!user) return <div>Utilisateur non trouvé.</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <Sidebar onLogout={onLogout} onOpenAddUserModal={() => setIsAddUserModalOpen(true)} />
            </div>
            <div className="dashboard-content">
                <main className="dashboard-main">
                    {/* Header Section */}
                    <div className="mb-6 ml-2 sm:ml-4 flex flex-col items-start sm:items-start justify-start sm:justify-start text-left sm:text-left md:text-left text-center sm:text-left">
                        <div className="w-full flex flex-col items-center justify-center sm:items-start sm:justify-start">
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1 w-full text-center sm:text-left">
                                Réglages
                            </h2>
                            <p className="text-gray-500 text-base w-full text-center sm:text-left">
                                Modifiez vos paramètres de votre application.
                            </p>
                        </div>
                    </div>
                    <hr className="dashboard-header-divider" />
                    <div className="setting-container">
                        <div className="setting-content-container">
                            <div className="setting-container-title">
                                <h2 className="setting-container-title-text">
                                    Mon profil
                                </h2>
                                <p className="setting-container-title-subtitle">
                                    Modifiez vos informations personnelles.
                                </p>
                            </div>
                            {/* Card profil */}
                            <div className="setting-profile-card">
                                {editMode ? (
                                    <label style={{ cursor: 'pointer' }}>
                                        <img
                                            src={form.avatar || 'mazioua.jpg'}
                                            alt={form.firstName}
                                            className="setting-profile-avatar"
                                            style={{ opacity: 0.7 }}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleAvatarChange}
                                        />
                                        <div style={{ color: '#6b7280', fontSize: 14, marginTop: 6, textAlign: 'center' }}>
                                            Modifier l'avatar
                                        </div>
                                    </label>
                                ) : (
                                    <img src={user.avatar || 'mazioua.jpg'} alt={user.firstName} className="setting-profile-avatar" />
                                )}
                                <div>
                                    <div className="setting-profile-name">{user.firstName} {user.lastName}</div>
                                    <div className="setting-profile-email">{user.email}</div>
                                    <div className="setting-profile-desc">Loreloremloremloremloremloremloremloremlorem</div>
                                </div>
                            </div>

                            {/* Card infos */}
                            <form onSubmit={handleSave} className="setting-form-card">
                                <div className="setting-form-header">
                                    <div className="setting-form-title">Informations personnelles</div>
                                    {!editMode && (
                                        <button type="button" className="setting-edit-btn" onClick={handleEdit}>
                                            Modifier <span className="setting-edit-btn-emoji">✏️</span>
                                        </button>
                                    )}
                                    {editMode && (
                                        <button type="button" className="setting-edit-btn" onClick={handleCancel}>
                                            Annuler
                                        </button>
                                    )}
                                </div>
                                <div className="setting-form-content">
                                    <div className="setting-form-col">
                                        <div>
                                            <div className="setting-form-label">Prénom</div>
                                            {editMode ? (
                                                <input name="firstName" value={form.firstName} onChange={handleChange} className="setting-form-input" />
                                            ) : (
                                                <div className="setting-form-value">{user.firstName}</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="setting-form-label">Email</div>
                                            {editMode ? (
                                                <input name="email" value={form.email} onChange={handleChange} className="setting-form-input" />
                                            ) : (
                                                <div className="setting-form-value">{user.email}</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="setting-form-label">Rôle</div>
                                            {editMode ? (
                                                <input value={user.role} disabled className="setting-form-input" />
                                            ) : (
                                                <div className="setting-form-value">{user.role}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="setting-form-col">
                                        <div>
                                            <div className="setting-form-label">Nom</div>
                                            {editMode ? (
                                                <input name="lastName" value={form.lastName} onChange={handleChange} className="setting-form-input" />
                                            ) : (
                                                <div className="setting-form-value">{user.lastName}</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="setting-form-label">Mot de passe</div>
                                            {editMode ? (
                                                <input name="password" type="password" value={form.password} onChange={handleChange} className="setting-form-input" placeholder="••••••••••" />
                                            ) : (
                                                <div className="setting-form-value setting-form-value-password">••••••••••</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="setting-form-btn-save-container">
                                <button
                                    type="button"
                                    className="setting-form-btn-save"
                                    disabled={!editMode}
                                    onClick={handleSave}
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

