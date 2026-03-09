# Page Réglages

**Fichier :** `src/features/setting/Setting.jsx`

Page de modification du profil utilisateur et des préférences d'affichage.

---

## Structure de la page

```
┌──────────────────────────────────────┐
│  Réglages                            │
│  Modifiez vos informations.          │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │  [Avatar]  Prénom Nom          │  │
│  │            email@gsb.fr        │  │
│  │            Badge rôle          │  │
│  └────────────────────────────────┘  │
├──────────────────────────────────────┤
│  Informations personnelles  [Modif]  │
│  ┌───────────┐  ┌───────────┐        │
│  │ Prénom    │  │ Nom       │        │
│  │ Email     │  │ Mot de p. │        │
│  │ Rôle      │  │           │        │
│  └───────────┘  └───────────┘        │
│                      [Enregistrer]   │
├──────────────────────────────────────┤
│  Apparence                           │
│  Mode sombre               [Toggle]  │
└──────────────────────────────────────┘
```

## State

| Variable | Type | Description |
|----------|------|-------------|
| `user` | object | Données de l'utilisateur connecté |
| `isLoading` | boolean | Chargement du profil |
| `editMode` | boolean | Mode édition activé ou non |
| `form` | object | Valeurs du formulaire (`firstName`, `lastName`, `email`, `password`, `avatar`) |

## Chargement du profil

Au montage, le composant :
1. Décode le token JWT pour extraire l'email
2. Appelle `getUserByEmail(email)` pour récupérer le profil complet
3. Remplit le formulaire avec les données

## Mode édition

| État | Affichage |
|------|-----------|
| Lecture | Valeurs en texte brut |
| Édition | Inputs pré-remplis + bouton "Enregistrer" |

En mode édition :
- L'avatar devient cliquable pour uploader une nouvelle image
- Les champs sont modifiables sauf le rôle (affiché en lecture seule)
- "Annuler" restaure les valeurs originales depuis `user`

### Sauvegarde

```js
const handleSave = async (e) => {
  e.preventDefault();
  const updated = await updateUser(user.email, { ... });
  setUser(updated);
  setEditMode(false);
  toast.success('Profil mis à jour !');
};
```

## Modification de l'avatar

L'avatar peut être modifié de deux façons :
1. **Upload de fichier** : L'image est convertie en base64 via `FileReader` et stockée dans le champ `avatar` du body
2. **URL directe** : Si le backend stocke une URL S3

```js
const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => setForm(f => ({ ...f, avatar: reader.result }));
  reader.readAsDataURL(file);
};
```

## Dark mode

Section "Apparence" en bas de la page avec un toggle switch.

```jsx
const { isDark, toggle: toggleDarkMode } = useDarkMode();
```

Le toggle :
- Ajoute/retire la classe `dark` sur `<html>`
- Persiste le choix dans `localStorage`
- Affiche ☀️ ou 🌙 selon l'état

## États de chargement

- **Chargement** : Skeleton du profil (`SkeletonProfile`)
- **Erreur** : Message "Utilisateur non trouvé"
- **Données chargées** : Page complète
