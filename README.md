# GSB Frontend

Interface web pour la gestion des notes de frais — Galaxy Swiss Bourdin.

## Stack technique

| Technologie | Rôle |
|-------------|------|
| **React 19** | UI library |
| **Vite 6** | Build tool |
| **Tailwind CSS 4** | Styling (utility-first) |
| **React Router 7** | Routing SPA |

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/XiTawS/GSB-frontend.git
cd GSB-frontend

# 2. Installer les dépendances
npm install

# 3. Configurer l'URL du backend
cp .env.example .env
# → Remplir VITE_API_URL

# 4. Lancer en développement
npm run dev

# 5. Build production
npm run build
```

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL du backend API | `https://gsb-backend-946k.onrender.com` |

## Architecture

```
src/
├── main.jsx                      # Point d'entrée, providers (Toast, DarkMode)
├── App.jsx                       # Routing + auth state
│
├── services/                     # Couche API
│   ├── api.js                    # Fetch wrapper (auth, base URL)
│   ├── invoiceService.js         # CRUD factures
│   └── userService.js            # CRUD utilisateurs
│
├── components/                   # Composants réutilisables
│   ├── Sidebar/Sidebar.jsx       # Navigation latérale (responsive)
│   ├── Modal/Modal.jsx           # Dialog modal générique
│   ├── Pagination/Pagination.jsx # Contrôles de pagination
│   ├── ActionsPopover/           # Menu contextuel positionné
│   ├── Toast/ToastContext.jsx    # Système de notifications
│   ├── Skeleton/Skeleton.jsx     # Placeholders de chargement
│   ├── DarkMode/DarkModeContext  # Toggle dark mode
│   ├── MiniChart/MiniChart.jsx   # Bar chart des dépenses
│   └── StatusDonut/StatusDonut   # Donut chart par statut
│
├── features/                     # Pages / domaines métier
│   ├── auth/
│   │   ├── Login.jsx             # Page de connexion
│   │   └── ResetPassword.jsx     # Réinitialisation mot de passe
│   ├── dashboard/
│   │   └── Dashboard.jsx         # Tableau de bord
│   ├── invoices/
│   │   ├── Invoices.jsx          # Page factures (list, filter, CRUD)
│   │   ├── FacturesTable.jsx     # Tableau triable + cards mobile
│   │   ├── InvoicesFilters.jsx   # Recherche, filtre, export CSV
│   │   └── components/           # Modals (add, edit, detail, status, actions)
│   ├── users/
│   │   ├── UserList.jsx          # Page utilisateurs (admin)
│   │   └── components/           # Modals (add, edit, delete, reset pwd, actions)
│   └── setting/
│       └── Setting.jsx           # Réglages profil + dark mode
│
├── utils/
│   └── exportCSV.js              # Export CSV côté client
│
└── styles/
    └── index.css                 # Tailwind + animations + dark mode
```

## Pages

| Route | Page | Accès |
|-------|------|-------|
| `/login` | Connexion | Public |
| `/reset-password/:token` | Reset mot de passe | Public |
| `/dashboard` | Tableau de bord | Authentifié |
| `/invoices` | Gestion des factures | Authentifié |
| `/users` | Gestion des utilisateurs | Admin |
| `/setting` | Réglages du profil | Authentifié |

## Fonctionnalités

### Général
- **Authentification JWT** — vérification client-side (expiration)
- **Routing protégé** — redirection auto vers `/login` si non authentifié
- **Dark mode** — toggle dans Réglages, persiste en localStorage
- **Toast notifications** — feedback centralisé pour toutes les actions
- **Skeleton loaders** — placeholders animés pendant le chargement
- **Animations** — fade-in, scale-in, slide-in sur les pages et modals
- **Responsive** — mobile-first, sidebar burger, cards mobile

### Dashboard
- Statistiques (total factures, montant, en attente)
- Mini graphe des dépenses sur 6 mois
- Donut chart de répartition par statut
- Dernières factures (table desktop / cards mobile)

### Factures
- Recherche par titre, type, description, montant
- Filtre par statut (Tous / Validées / Rejetées / En attente)
- **Tri des colonnes** — clic sur titre, date, montant, statut
- **Export CSV** — téléchargement des factures filtrées
- **Pull to refresh** — swipe mobile pour rafraîchir
- Pagination responsive
- CRUD complet avec modals (ajouter, modifier, détail, changer statut, supprimer)
- Upload de justificatifs (image/PDF)

### Utilisateurs (admin)
- Liste avec avatar, nom, email, rôle
- Recherche
- CRUD complet (ajouter, modifier, supprimer)
- Réinitialisation de mot de passe avec générateur

### Réglages
- Modification du profil (nom, email, avatar, mot de passe)
- Toggle dark mode

## Composants réutilisables

| Composant | Description |
|-----------|-------------|
| `Modal` | Dialog centré avec backdrop, fermeture au clic/Escape |
| `ActionsPopover` | Menu contextuel positionné (trois points) |
| `Pagination` | Prev/next mobile, numéros desktop |
| `Skeleton` | Cards, tables, profil en placeholder |
| `Toast` | Notifications success/error/info (context provider) |
| `MiniChart` | Bar chart SVG pur (pas de lib externe) |
| `StatusDonut` | Donut chart SVG pur |

## Design system

- **Couleurs** : gray scale, emerald (succès), amber (attente), red (erreur), violet (admin)
- **Radius** : `rounded-xl` partout
- **Spacing** : Tailwind utilities, gap-4, p-4/p-5/p-6
- **Typography** : system font via Tailwind
- **Statuts traduits** : Validée, Rejetée, En attente (mapping interne Approved/Rejected/Pending)

## Déploiement

Le frontend est déployé sur **Vercel** :
- Auto-deploy depuis `main`
- URL : `https://gsb-frontend-six.vercel.app`

Variable d'environnement Vercel :
```
VITE_API_URL=https://gsb-backend-946k.onrender.com
```

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@gsb.fr` | `admin123` |
| User | `user@gsb.fr` | `user123` |

> ⏳ La première connexion peut prendre 1-2 min (cold start du backend Render).
