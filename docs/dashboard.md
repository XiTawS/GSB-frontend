# Page Dashboard

**Fichier :** `src/features/dashboard/Dashboard.jsx`

Tableau de bord principal de l'application. C'est la première page affichée après la connexion.

---

## Structure de la page

```
┌──────────────────────────────────────────────┐
│  Bonjour, {prénom} 👋                        │
│  Voici un aperçu de vos notes de frais.      │
├──────────────────────────────────────────────┤
│  ┌──────┐  ┌──────────┐  ┌──────────┐       │
│  │Total │  │Montant   │  │En attente│       │
│  │  12  │  │ 450.00 € │  │    3     │       │
│  └──────┘  └──────────┘  └──────────┘       │
├──────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │  Mini graphe    │  │  Donut statuts  │   │
│  │  (6 mois)       │  │                 │   │
│  └─────────────────┘  └─────────────────┘   │
├──────────────────────────────────────────────┤
│  Dernières factures              [+ Ajouter] │
│  ┌───────────────────────────────────────┐   │
│  │  Table / Cards mobile                 │   │
│  └───────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

## State

| Variable | Type | Description |
|----------|------|-------------|
| `bills` | array | Toutes les factures |
| `loading` | boolean | Chargement en cours |
| `user` | object | Profil de l'utilisateur connecté |
| `selectedBill` | object | Facture sélectionnée (pour la modal détail) |
| `isDetailModalOpen` | boolean | Modal détail visible |
| `isAddModalOpen` | boolean | Modal ajout visible |
| `billsToShow` | number | Nombre de factures récentes affichées |

## Data fetching

### Chargement initial

```js
useEffect(() => { fetchBills(); }, [fetchBills]);
```

Au montage, toutes les factures sont récupérées via `getAllInvoices()`. Le profil utilisateur est chargé en parallèle pour afficher le prénom dans le header.

### Nombre de factures affichées

Le nombre s'adapte à la largeur de l'écran :
- `< 500px` → 3 factures
- `< 1024px` → 4 factures
- `≥ 1024px` → 6 factures

Mis à jour dynamiquement via un `resize` listener.

### Pull to refresh

Sur mobile, un swipe vers le bas (>100px) depuis le haut de la page déclenche un rechargement des données.

```js
const onTouchEnd = (e) => {
  const diff = e.changedTouches[0].clientY - startY;
  if (diff > 100 && window.scrollY === 0) fetchBills();
};
```

## Statistiques calculées

Toutes les stats sont calculées côté client à partir du tableau `bills` :

```js
const totalAmount = bills.reduce((acc, b) => acc + b.amount, 0);
const pendingCount = bills.filter(b => b.status === 'Pending').length;
```

## États de chargement

- **Chargement** : Skeleton cards + skeleton table
- **Aucune facture** : Empty state illustré avec bouton "Créer une facture"
- **Données chargées** : Stats + graphes + table

## Responsive

- **Desktop** : Table classique
- **Mobile** : Cards empilées avec titre, date, montant et badge de statut
