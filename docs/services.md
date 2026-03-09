# Services API

**Fichiers concernés :**
- `src/services/api.js`
- `src/services/invoiceService.js`
- `src/services/userService.js`

Les services forment la **couche de communication** entre le frontend et le backend. Ils encapsulent tous les appels HTTP.

---

## `api.js` — Fetch wrapper

### Constante `API_URL`

```js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

L'URL du backend est lue depuis la variable d'environnement Vite. En développement sans `.env`, elle fallback sur `localhost:3001`.

### Fonction `apiFetch(url, options)`

Wrapper autour de `fetch()` qui ajoute automatiquement :

1. **Le token JWT** dans le header `Authorization: Bearer <token>` (lu depuis `localStorage`)
2. **Le `Content-Type: application/json`** par défaut
3. **Le préfixe `API_URL`** pour les URL relatives

```js
// URL relative → préfixée automatiquement
apiFetch('/users')           // → fetch('https://backend.../users')

// URL absolue → utilisée telle quelle
apiFetch('https://...')      // → fetch('https://...')
```

**Gestion du 401 :**
Si le backend retourne un `401` (token expiré/invalide), le token est supprimé de `localStorage` et l'utilisateur est redirigé vers `/login`. Exception : la route `/auth/login` elle-même (pour éviter une boucle de redirection).

---

## `invoiceService.js` — CRUD Factures

| Fonction | Méthode | Route | Description |
|----------|---------|-------|-------------|
| `getAllInvoices()` | GET | `/invoices` | Lister les factures |
| `getInvoiceById(id)` | GET | `/invoices/:id` | Détail d'une facture |
| `createInvoice(data)` | POST | `/invoices` | Créer (multipart) |
| `updateInvoice(id, data)` | PUT | `/invoices/:id` | Modifier |
| `deleteInvoice(id)` | DELETE | `/invoices/:id` | Supprimer |

### Cas spécial : `createInvoice`

La création de facture nécessite un upload de fichier. `apiFetch` ne peut pas être utilisé car il force `Content-Type: application/json`.

```js
const formdata = new FormData();
formdata.append('proof', data.proof);                    // Fichier
formdata.append('metadata', JSON.stringify({ ... }));    // Données en JSON stringifié

// Fetch direct (pas apiFetch) — FormData définit le Content-Type automatiquement
const response = await fetch(`${API_URL}/invoices`, {
  method: 'POST',
  body: formdata,
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Pourquoi pas `apiFetch` ?**
`apiFetch` ajoute `Content-Type: application/json` qui écraserait le `multipart/form-data` généré automatiquement par le navigateur quand on envoie un `FormData`.

### Cas spécial : `updateInvoice`

L'update détecte si un fichier est présent :
- **Avec fichier** → FormData (même logique que create)
- **Sans fichier** → JSON via `apiFetch` (ex: changement de statut)

---

## `userService.js` — CRUD Utilisateurs

| Fonction | Méthode | Route | Description |
|----------|---------|-------|-------------|
| `getAllUsers()` | GET | `/users` | Lister tous |
| `getUserByEmail(email)` | GET | `/users?email=xxx` | Récupérer par email |
| `createUser(data)` | POST | `/users` | Créer |
| `updateUser(email, data)` | PUT | `/users?email=xxx` | Modifier |
| `deleteUser(email)` | DELETE | `/users?email=xxx` | Supprimer |
| `resetUserPassword(email, pwd)` | PUT | `/users?email=xxx` | Reset mot de passe |

### Particularité : identification par email

Contrairement aux factures (identifiées par `_id`), les utilisateurs sont identifiés par leur **email** en query parameter. C'est un choix du backend.

```js
export async function getUserByEmail(email) {
  const response = await apiFetch(`/users?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}
```

Le backend retourne un **tableau** même pour un seul utilisateur. Le service extrait le premier élément.
