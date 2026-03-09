# 🔐 Documentation Authentification & Routing

Cette section détaille la gestion de l'authentification côté client et la protection des routes.

**Fichiers concernés :**
- `src/App.jsx`
- `src/main.jsx`

---

## 🗺️ Table des Routes

| Route | Composant | Accès | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `Login` | Public | Page de connexion. |
| `/reset-password/:token` | `ResetPassword` | Public | Réinitialisation du mot de passe. |
| `/dashboard` | `Dashboard` | 🔒 Protégé | Tableau de bord. |
| `/invoices` | `Invoices` | 🔒 Protégé | Gestion des factures. |
| `/users` | `UserList` | 🔒 Protégé | Gestion des utilisateurs. |
| `/setting` | `Setting` | 🔒 Protégé | Réglages du profil. |
| `/` | Redirect | — | Redirige vers `/dashboard` ou `/login`. |

---

## 🛡️ Protection des Routes

```js
const protect = (element) =>
  isAuthenticated ? element : <Navigate to="/login" replace />;
```

Chaque route protégée est wrappée par `protect()`. Si l'utilisateur n'est pas authentifié, il est automatiquement redirigé vers `/login`.

---

## ✅ Vérification du Token

Au chargement de l'application, `App.jsx` vérifie le token JWT **côté client** :

| Étape | Détail |
| :--- | :--- |
| 1. Lecture | Récupère le token depuis `localStorage`. |
| 2. Décodage | Parse le payload JWT via `atob()`. |
| 3. Expiration | Compare `payload.exp` avec `Date.now()`. |
| 4. Décision | Token valide → authentifié. Token expiré → supprimé, redirigé. |

> [!IMPORTANT]
> Le backend n'a pas de route `/auth/verify`. Le décodage client-side permet de vérifier l'expiration sans appel réseau, rendant le chargement initial instantané. Cependant, un token **révoqué** côté serveur ne sera pas détecté — seul un appel API échouant en 401 provoquera la déconnexion.

---

## 🔄 Cycle de Vie de l'Authentification

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

---

## 🎛️ Providers Globaux

Montés dans `main.jsx`, disponibles dans toute l'application :

```jsx
<DarkModeProvider>      {/* Gère le thème (localStorage + classe CSS) */}
  <ToastProvider>       {/* Système de notifications */}
    <App />             {/* Routing + auth */}
  </ToastProvider>
</DarkModeProvider>
```

| Provider | Rôle |
| :--- | :--- |
| `DarkModeProvider` | Gère l'état du dark mode et la classe `dark` sur `<html>`. |
| `ToastProvider` | Fournit `useToast()` pour les notifications dans toute l'app. |
