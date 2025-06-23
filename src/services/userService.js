import { apiFetch } from './api';

const API_URL = 'http://localhost:3000/users';

export async function getAllUsers() {
  const response = await apiFetch(API_URL);
  return response.json();
}

export async function createUser(userData) {
  const response = await apiFetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function updateUser(email, updatedData) {
  const response = await apiFetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });
  return response.json();
}

export async function deleteUser(email) {
  const response = await apiFetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function resetUserPassword(email, password) {
  const response = await apiFetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
  return response.json();
}

export async function getUserByEmail(email) {
  const response = await apiFetch(`${API_URL}?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

// Tu peux ajouter ici d'autres fonctions liées aux utilisateurs (création, etc.) 