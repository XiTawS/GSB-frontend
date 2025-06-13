# GSB Frontend

## 📝 Description
Ce projet est l'interface utilisateur frontend de l'application GSB. Il s'agit d'une application web de gestion de notes de frais développée avec React et Vite.

## 🌐 Site Web 
Le site est accessible à l'adresse suivante : [https://gsb-frontend-six.vercel.app](https://gsb-frontend-six.vercel.app)

## ⚠️ Note Importante
Lors de la première connexion, le temps de chargement peut être plus long (2-3 minutes) car le backend est hébergé sur Render et nécessite un temps de démarrage. Cette situation est normale et temporaire, une fois le backend démarré, les connexions suivantes seront beaucoup plus rapides.

## 🏗️ Architecture du Projet
Le projet suit une architecture modulaire organisée comme suit :

```
src/
├── assets/        # Ressources statiques (images, icônes, etc.)
├── components/    # Composants réutilisables
├── features/      # Fonctionnalités spécifiques de l'application
├── services/      # Services pour la communication avec l'API
└── styles/        # Fichiers de style globaux
```

## 🛠️ Technologies Utilisées
- React
- Vite
- JavaScript/JSX
- CSS/Tailwind

## 📋 Prérequis
- Node.js (version recommandée : 18.x ou supérieure)
- npm ou yarn

## 🚀 Installation
1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Lancez l'application en mode développement :
```bash
npm run dev
# ou
yarn dev
```

## 🔑 Identifiants de Test
Pour tester l'application, vous pouvez utiliser les identifiants suivants :

### 👤 Utilisateur
- Email : user@gsb.fr
- Mot de passe : user123

### 👑 Administrateur
- Email : admin@gsb.fr
- Mot de passe : admin123

## ⭐ Fonctionnalités Principales
- 🔐 Authentification des utilisateurs
- 📊 Gestion des fiches de frais
- ✅ Validation des notes de frais
- 📱 Tableau de bord personnalisé selon le rôle
- 📱 Interface responsive