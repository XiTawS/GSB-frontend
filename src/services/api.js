/**
 * API service — centralized fetch wrapper.
 * Base URL is set via VITE_API_URL env variable.
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Wrapper around fetch that:
 * - Injects the Authorization header from localStorage
 * - Prepends API_URL for relative paths
 * - Redirects to /login on 401 (expired token)
 */
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  };

  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  const response = await fetch(fullUrl, { ...options, headers });

  // Auto-logout on 401 (skip login route to avoid redirect loop)
  if (response.status === 401 && !url.includes('/auth/login')) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  return response;
}
