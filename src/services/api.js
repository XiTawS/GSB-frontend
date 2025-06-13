export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  // Ne pas rediriger si c'est la route de login
  if (response.status === 401 && !url.includes('/auth/login')) {
    // Token expiré ou invalide
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirection forcée
    return;
  }

  return response;
} 