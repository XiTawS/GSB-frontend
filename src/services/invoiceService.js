import { apiFetch } from './api';

const API_URL = 'https://gsb-backend-946k.onrender.com/invoices';

export async function getAllInvoices() {
  const response = await apiFetch(API_URL);
  return response.json();
}

export async function getInvoiceById(id) {
  const response = await apiFetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération de la facture.');
  return response.json();
}

export async function createInvoice(data) {
  const formdata = new FormData();
  if (data.proof) formdata.append('proof', data.proof);
  formdata.append('metadata', JSON.stringify({
    title: data.title,
    date: data.date,
    amount: data.amount,
    type: data.type,
    description: data.description,
    status: data.status
  }));
  const token = localStorage.getItem('token');
  const response = await fetch(API_URL, {
    method: 'POST',
    body: formdata,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la facture.');
  }
  return response.json();
}

export async function updateInvoice(id, updatedData) {
  // Si on veut mettre à jour le justificatif (fichier), on envoie un FormData, sinon JSON
  if (updatedData.proof) {
    const formdata = new FormData();
    formdata.append('proof', updatedData.proof);
    formdata.append('metadata', JSON.stringify({
      title: updatedData.title,
      date: updatedData.date,
      amount: updatedData.amount,
      type: updatedData.type,
      description: updatedData.description,
      status: updatedData.status
    }));
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: formdata,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la modification de la facture.');
    }
    return response.json();
  } else {
    const response = await apiFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la modification de la facture.');
    }
    return response.json();
  }
}

export async function deleteInvoice(id) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la facture.');
  }
  return response.json();
}