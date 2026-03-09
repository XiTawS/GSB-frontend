# Architecture générale

## Stack

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 19 | UI library (composants, state, hooks) |
| Vite | 6.3 | Build tool & dev server (HMR) |
| Tailwind CSS | 4 | Styling utility-first |
| React Router | 7 | Navigation SPA |

## Structure des dossiers

```
src/
├── main.jsx                    # Montage React + providers globaux
├── App.jsx                     # Routing + gestion auth
│
├── services/                   # Couche communication API
│   ├── api.js                  # Fetch wrapper centralisé
│   ├── invoiceService.js       # Opérations CRUD factures
│   └── userService.js          # Opérations CRUD utilisateurs
│
├── components/                 # Composants réutilisables (UI pure)
│   ├── Sidebar/                # Navigation latérale
│   ├── Modal/                  # Dialog modal générique
│   ├── Pagination/             # Contrôles de pages
│   ├── ActionsPopover/         # Menu contextuel
│   ├── Toast/                  # Notifications
│   ├── Skeleton/               # Placeholders de chargement
│   ├── DarkMode/               # Context dark mode
│   ├── MiniChart/              # Graphe barres
│   └── StatusDonut/            # Graphe donut
│
├── features/                   # Pages (logique métier)
│   ├── auth/                   # Login, reset password
│   ├── dashboard/              # Tableau de bord
│   ├── invoices/               # Factures + sous-composants
│   ├── users/                  # Utilisateurs + sous-composants
│   └── setting/                # Réglages profil
│
├── utils/                      # Fonctions utilitaires
│   └── exportCSV.js
│
└── styles/
    └── index.css               # Tailwind + animations + dark mode
```

## Séparation des responsabilités

| Couche | Contient | Ne contient pas |
|--------|----------|-----------------|
| `services/` | Appels HTTP, gestion du token | Logique UI, state React |
| `components/` | UI réutilisable, sans logique métier | Appels API, routing |
| `features/` | Pages complètes, state local, logique métier | Code réutilisable entre pages |
| `utils/` | Fonctions pures (export, formatage) | Dépendances React |

## Providers globaux

Montés dans `main.jsx`, disponibles dans toute l'application :

```jsx
<DarkModeProvider>      // Gère le thème (localStorage + classe CSS)
  <ToastProvider>       // Système de notifications
    <App />             // Routing + auth
  </ToastProvider>
</DarkModeProvider>
```

## Conventions

- **Pas de CSS custom** : tout est en classes Tailwind
- **Un fichier = un composant** : pas de composants multiples par fichier
- **Commentaires JSDoc** en tête de chaque fichier
- **Sections balisées** dans les gros composants : `// ── State ──`, `// ── Render ──`
- **Code en anglais**, interface et commentaires en français
