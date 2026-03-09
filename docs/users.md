# Page Utilisateurs

**Fichiers concernés :**
- `src/features/users/UserList.jsx` — Page principale
- `src/features/users/components/` — Modals (5 fichiers)

---

## Page principale — `UserList.jsx`

Page d'administration des comptes utilisateurs. Accessible uniquement aux admins (la route est visible dans la sidebar seulement si `role === 'admin'`).

### State

| Variable | Type | Description |
|----------|------|-------------|
| `users` | array | Liste de tous les utilisateurs |
| `loading` | boolean | Chargement en cours |
| `searchQuery` | string | Texte de recherche |
| `currentPage` | number | Page actuelle |
| `usersPerPage` | number | Items par page (responsive) |
| `selectedUser` | object | Utilisateur sélectionné pour les modals |
| `isXxxModalOpen` | boolean | État de chaque modal |

### Recherche

Filtre en temps réel sur :
- Nom complet (`firstName + lastName`)
- Email
- Rôle

### Statistiques

Calculées côté client :
```js
const totalUsers = users.length;
const adminCount = users.filter(u => u.role === 'admin').length;
const userCount = users.filter(u => u.role === 'user').length;
```

### Tableau

| Colonne | Mobile | Desktop |
|---------|--------|---------|
| Avatar + Nom | ✅ | ✅ |
| Email (sous le nom) | ✅ (sous le nom) | ✅ (colonne dédiée) |
| Rôle (badge) | ✅ | ✅ |
| Actions (⋮) | ✅ | ✅ |

Les badges de rôle :
- **Admin** : fond violet (`bg-violet-50 text-violet-700`)
- **Utilisateur** : fond gris (`bg-gray-100 text-gray-600`)

### Avatars

Si l'utilisateur n'a pas d'avatar, un avatar généré est affiché via [UI Avatars](https://ui-avatars.com) :
```
https://ui-avatars.com/api/?name=Jean+Dupont&background=e5e7eb&color=6b7280&size=36
```

---

## Modals

### AddUserModal

Formulaire de création avec : prénom, nom, email, mot de passe, rôle.

**Générateur de mot de passe :**
```js
function generatePassword(length = 14) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=.,';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}
```

Le bouton "Générer" crée un mot de passe aléatoire de 14 caractères et l'affiche en clair.

### EditUserModal

Formulaire de modification : prénom, nom, email, rôle. Le mot de passe n'est pas modifiable ici (utiliser ResetPasswordModal à la place).

Appelle `onSave()` qui est géré par le parent (`handleEditUser`), permettant au parent de contrôler l'appel API et le rafraîchissement.

### ResetPasswordModal

Permet de définir un nouveau mot de passe pour un utilisateur. Inclut :
- Champ mot de passe avec toggle afficher/masquer
- Bouton "Générer un mot de passe sécurisé"

### DeleteConfirmationModal

Modal de confirmation de suppression avec :
- Icône de corbeille dans un cercle rouge
- Nom de l'utilisateur en gras
- Avertissement "Cette action est irréversible"
- Boutons "Annuler" et "Supprimer" (rouge)

### UserActionsModal

Menu contextuel (popover) avec :
- **Modifier** (admin uniquement)
- **Réinitialiser le mot de passe** (admin uniquement)
- **Supprimer** (en rouge)

---

## Notifications

La page utilise le système de Toast centralisé :

```js
const toast = useToast();
toast.success('Utilisateur supprimé.');
toast.error('Erreur lors de la modification.');
```

Les anciens messages de notification inline ont été remplacés par les toasts.
