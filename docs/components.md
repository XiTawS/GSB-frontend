# Composants partagés

**Dossier :** `src/components/`

Les composants partagés sont des éléments UI réutilisables, **sans logique métier**. Ils reçoivent leurs données via props et émettent des événements via callbacks.

---

## Sidebar — `Sidebar/Sidebar.jsx`

Navigation latérale de l'application, présente sur toutes les pages protégées.

### Comportement

- **Desktop (≥1024px)** : Barre fixe de 72px à gauche, affiche les icônes de navigation
- **Mobile (<1024px)** : Cachée par défaut, accessible via un bouton burger (fixé en haut à gauche). Un overlay semi-transparent s'affiche derrière la sidebar ouverte

### Navigation

Les éléments de navigation sont définis dans un tableau `NAV_ITEMS` :
```js
const NAV_ITEMS = [
  { path: '/dashboard', label: 'Accueil', icon: ..., },
  { path: '/invoices', label: 'Factures', icon: ..., },
  { path: '/users', label: 'Utilisateurs', adminOnly: true, icon: ..., },
];
```

- L'item "Utilisateurs" n'est affiché que si `isAdmin()` retourne `true`
- L'item actif est déterminé par `location.pathname.startsWith(path)`
- Le profil utilisateur est chargé au montage pour afficher l'avatar

### Footer

Contient : lien Réglages, bouton Déconnexion, avatar utilisateur.

---

## Modal — `Modal/Modal.jsx`

Dialog centré avec backdrop semi-transparent et flou.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Afficher ou non la modal |
| `onClose` | function | Callback de fermeture |
| `children` | ReactNode | Contenu de la modal |
| `className` | string | Classes CSS additionnelles |

### Comportement

- Se ferme au clic sur le backdrop
- Bouton ✕ en haut à droite
- Animation d'entrée via `@keyframes modalIn`
- Scroll interne si le contenu dépasse 90vh
- `e.stopPropagation()` sur le contenu pour éviter la fermeture au clic intérieur

---

## ActionsPopover — `ActionsPopover/ActionsPopover.jsx`

Menu contextuel positionné (utilisé pour les actions "trois points" dans les tableaux).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Visibilité |
| `onClose` | function | Fermeture |
| `position` | `{ top, left }` | Position absolue en pixels |
| `children` | ReactNode | Boutons d'action |

Le positionnement est calculé par le parent à partir du `getBoundingClientRect()` du bouton cliqué.

---

## Pagination — `Pagination/Pagination.jsx`

Contrôles de pagination responsive.

- **Mobile** : Boutons "Précédent" / "Suivant" + indicateur de page
- **Desktop** : Compteur de résultats + numéros de pages cliquables + flèches
- Se cache automatiquement si `totalPages ≤ 1`

---

## Toast — `Toast/ToastContext.jsx`

Système de notifications centralisé via React Context.

### Usage

```jsx
const toast = useToast();
toast.success('Facture ajoutée !');
toast.error('Erreur de connexion.');
toast.info('Information.');
```

### Fonctionnement

- Les toasts sont stockés dans un state du provider
- Chaque toast a un ID unique (timestamp + random) et disparaît après 4 secondes
- Rendu en `position: fixed` en haut à droite, empilés verticalement
- Animation slide-in depuis la droite

### Types

| Méthode | Couleur | Icône |
|---------|---------|-------|
| `success()` | Vert (emerald-600) | ✓ |
| `error()` | Rouge (red-600) | ✕ |
| `info()` | Noir (gray-900) | ℹ |

---

## Skeleton — `Skeleton/Skeleton.jsx`

Placeholders animés affichés pendant le chargement des données. Utilise `animate-pulse` de Tailwind.

### Composants exportés

| Composant | Usage |
|-----------|-------|
| `SkeletonLine` | Ligne de texte |
| `SkeletonCard` | Carte statistique |
| `SkeletonTable` | Tableau complet (header + lignes) |
| `SkeletonProfile` | Carte profil (avatar + texte) |

---

## DarkMode — `DarkMode/DarkModeContext.jsx`

Context React pour le thème sombre.

### Fonctionnement

1. **Lecture initiale** depuis `localStorage.getItem('darkMode')`
2. **Toggle** : ajoute/retire la classe `dark` sur `<html>`
3. **Persistance** : chaque changement est sauvegardé dans `localStorage`

Le fichier `index.css` contient les overrides CSS pour le dark mode (couleurs de fond, texte, bordures, inputs).

### Usage

```jsx
const { isDark, toggle } = useDarkMode();
```

---

## MiniChart — `MiniChart/MiniChart.jsx`

Bar chart SVG pur (aucune librairie externe) affichant les dépenses des 6 derniers mois.

### Fonctionnement

1. Génère les 6 derniers mois à partir de `new Date()`
2. Agrège les factures par mois (count + amount)
3. Calcule la hauteur de chaque barre proportionnellement au max
4. Affiche un tooltip au hover avec le montant et le nombre de factures

---

## StatusDonut — `StatusDonut/StatusDonut.jsx`

Donut chart SVG pur affichant la répartition des factures par statut.

### Fonctionnement

1. Compte les factures par statut (Approved, Pending, Rejected)
2. Calcule les segments du cercle SVG via `strokeDasharray` et `strokeDashoffset`
3. Le total est affiché au centre du donut
4. Une légende avec pastilles colorées est affichée à côté

### Couleurs

| Statut | Couleur |
|--------|---------|
| Validée | `#059669` (emerald) |
| En attente | `#d97706` (amber) |
| Rejetée | `#dc2626` (red) |
