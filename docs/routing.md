# Routing & Authentification

**Fichiers concernés :**
- `src/App.jsx`
- `src/main.jsx`
- `src/features/auth/Login.jsx`
- `src/features/auth/ResetPassword.jsx`

---

## Routing — `App.jsx`

L'application utilise **React Router v7** pour la navigation SPA (Single Page Application).

### Table des routes

| Route | Composant | Accès | Description |
|-------|-----------|-------|-------------|
| `/login` | `Login` | Public | Page de connexion |
| `/reset-password/:token` | `ResetPassword` | Public | Reset mot de passe |
| `/dashboard` | `Dashboard` | Protégé | Tableau de bord |
| `/invoices` | `Invoices` | Protégé | Gestion factures |
| `/users` | `UserList` | Protégé | Gestion utilisateurs |
| `/setting` | `Setting` | Protégé | Réglages profil |
| `/` | Redirect | — | Redirige vers dashboard ou login |

### Protection des routes

```js
const protect = (element) =>
  isAuthenticated ? element : <Navigate to="/login" replace />;
```

Chaque route protégée est wrappée par `protect()`. Si l'utilisateur n'est pas authentifié, il est redirigé vers `/login`.

### Vérification de l'authentification

Au chargement, `App.jsx` vérifie le token JWT **côté client** :

```js
useEffect(() => {
  const token = localStorage.getItem('token');
  const payload = JSON.parse(atob(token.split('.')[1]));  // Décode le payload
  const isExpired = payload.exp * 1000 < Date.now();       // Compare avec l'heure actuelle
  setIsAuthenticated(!isExpired);
}, []);
```

**Pourquoi côté client et pas via l'API ?**
Le backend n'a pas de route `/auth/verify`. Le décodage du JWT permet de vérifier l'expiration sans appel réseau, ce qui rend le chargement initial instantané.

**Limitation :** Cette vérification ne détecte pas un token **révoqué** côté serveur. Seul un appel API échouant en 401 provoquera la déconnexion.

---

## Login — `Login.jsx`

### Flux de connexion

1. L'utilisateur remplit email + mot de passe
2. `apiFetch('/auth/login', { method: 'POST', body: ... })` envoie les identifiants
3. Si succès → le token est passé à `onLogin(token)` qui :
   - Stocke le token dans `localStorage`
   - Met `isAuthenticated` à `true`
   - React Router redirige vers `/dashboard`
4. Si erreur 401 → message "Identifiant ou mot de passe incorrect"

### Modal "Mot de passe oublié"

Un bouton ouvre une modal qui envoie un email de réinitialisation via `POST /auth/forgot-password`. Le feedback (succès/erreur) est affiché dans la modal puis elle se ferme après 3 secondes.

### Avertissement cold start

Un bandeau avertit l'utilisateur que la première connexion peut prendre 1-2 minutes (cold start du backend Render en plan free).

---

## ResetPassword — `ResetPassword.jsx`

Page accessible via un lien email contenant un token de réinitialisation dans l'URL.

### Flux

1. Le token est extrait de l'URL via `useParams()` (React Router)
2. L'utilisateur saisit son nouveau mot de passe + confirmation
3. Validations côté client :
   - Les mots de passe correspondent
   - Minimum 8 caractères
4. `POST /auth/reset-password/:token` envoie le nouveau mot de passe
5. Si succès → message de confirmation puis redirection vers `/login` après 2 secondes

---

## Cycle de vie de l'authentification

```
                  ┌─────────────────────────┐
                  │  localStorage.token      │
                  │  existe et non expiré ?  │
                  └──────────┬──────────────┘
                     oui     │     non
                  ┌──────────▼──┐  ┌──────▼──────┐
                  │  Dashboard  │  │    Login     │
                  └──────┬──────┘  └──────┬───────┘
                         │                │
                 API retourne 401    Login réussit
                         │                │
                  ┌──────▼──────┐  ┌──────▼───────┐
                  │ Suppression │  │ Stockage du  │
                  │ du token    │  │ token        │
                  │ → /login    │  │ → /dashboard │
                  └─────────────┘  └──────────────┘
```
