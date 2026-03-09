# 🔌 Documentation des Services API

Cette section détaille la couche de communication entre le frontend et le backend.

**Fichiers concernés :**
- `src/services/api.js`
- `src/services/invoiceService.js`
- `src/services/userService.js`

---

## 🌐 `api.js` — Fetch Wrapper

Wrapper centralisé autour de `fetch()` qui gère automatiquement l'authentification et l'URL de base.

### Constante

| Nom | Source | Défaut | Description |
| :--- | :--- | :--- | :--- |
| `API_URL` | `import.meta.env.VITE_API_URL` | `http://localhost:3001` | URL de base du backend. |

### Méthode `apiFetch(url, options)`

| Fonctionnalité | Détail |
| :--- | :--- |
| **Token JWT** | Ajouté automatiquement dans `Authorization: Bearer <token>`. |
| **Content-Type** | `application/json` par défaut. |
| **URL relative** | Préfixée avec `API_URL` (ex: `/users` → `https://backend.../users`). |
| **URL absolue** | Utilisée telle quelle. |
| **Gestion 401** | Supprime le token et redirige vers `/login`. |

> [!IMPORTANT]
> La route `/auth/login` est exclue de la redirection 401 pour éviter une boucle infinie.

---

## 🧾 `invoiceService.js` — CRUD Factures

### Méthodes

| Méthode | Type de Retour | Description |
| :--- | :--- | :--- |
| `getAllInvoices()` | `Promise<Invoice[]>` | Récupère toutes les factures. |
| `getInvoiceById(id)` | `Promise<Invoice>` | Récupère une facture par ID. |
| `createInvoice(data)` | `Promise<Invoice>` | Crée une facture (multipart/form-data). |
| `updateInvoice(id, data)` | `Promise<Invoice>` | Modifie une facture (JSON ou multipart). |
| `deleteInvoice(id)` | `Promise<Object>` | Supprime une facture. |

### Cas Spécial : `createInvoice`

La création nécessite un upload de fichier. `apiFetch` ne peut pas être utilisé car il force `Content-Type: application/json`, ce qui écraserait le `multipart/form-data`.

```js
const formdata = new FormData();
formdata.append('proof', data.proof);                    // Fichier
formdata.append('metadata', JSON.stringify({ ... }));    // Données JSON stringifiées

// Fetch direct (pas apiFetch)
const response = await fetch(`${API_URL}/invoices`, {
  method: 'POST',
  body: formdata,
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Cas Spécial : `updateInvoice`

L'update détecte automatiquement si un fichier est présent :

| Situation | Méthode utilisée |
| :--- | :--- |
| Avec fichier (`data.proof` existe) | `FormData` + `fetch` direct. |
| Sans fichier (ex: changement de statut) | JSON + `apiFetch`. |

---

## 👥 `userService.js` — CRUD Utilisateurs

### Méthodes

| Méthode | Type de Retour | Description |
| :--- | :--- | :--- |
| `getAllUsers()` | `Promise<User[]>` | Récupère tous les utilisateurs. |
| `getUserByEmail(email)` | `Promise<User>` | Récupère un utilisateur par email. |
| `createUser(data)` | `Promise<User>` | Crée un utilisateur. |
| `updateUser(email, data)` | `Promise<User>` | Modifie un utilisateur. |
| `deleteUser(email)` | `Promise<Object>` | Supprime un utilisateur. |
| `resetUserPassword(email, pwd)` | `Promise<User>` | Réinitialise le mot de passe. |

> [!IMPORTANT]
> Les utilisateurs sont identifiés par leur **email** en query parameter (`?email=xxx`), pas par leur ID MongoDB. La méthode `getUserByEmail` retourne le premier élément du tableau car le backend retourne toujours un tableau.
