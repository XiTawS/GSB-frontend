# 🛠️ Documentation Utilitaires

Cette section détaille les fonctions utilitaires et la configuration CSS.

**Fichiers concernés :**
- `src/utils/exportCSV.js`
- `src/styles/index.css`

---

## 📥 Export CSV — `exportCSV.js`

### Méthode

| Méthode | Paramètres | Description |
| :--- | :--- | :--- |
| `exportToCSV(bills, filename)` | `bills`: tableau de factures, `filename`: nom du fichier (défaut: `factures.csv`) | Génère et télécharge un fichier CSV. |

### Fonctionnement

| Étape | Détail |
| :--- | :--- |
| 1. Traduction | Les statuts anglais sont traduits (`Approved` → `Validée`, etc.). |
| 2. Formatage | Dates en `dd/mm/yyyy`, montants en `0.00`. |
| 3. Séparateur | Point-virgule (`;`) — standard français pour Excel. |
| 4. Encodage | BOM UTF-8 (`\uFEFF`) pour les accents dans Excel. |
| 5. Téléchargement | Création d'un blob → URL temporaire → clic simulé sur un `<a>`. |

### Exemple de Sortie

```csv
Titre;Date;Type;Montant;Statut;Description
"Restaurant client";07/03/2026;Repas;45.50;Validée;"Déjeuner avec le client X"
```

> [!IMPORTANT]
> Les champs texte sont encadrés de guillemets doubles pour gérer les caractères spéciaux. Les guillemets internes sont échappés par doublement (`"""`).

---

## 🎨 Styles — `index.css`

### Configuration Tailwind

```css
@import "tailwindcss";
```

Import unique de Tailwind v4 (syntaxe simplifiée, pas de `@tailwind base/components/utilities`).

---

### ✨ Animations Custom

| Classe | Animation | Durée | Usage |
| :--- | :--- | :--- | :--- |
| `animate-slide-in` | Glissement depuis la droite. | 300ms | Toasts (notifications). |
| `animate-fade-in` | Fondu d'apparition. | 200ms | Pages, tableaux. |
| `animate-scale-in` | Zoom + fondu. | 200ms | Cartes statistiques. |
| `modalIn` (keyframe) | Montée + zoom léger. | 200ms | Modals. |

---

### 🌙 Dark Mode CSS

Le dark mode fonctionne via la classe `dark` ajoutée sur `<html>` par le `DarkModeProvider`.

Les overrides CSS ciblent les classes Tailwind spécifiques :

**Palette de Couleurs :**

| Élément | Light | Dark |
| :--- | :--- | :--- |
| Background principal | `white` | `#1a1a2e` |
| Background page | `gray-50` | `#0f0f1a` |
| Background secondaire | `gray-100` | `#1a1a2e` |
| Bordures | `gray-200` | `#2a2a3e` |
| Texte principal | `gray-900` | `#f1f1f5` |
| Texte secondaire | `gray-500` | `#8888a0` |
| Boutons primaires | `gray-900` | `#5050cc` |

**Inputs :**
```css
.dark input, .dark select, .dark textarea {
  background-color: #1a1a2e !important;
  border-color: #2a2a3e !important;
  color: #f1f1f5 !important;
}
```

> [!WARNING]
> Les overrides utilisent `!important` sur les inputs pour garantir la cohérence visuelle, car certaines classes Tailwind ont une spécificité élevée.
