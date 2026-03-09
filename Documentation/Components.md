# 🧩 Documentation des Composants Réutilisables

Cette section détaille les composants UI partagés entre les différentes pages de l'application.

**Dossier :** `src/components/`

---

## 📌 Sidebar

Navigation latérale présente sur toutes les pages protégées.

### Comportement

| Écran | Affichage |
| :--- | :--- |
| **Desktop** (≥1024px) | Barre fixe de 72px, icônes de navigation. |
| **Mobile** (<1024px) | Cachée par défaut, bouton burger en haut à gauche. |

### Éléments de Navigation

| Icône | Route | Label | Accès |
| :--- | :--- | :--- | :--- |
| 🏠 | `/dashboard` | Accueil | Tous |
| 🧾 | `/invoices` | Factures | Tous |
| 👥 | `/users` | Utilisateurs | Admin uniquement |
| ⚙️ | `/setting` | Réglages | Tous |
| 🚪 | — | Déconnexion | Tous |

### Logique Clé
- `isAdmin()` : Décode le token JWT pour vérifier le rôle.
- `isActive(path)` : Compare `location.pathname` pour surligner l'item actif.
- L'avatar utilisateur est chargé au montage via `getUserByEmail`.

---

## 💬 Modal

Dialog centré avec backdrop semi-transparent et effet de flou.

### Props

| Prop | Type | Requis | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | boolean | ✅ | Afficher ou masquer la modal. |
| `onClose` | function | ✅ | Callback de fermeture. |
| `children` | ReactNode | ✅ | Contenu de la modal. |
| `className` | string | | Classes CSS additionnelles. |

### Comportement
- Fermeture au clic sur le backdrop.
- Bouton ✕ en haut à droite.
- Animation d'entrée (`modalIn` : montée + zoom léger).
- Scroll interne si contenu > 90vh.

---

## 📍 ActionsPopover

Menu contextuel positionné (bouton "trois points" des tableaux).

### Props

| Prop | Type | Requis | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | boolean | ✅ | Visibilité. |
| `onClose` | function | ✅ | Fermeture au clic extérieur. |
| `position` | `{ top, left }` | ✅ | Position absolue en pixels. |
| `children` | ReactNode | ✅ | Boutons d'action. |

---

## 📄 Pagination

Contrôles de pagination responsive.

| Écran | Affichage |
| :--- | :--- |
| **Mobile** | Boutons "Précédent" / "Suivant" + indicateur de page. |
| **Desktop** | Compteur de résultats + numéros de pages cliquables. |

> Se cache automatiquement si `totalPages ≤ 1`.

---

## 🔔 Toast (Notifications)

Système de notifications centralisé via React Context.

### Utilisation

```jsx
const toast = useToast();
toast.success('Facture ajoutée !');
toast.error('Erreur de connexion.');
toast.info('Information.');
```

### Types

| Méthode | Couleur | Icône | Durée |
| :--- | :--- | :--- | :--- |
| `success()` | Vert (emerald-600) | ✓ | 4 secondes |
| `error()` | Rouge (red-600) | ✕ | 4 secondes |
| `info()` | Noir (gray-900) | ℹ | 4 secondes |

### Logique Clé
- Les toasts sont empilés en haut à droite (`position: fixed`).
- Animation slide-in depuis la droite.
- Chaque toast a un ID unique et disparaît automatiquement.

---

## 💀 Skeleton (Loaders)

Placeholders animés affichés pendant le chargement des données.

### Composants Exportés

| Composant | Usage |
| :--- | :--- |
| `SkeletonLine` | Ligne de texte. |
| `SkeletonCard` | Carte statistique (label + nombre). |
| `SkeletonTable` | Tableau complet (header + N lignes). |
| `SkeletonProfile` | Carte profil (avatar + texte). |

---

## 📊 MiniChart (Graphe en Barres)

Graphe SVG pur (aucune librairie externe) affichant les dépenses des 6 derniers mois.

### Logique Clé
1. Génère les 6 derniers mois à partir de la date actuelle.
2. Agrège les factures par mois (nombre + montant).
3. Hauteur proportionnelle au montant maximum.
4. Tooltip au hover : montant + nombre de factures.

---

## 🍩 StatusDonut (Graphe Donut)

Graphe SVG pur affichant la répartition des factures par statut.

### Couleurs

| Statut | Couleur | Label |
| :--- | :--- | :--- |
| Validée | `#059669` (emerald) | Vert |
| En attente | `#d97706` (amber) | Orange |
| Rejetée | `#dc2626` (red) | Rouge |

### Logique Clé
- Segments calculés via `strokeDasharray` et `strokeDashoffset`.
- Total affiché au centre du donut.
- Légende avec pastilles colorées.

---

## 🌙 DarkMode

Context React pour la gestion du thème sombre.

### Utilisation

```jsx
const { isDark, toggle } = useDarkMode();
```

### Logique Clé

| Étape | Détail |
| :--- | :--- |
| 1. Lecture | Récupère le choix depuis `localStorage.getItem('darkMode')`. |
| 2. Application | Ajoute/retire la classe `dark` sur `<html>`. |
| 3. Persistance | Sauvegarde chaque changement dans `localStorage`. |
