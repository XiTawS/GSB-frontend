/**
 * User service — CRUD operations for users.
 * All endpoints use email as identifier (query param).
 */

import { apiFetch, API_URL } from './api';

// ── Read ──

export async function getAllUsers() {
  const response = await apiFetch('/users');
  return response.json();
}

export async function getUserByEmail(email) {
  const response = await apiFetch(`/users?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

// ── Create ──

export async function createUser(userData) {
  const response = await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return response.json();
}

// ── Update ──

export async function updateUser(email, updatedData) {
  const response = await apiFetch(`/users?email=${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });
  return response.json();
}

// Met à jour le profil avec une photo optionnelle (upload S3 via multipart).
// Avec avatarFile → FormData (le backend stocke l'URL S3) ; sinon → JSON classique.
export async function updateUserProfile(email, fields, avatarFile) {
  if (!avatarFile) return updateUser(email, fields);

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== '') formData.append(key, value);
  });
  formData.append('avatar', avatarFile);

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour du profil.');
  return response.json();
}

// ── Delete ──

export async function deleteUser(email) {
  const response = await apiFetch(`/users?email=${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
  return response.json();
}

// ── Password reset (admin) ──

export async function resetUserPassword(email, password) {
  const response = await apiFetch(`/users?email=${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
  return response.json();
}
