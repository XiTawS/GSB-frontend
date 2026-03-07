/**
 * Invoice service — CRUD operations for invoices.
 * Uses apiFetch for JSON requests and raw fetch for FormData (file uploads).
 */

import { apiFetch, API_URL } from './api';

// ── Read ──

export async function getAllInvoices() {
  const response = await apiFetch('/invoices');
  return response.json();
}

export async function getInvoiceById(id) {
  const response = await apiFetch(`/invoices/${id}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération de la facture.');
  return response.json();
}

// ── Create ──

export async function createInvoice(data) {
  const formdata = new FormData();

  if (data.proof) formdata.append('proof', data.proof);

  formdata.append('metadata', JSON.stringify({
    title: data.title,
    date: data.date,
    amount: data.amount,
    type: data.type,
    description: data.description,
    status: data.status,
  }));

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/invoices`, {
    method: 'POST',
    body: formdata,
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Erreur lors de la création de la facture.');
  return response.json();
}

// ── Update ──

export async function updateInvoice(id, updatedData) {
  // File upload → FormData, otherwise → JSON
  if (updatedData.proof) {
    const formdata = new FormData();
    formdata.append('proof', updatedData.proof);
    formdata.append('metadata', JSON.stringify({
      title: updatedData.title,
      date: updatedData.date,
      amount: updatedData.amount,
      type: updatedData.type,
      description: updatedData.description,
      status: updatedData.status,
    }));

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/invoices/${id}`, {
      method: 'PUT',
      body: formdata,
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Erreur lors de la modification de la facture.');
    return response.json();
  }

  const response = await apiFetch(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error('Erreur lors de la modification de la facture.');
  return response.json();
}

// ── Delete ──

export async function deleteInvoice(id) {
  const response = await apiFetch(`/invoices/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erreur lors de la suppression de la facture.');
  return response.json();
}
