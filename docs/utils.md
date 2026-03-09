# Utilitaires

**Fichiers :**
- `src/utils/exportCSV.js`
- `src/styles/index.css`

---

## Export CSV — `exportCSV.js`

### `exportToCSV(bills, filename)`

Exporte un tableau de factures en fichier CSV téléchargeable.

**Paramètres :**
- `bills` : Tableau de factures (objets avec `title`, `date`, `amount`, `type`, `status`, `description`)
- `filename` : Nom du fichier (défaut : `factures.csv`)

### Fonctionnement

1. **Traduction des statuts** : `Approved` → `Validée`, etc.
2. **Construction du CSV** :
   - Séparateur : `;` (standard français pour Excel)
   - Les champs texte sont encadrés de guillemets doubles (échappement des `"` internes)
   - Les dates sont formatées en `dd/mm/yyyy`
3. **BOM UTF-8** : Le caractère `\uFEFF` est ajouté en début de fichier pour que Excel interprète correctement les accents
4. **Téléchargement** : Création d'un blob → URL temporaire → clic simulé sur un lien `<a>`

```js
const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
a.click();
URL.revokeObjectURL(url);
```

### Exemple de sortie

```csv
Titre;Date;Type;Montant;Statut;Description
"Restaurant client";07/03/2026;Repas;45.50;Validée;"Déjeuner avec le client X"
```

---

## Styles — `index.css`

### Tailwind

```css
@import "tailwindcss";
```

Import unique de Tailwind v4 (pas de `@tailwind base/components/utilities` comme en v3).

### Animations custom

| Classe | Effet | Usage |
|--------|-------|-------|
| `animate-slide-in` | Glisse depuis la droite | Toasts |
| `animate-fade-in` | Fondu d'apparition | Pages, tableaux |
| `animate-scale-in` | Zoom + fondu | Cards statistiques |
| `modalIn` (keyframe) | Montée + zoom léger | Modals |

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Dark mode

Le dark mode fonctionne via la classe `dark` sur `<html>`. Les overrides CSS ciblent les classes Tailwind spécifiques :

```css
.dark .bg-white { background-color: #1a1a2e; }
.dark .text-gray-900 { color: #f1f1f5; }
.dark input, .dark select, .dark textarea {
  background-color: #1a1a2e !important;
  border-color: #2a2a3e !important;
  color: #f1f1f5 !important;
}
```

**Palette dark mode :**

| Light | Dark |
|-------|------|
| `white` | `#1a1a2e` |
| `gray-50` | `#0f0f1a` |
| `gray-100` | `#1a1a2e` |
| `gray-200` (border) | `#2a2a3e` |
| `gray-900` (text) | `#f1f1f5` |

Les boutons primaires passent en bleu/violet (`#5050cc`) en dark mode pour maintenir le contraste.
