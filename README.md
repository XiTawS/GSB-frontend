# GSB — Gestion des Notes de Frais

**GSB** (Galaxy Swiss Bourdin) est une application web de gestion de notes de frais destinée aux entreprises pharmaceutiques. Elle permet aux employés de soumettre leurs frais professionnels et aux administrateurs de les valider ou rejeter.

## Présentation

L'application se compose de deux parties :
- **Frontend** → Ce repository (React / Vite / Tailwind)
- **Backend** → [GSB-backend](https://github.com/XiTawS/GSB-backend) (Node.js / Express / MongoDB)

### Pour les employés

- Soumettre une note de frais avec un justificatif (photo, scan, PDF)
- Suivre le statut de chaque demande (en attente, validée, rejetée)
- Modifier son profil et son mot de passe

### Pour les administrateurs

- Valider ou rejeter les notes de frais
- Gérer les comptes utilisateurs (création, modification, suppression)
- Vue globale sur l'ensemble des factures avec statistiques

### Fonctionnalités de l'interface

| Fonctionnalité | Description |
|----------------|-------------|
| 📊 Dashboard | Statistiques, graphe des dépenses, répartition par statut |
| 🧾 Factures | Liste, recherche, filtre par statut, tri par colonne, pagination |
| 📥 Export CSV | Télécharger les factures filtrées au format CSV |
| 👥 Utilisateurs | Gestion des comptes (admin uniquement) |
| ⚙️ Réglages | Modifier profil, avatar, mot de passe |
| 🌙 Dark mode | Thème sombre activable dans les réglages |
| 📱 Responsive | Interface adaptée mobile, tablette et desktop |

## Démarrage rapide

```bash
git clone https://github.com/XiTawS/GSB-frontend.git
cd GSB-frontend
npm install
cp .env.example .env   # Configurer VITE_API_URL
npm run dev             # Développement
npm run build           # Build production
```

### Variable d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL du backend | `https://gsb-backend-946k.onrender.com` |

## Déploiement

- **Frontend** : [Vercel](https://vercel.com) — `https://gsb-frontend-six.vercel.app`
- **Backend** : [Render](https://render.com) — `https://gsb-backend-946k.onrender.com`

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@gsb.fr` | `admin123` |
| Utilisateur | `user@gsb.fr` | `user123` |

> ⏳ La première connexion peut prendre 1-2 minutes (démarrage à froid du serveur Render).

## Documentation technique

📖 Voir le dossier [`docs/`](./docs/) pour la documentation technique détaillée de chaque module.
