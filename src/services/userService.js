/**
 * User service — CRUD operations for users.
 * All endpoints use email as identifier (query param).
 */

import { apiFetch } from './api';

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
