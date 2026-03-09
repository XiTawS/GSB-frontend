# 🧾 GSB Frontend - Interface de Gestion des Notes de Frais

Bienvenue dans la documentation du projet **GSB Frontend**. Cette application web React permet aux employés de soumettre leurs notes de frais et aux administrateurs de les gérer.

---

## 📚 Contenu de la Documentation
La documentation est divisée en sections pour une meilleure lisibilité :

### 🖥️ Interface Utilisateur
Détaille les pages et la logique d'interaction (Connexion, Dashboard, Factures, Utilisateurs, Réglages).
[Documentation des Pages](Documentation/Pages.md)

### 🔌 Services API
Détails techniques sur la communication entre le frontend et le backend.
[Documentation des Services](Documentation/Services.md)

### 🧩 Composants Réutilisables
Détails sur les composants UI partagés (Sidebar, Modal, Toast, Charts, etc.).
[Documentation des Composants](Documentation/Components.md)

### 🔐 Authentification & Routing
Gestion de l'authentification JWT côté client et protection des routes.
[Documentation Routing](Documentation/Routing.md)

### 🛠️ Utilitaires
Fonctions utilitaires (Export CSV, animations, dark mode).
[Documentation Utilitaires](Documentation/Utils.md)

---

## 🚀 Démarrage Rapide

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/XiTawS/GSB-frontend.git
   cd GSB-frontend
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer le backend** :
   ```bash
   cp .env.example .env
   ```
   > Renseignez `VITE_API_URL` avec l'URL de votre backend.

4. **Lancer en développement** :
   ```bash
   npm run dev
   ```

5. **Build production** :
   ```bash
   npm run build
   ```

---

## 🛠️ Stack Technique

| Technologie | Rôle |
| :--- | :--- |
| **React 19** | Bibliothèque UI (composants, hooks). |
| **Vite 6** | Build tool & serveur de développement (HMR). |
| **Tailwind CSS 4** | Styling utility-first. |
| **React Router 7** | Navigation SPA (Single Page Application). |

---

## ⚙️ Variable d'Environnement

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL du backend API | `https://gsb-backend-946k.onrender.com` |

---

## 🏗️ Architecture

```
src/
├── main.jsx                      # Montage React + providers globaux
├── App.jsx                       # Routing + gestion auth
│
├── services/                     # Communication avec le backend
│   ├── api.js                    # Fetch wrapper (auth, base URL)
│   ├── invoiceService.js         # CRUD factures
│   └── userService.js            # CRUD utilisateurs
│
├── components/                   # Composants réutilisables
│   ├── Sidebar/                  # Navigation latérale
│   ├── Modal/                    # Dialog modal
│   ├── Pagination/               # Contrôles de pages
│   ├── ActionsPopover/           # Menu contextuel
│   ├── Toast/                    # Notifications
│   ├── Skeleton/                 # Placeholders de chargement
│   ├── DarkMode/                 # Toggle thème sombre
│   ├── MiniChart/                # Graphe en barres
│   └── StatusDonut/              # Graphe en donut
│
├── features/                     # Pages (logique métier)
│   ├── auth/                     # Login, reset password
│   ├── dashboard/                # Tableau de bord
│   ├── invoices/                 # Factures + modals
│   ├── users/                    # Utilisateurs + modals
│   └── setting/                  # Réglages profil
│
├── utils/
│   └── exportCSV.js              # Export CSV côté client
│
└── styles/
    └── index.css                 # Tailwind + animations + dark mode
```

---

## 🎯 Fonctionnalités

| Fonctionnalité | Description |
| :--- | :--- |
| 📊 **Dashboard** | Statistiques, graphe des dépenses, répartition par statut. |
| 🧾 **Factures** | Liste, recherche, filtre par statut, tri par colonne, pagination. |
| 📥 **Export CSV** | Téléchargement des factures filtrées au format CSV. |
| 👥 **Utilisateurs** | Gestion des comptes (admin uniquement). |
| ⚙️ **Réglages** | Modification du profil, avatar, mot de passe. |
| 🌙 **Dark mode** | Thème sombre activable dans les réglages. |
| 📱 **Responsive** | Interface adaptée mobile, tablette et desktop. |
| 🔔 **Notifications** | Toasts pour toutes les actions (succès / erreur). |
| ⬇️ **Pull to refresh** | Rafraîchissement par swipe sur mobile. |

---

## 🌐 Déploiement

| Service | Plateforme | URL |
| :--- | :--- | :--- |
| **Frontend** | Vercel | `https://gsb-frontend-six.vercel.app` |
| **Backend** | Render | `https://gsb-backend-946k.onrender.com` |

---

## 👤 Comptes de Test

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@gsb.fr` | `admin123` |
| **Utilisateur** | `user@gsb.fr` | `user123` |

> [!WARNING]
> La première connexion peut prendre 1 à 2 minutes (démarrage à froid du backend Render en plan gratuit).
