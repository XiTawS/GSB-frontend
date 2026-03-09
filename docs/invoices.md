# Page Factures

**Fichiers concernés :**
- `src/features/invoices/Invoices.jsx` — Page principale
- `src/features/invoices/FacturesTable.jsx` — Tableau triable + cards mobile
- `src/features/invoices/InvoicesFilters.jsx` — Barre de filtres + export CSV
- `src/features/invoices/components/` — Modals (5 fichiers)

---

## Page principale — `Invoices.jsx`

Page complète de gestion des factures avec CRUD, recherche, filtres, tri, pagination et export.

### State

| Variable | Type | Description |
|----------|------|-------------|
| `bills` | array | Toutes les factures brutes |
| `loading` | boolean | Chargement en cours |
| `filterStatus` | string | Filtre actif (`"All"`, `"Approved"`, `"Rejected"`, `"Pending"`) |
| `searchQuery` | string | Texte de recherche |
| `currentPage` | number | Page actuelle |
| `billsPerPage` | number | Items par page (responsive) |
| `selectedBill` | object | Facture sélectionnée pour les modals |
| `users` | array | Liste des utilisateurs (pour afficher le demandeur) |
| `userRole` | string | Rôle de l'utilisateur connecté |
| `isXxxModalOpen` | boolean | État de chaque modal (detail, add, edit, status, actions) |

### Pipeline de données

```
bills (brut)
  │
  ▼
sortedBills (trié par date décroissante)
  │
  ▼
filteredBills (filtré par statut + recherche texte)
  │
  ▼
currentBills (paginé : slice indexOfFirst → indexOfLast)
  │
  ▼
FacturesTable (affichage + tri local)
```

### Recherche

La recherche est en **temps réel** (pas de debounce). Elle filtre sur :
- `title` (titre)
- `type` (type de dépense)
- `description`
- `amount` (montant, converti en string)

### Actions CRUD

| Action | Fonction | Toast |
|--------|----------|-------|
| Ajouter | `onSave` callback depuis AddBillModal | "Facture ajoutée !" |
| Modifier | `handleEditBill()` → `updateInvoice()` | "Facture modifiée." |
| Changer statut | `handleChangeStatus()` → `updateInvoice()` | "Statut mis à jour." |
| Supprimer | `handleDeleteBill()` → `deleteInvoice()` | "Facture supprimée." |

Après chaque action, `refreshBills()` recharge la liste complète.

---

## Tableau — `FacturesTable.jsx`

### Tri des colonnes

Un clic sur un header de colonne trie les données. Un second clic inverse l'ordre.

```js
const handleSort = (key) => {
  if (sortKey === key) {
    setSortDir(d => d === 'asc' ? 'desc' : 'asc');
  } else {
    setSortKey(key);
    setSortDir('asc');
  }
};
```

**Colonnes triables :** `title`, `date`, `amount`, `status`

Le tri est **local** (sur la page courante uniquement) et ne modifie pas les données sources.

### Icône de tri

Une flèche (`▲`) indique la colonne triée. Elle est retournée de 180° pour le tri descendant via `rotate-180`.

### Responsive : table vs cards

| Écran | Rendu |
|-------|-------|
| ≥640px (sm) | Table HTML classique |
| <640px | Cards empilées |

Les deux vues utilisent les mêmes données et les mêmes callbacks. La card affiche : titre, date, type, montant, statut et bouton actions.

---

## Filtres — `InvoicesFilters.jsx`

Barre de filtres au-dessus du tableau.

| Élément | Description |
|---------|-------------|
| Champ de recherche | Input avec icône loupe, filtre en temps réel |
| Select statut | Dropdown : Tous / Validées / Rejetées / En attente |
| Bouton CSV | Télécharge les factures filtrées en CSV |
| Bouton Ajouter | Ouvre la modal d'ajout |

Le bouton CSV n'apparaît que si `filteredBills.length > 0`.

---

## Modals

### AddBillModal

Formulaire de création avec les champs : titre, date, montant, type, description, justificatif.

- Reset automatique à la fermeture
- Focus auto sur le premier champ à l'ouverture
- Preview de l'image uploadée
- Indicateur "PDF sélectionné" pour les fichiers PDF

### BillModal

Affichage en lecture seule des détails d'une facture. Affiche le justificatif (image inline ou lien PDF).

### EditBillModal

Même formulaire que AddBillModal mais pré-rempli avec les données existantes.

### ChangeStatusModal

Select simple avec 3 options (En attente / Validée / Rejetée).

### BillActionsModal

Menu contextuel (popover) avec les actions : Modifier, Changer le statut, Supprimer. Les options admin (Modifier, Changer statut) ne s'affichent que pour les admins. La suppression demande confirmation via `window.confirm`.

---

## Mapping des statuts

Les statuts internes (`Approved`, `Pending`, `Rejected`) sont traduits pour l'affichage :

```js
const STATUS_MAP = {
  Approved: { label: 'Validée',    cls: 'bg-emerald-50 text-emerald-700' },
  Rejected: { label: 'Rejetée',    cls: 'bg-red-50 text-red-700' },
  Pending:  { label: 'En attente', cls: 'bg-amber-50 text-amber-700' },
};
```

Ce mapping est défini dans `FacturesTable.jsx` et `Dashboard.jsx`.
