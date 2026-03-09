# 🖥️ Documentation des Pages (Interface Utilisateur)

Cette section décrit les pages principales de l'application.

---

## 🔐 Login

![Page de Connexion]

Le point d'entrée de l'application.

### Fonctionnalités
- **Authentification** : Connexion par email et mot de passe via `POST /auth/login`.
- **Redirection** : Redirige vers `/dashboard` après connexion réussie.
- **Mot de passe oublié** : Modal d'envoi d'email de réinitialisation.
- **Avertissement** : Bandeau informant du cold start du backend Render.

### Logique Clé
- Le token JWT reçu est stocké dans `localStorage`.
- La fonction `onLogin(token)` met à jour l'état d'authentification dans `App.jsx`.

---

## 📊 Dashboard

Le tableau de bord principal, première page affichée après connexion.

### Fonctionnalités
- **Statistiques** : 3 cartes (Total factures, Montant total, En attente).
- **Graphe Barres** : Dépenses des 6 derniers mois (composant `MiniChart`).
- **Graphe Donut** : Répartition par statut — validées, en attente, rejetées (composant `StatusDonut`).
- **Dernières Factures** : Table des factures récentes avec clic pour voir le détail.
- **Pull to Refresh** : Swipe vers le bas sur mobile pour rafraîchir les données.

### Logique Clé
- `fetchBills()` : Récupère toutes les factures et les statistiques sont calculées côté client.
- `billsToShow` : Le nombre de factures affichées s'adapte à la largeur de l'écran (3 → 4 → 6).

---

## 🧾 Factures

Page complète de gestion des factures.

### Fonctionnalités
- **Statistiques** : 4 cartes (Total, Montant, Validées, En attente).
- **Recherche** : Filtre en temps réel sur titre, type, description, montant.
- **Filtre par statut** : Dropdown (Tous / Validées / Rejetées / En attente).
- **Tri des colonnes** : Clic sur Titre, Date, Montant ou Statut pour trier (asc/desc).
- **Export CSV** : Télécharge les factures filtrées au format CSV.
- **Pagination** : Responsive (boutons mobile / numéros desktop).
- **Pull to Refresh** : Swipe sur mobile.

### Modales

| Modale | Déclencheur | Description |
| :--- | :--- | :--- |
| `AddBillModal` | Bouton "+ Ajouter" | Formulaire de création (titre, date, montant, type, description, justificatif). |
| `BillModal` | Clic sur une ligne | Affichage détaillé en lecture seule avec justificatif. |
| `EditBillModal` | Menu actions → Modifier | Formulaire pré-rempli pour modification. |
| `ChangeStatusModal` | Menu actions → Changer le statut | Select avec les 3 statuts (admin uniquement). |
| `BillActionsModal` | Bouton ⋮ (trois points) | Menu contextuel : Modifier, Changer statut, Supprimer. |

### Logique Clé
- **Pipeline de données** : `bills` → tri par date → filtre statut/recherche → pagination → affichage.
- **Responsive** : Table HTML sur desktop, cards empilées sur mobile (breakpoint `sm`).

---

## 👥 Utilisateurs (Admin)

Page d'administration des comptes. Accessible uniquement aux administrateurs.

### Fonctionnalités
- **Statistiques** : 3 cartes (Total, Administrateurs, Utilisateurs).
- **Recherche** : Filtre sur nom, email, rôle.
- **Table** : Avatar, nom complet, email, badge de rôle, bouton actions.
- **Pagination** : Même composant que la page Factures.

### Modales

| Modale | Déclencheur | Description |
| :--- | :--- | :--- |
| `AddUserModal` | Bouton "+ Ajouter" | Formulaire de création avec générateur de mot de passe. |
| `EditUserModal` | Menu actions → Modifier | Modification du prénom, nom, email, rôle. |
| `ResetPasswordModal` | Menu actions → Réinitialiser | Nouveau mot de passe avec générateur sécurisé. |
| `DeleteConfirmationModal` | Menu actions → Supprimer | Confirmation avec avertissement "action irréversible". |
| `UserActionsModal` | Bouton ⋮ (trois points) | Menu contextuel : Modifier, Réinitialiser, Supprimer. |

### Logique Clé
- **Badges de rôle** : Admin → violet (`bg-violet-50`), Utilisateur → gris (`bg-gray-100`).
- **Avatars générés** : Si pas d'avatar, utilisation de [UI Avatars](https://ui-avatars.com) avec les initiales.
- **Notifications** : Toasts centralisés pour toutes les actions CRUD.

---

## ⚙️ Réglages

Page de modification du profil utilisateur et des préférences.

### Fonctionnalités
- **Carte profil** : Avatar, nom complet, email, badge de rôle.
- **Mode édition** : Toggle pour passer en mode modification.
- **Modification avatar** : Clic sur l'avatar en mode édition pour uploader une image.
- **Champs modifiables** : Prénom, nom, email, mot de passe.
- **Dark mode** : Toggle switch pour activer/désactiver le thème sombre.

### Logique Clé
- `editMode` : Bascule entre affichage texte brut et inputs.
- `handleAvatarChange` : Convertit l'image uploadée en base64 via `FileReader`.
- `handleSave` : Envoie les modifications via `updateUser()` et affiche un toast de confirmation.
