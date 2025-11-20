# Visual Editor - Documentation Technique Complète

## 📋 Vue d'ensemble

**Projet:** @boxraiser/visual-editor
**Version:** 0.1.3
**Type:** Éditeur visuel de page par blocs avec prévisualisation en temps réel
**Tech Stack Actuel:** React 18 + TypeScript + Zustand + Emotion + Vite
**Architecture:** Monorepo avec pnpm workspaces

---

## 🎯 Fonctionnalités Principales

### Éditeur de Blocs
- **Drag & Drop:** Réorganisation des composants via @dnd-kit
- **Ajout/Suppression:** Interface modale pour sélectionner et ajouter des blocs
- **Undo/Rollback:** Système d'annulation avec notification
- **Focus Management:** Sélection et édition de blocs individuels
- **Catégories:** Organisation des composants par catégories avec filtres

### Système de Champs
15 types de champs disponibles:
- **Text:** Input simple/multilignes
- **HTMLText:** Éditeur riche (Tiptap) avec formatage complet
- **Checkbox:** Toggle booléen
- **Select:** Menu déroulant
- **Number:** Input numérique
- **Range:** Slider
- **Color:** Sélecteur de couleur
- **DatePicker:** Sélecteur de date
- **ImageUrl:** Upload/sélection d'image
- **Alignment:** Alignement horizontal + vertical
- **TextAlign:** Alignement de texte (gauche/centre/droite)
- **Repeater:** Liste éditable (array)
- **Tabs:** Groupes de champs avec onglets
- **Row:** Layout horizontal de champs

### Prévisualisation Temps Réel
- **Iframe Isolated:** Prévisualisation dans iframe avec portail React
- **Responsive:** Bascule Desktop/Mobile
- **Live Update:** Mise à jour instantanée via POST au serveur
- **Cross-frame Communication:** PostMessage pour interaction entre editor et preview

### Templates
- **Système de modèles:** Pages pré-configurées
- **Import/Export:** Sauvegarde et chargement de configurations

---

## 🏗️ Architecture

### Structure du Projet

```
visual-editor/
├── visual-editor/              # Package principal
│   ├── src/
│   │   ├── VisualEditor.tsx    # Point d'entrée, API publique
│   │   ├── store.tsx           # État global (Zustand)
│   │   ├── types.ts            # Définitions TypeScript
│   │   ├── components/         # Composants React
│   │   │   ├── Layout.tsx      # Layout principal
│   │   │   ├── Sidebar/        # Panel d'édition
│   │   │   ├── Preview/        # Panel de prévisualisation
│   │   │   ├── Blocs/          # Sélecteur de blocs
│   │   │   ├── Editor/         # Tiptap (rich text)
│   │   │   └── ui/             # Composants UI réutilisables
│   │   ├── fields/             # Types de champs
│   │   ├── functions/          # Utilitaires
│   │   ├── hooks/              # Custom hooks React
│   │   ├── langs/              # i18n (EN, FR)
│   │   └── elements/           # Custom Elements
│   ├── server/                 # Serveur PHP de preview
│   ├── test/                   # Tests unitaires (Vitest)
│   └── cypress/                # Tests E2E
└── docs/                       # Documentation (Docusaurus)
```

### Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                      Custom Element                          │
│                  <visual-editor value="[]">                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Store (Zustand)                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │ State:                                             │     │
│  │ - data: EditorComponentData[]                      │     │
│  │ - definitions: EditorComponentDefinitions          │     │
│  │ - focusIndex: string | null                        │     │
│  │ - previewMode: DESKTOP | PHONE                     │     │
│  │ - sidebarWidth: number                             │     │
│  │ - rollbackMessage: string | null                   │     │
│  │ - addBlockIndex: number | null                     │     │
│  │ - hiddenCategories: string[]                       │     │
│  │ - templates: EditorComponentTemplate[]             │     │
│  └────────────────────────────────────────────────────┘     │
└───────────┬────────────────────────────────┬────────────────┘
            │                                │
            ▼                                ▼
┌───────────────────────┐        ┌──────────────────────┐
│      Sidebar          │        │      Preview         │
│  ┌─────────────────┐  │        │  ┌────────────────┐  │
│  │ SidebarBlocs    │  │        │  │ Iframe         │  │
│  │ (Liste)         │  │        │  │ ┌────────────┐ │  │
│  └─────────────────┘  │        │  │ │ Portal     │ │  │
│  ┌─────────────────┐  │        │  │ │ Rendering  │ │  │
│  │ SidebarFields   │  │        │  │ └────────────┘ │  │
│  │ (Édition)       │◄─┼────────┼──┤                │  │
│  └─────────────────┘  │        │  └────────────────┘  │
│  ┌─────────────────┐  │        │                      │
│  │ SidebarTemplates│  │        │  POST /preview       │
│  │ (Modèles)       │  │        │  ─────────────►      │
│  └─────────────────┘  │        │  ◄─────────────      │
└───────────────────────┘        │  (HTML Response)     │
                                 └──────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Change Event                              │
│              CustomEvent('change', { detail: json })         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 État Global (Zustand Store)

### Structure de l'État

```typescript
{
  data: EditorComponentData[]           // Contenu de la page
  definitions: EditorComponentDefinitions // Composants enregistrés
  focusIndex: string | null              // Composant sélectionné
  previewMode: PreviewModes              // DESKTOP ou PHONE
  sidebarWidth: number                   // Largeur du panneau
  rollbackMessage: string | null         // Message d'annulation
  addBlockIndex: number | null           // Position d'insertion
  hiddenCategories: string[]             // Catégories filtrées
  templates: EditorComponentTemplate[]   // Modèles disponibles
  previousData: EditorComponentData[]    // Pour rollback
  rootElement: HTMLElement               // Élément DOM racine
  insertPosition: InsertPosition         // START ou END
}
```

### Actions Principales

```typescript
updateData(newData, path?)        // Mise à jour immuable
insertData(name, index, extra)    // Ajout de composant
removeBloc(data)                  // Suppression avec undo
setFocusIndex(id)                 // Changement de sélection
togglePreviewMode()               // Bascule Desktop/Mobile
setSidebarWidth(width)            // Redimensionnement
rollback()                        // Annulation
setAddBlockIndex(index)           // Position d'insertion
```

---

## 🔧 Système de Types

### EditorComponentData
```typescript
{
  _id: string                    // ID unique auto-généré
  _name: string                  // Type de composant
  [key: string]: any            // Champs personnalisés
}
```

### EditorComponentDefinition
```typescript
{
  title: string                  // Label UI
  category?: string              // Catégorie
  label?: string                 // Champ pour affichage
  fields: FieldDefinition[]      // Champs disponibles
}
```

### FieldDefinition
```typescript
{
  name: string                   // Nom du champ
  options: Record<string, unknown> // Configuration
  render: FieldComponent         // Composant de rendu
  shouldRender: (data) => boolean // Affichage conditionnel
  group?: boolean                // Est un groupe
  extraProps?: (data) => {}      // Props additionnelles
}
```

### FieldComponent
```typescript
<Options, Value, ExtraParams> {
  value: Value
  onChange: (v: Value) => void
  options: Options
  extraProps?: ExtraParams
}
```

---

## 🎨 Système de Champs

### Définition d'un Champ

```typescript
import { defineField } from './fields/utils'

export const Text = defineField<
  { multiline?: boolean, placeholder?: string },
  string
>({
  defaultOptions: { multiline: false, placeholder: '' },
  render: ({ value, onChange, options }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={options.placeholder}
    />
  )
})
```

### Utilisation

```typescript
editor.registerComponent('hero', {
  title: 'Hero Section',
  category: 'Headers',
  fields: [
    Text({
      name: 'title',
      options: { placeholder: 'Titre' }
    }),
    HTMLText({ name: 'content' }),
    Repeater({
      name: 'buttons',
      options: {
        fields: [
          Text({ name: 'label' }),
          Text({ name: 'url' })
        ]
      }
    })
  ]
})
```

### Champs Conditionnels

```typescript
Color({ name: 'backgroundColor' })
  .when('hasBackground', true)
```

ou

```typescript
Color({ name: 'textColor' })
  .when('theme', (value) => value === 'custom')
```

---

## 🔌 API Publique

### Initialisation

```typescript
import { VisualEditor, Text, HTMLText, FR } from '@boxraiser/visual-editor'

const editor = new VisualEditor({
  lang: FR,                        // i18n
  postMessagePreview: false        // Mode communication
})
```

### Enregistrement de Composants

```typescript
editor.registerComponent('componentName', {
  title: 'Component Title',
  category: 'Category Name',
  label: 'fieldName',              // Champ pour label
  fields: [
    Text({ name: 'title' }),
    HTMLText({ name: 'content' })
  ]
})
```

### Enregistrement de Templates

```typescript
editor.registerTemplate({
  name: 'Landing Page',
  category: 'Marketing',
  data: [
    { _name: 'hero', title: 'Welcome' },
    { _name: 'features', title: 'Features' }
  ]
})
```

### Définition de l'Élément Personnalisé

```typescript
editor.defineElement('visual-editor')
```

### Utilisation HTML

```html
<visual-editor
  value='[]'
  preview="/preview.php"
  iconsUrl="/icons/{name}.svg"
  name="page_content"
  insertPosition="start"
  hidden-categories="advanced;deprecated"
></visual-editor>
```

### Événements

```javascript
document.querySelector('visual-editor')
  .addEventListener('change', (e) => {
    const json = e.detail
    console.log('New content:', json)
  })

document.querySelector('visual-editor')
  .addEventListener('close', () => {
    console.log('Editor closed')
  })
```

---

## 🎭 Composants Principaux

### Layout (`components/Layout.tsx`)
Container principal avec:
- Sidebar (panel gauche)
- ResizeBar (barre de redimensionnement)
- Preview (panel droit)
- BlocSelector (modal)
- RollbackMessage (notification undo)

### Sidebar (`components/Sidebar/`)
Panel d'édition comprenant:
- **SidebarHeader:** Titre et toggle templates
- **SidebarBlocs:** Liste des composants avec drag-and-drop
- **SidebarFields:** Éditeur de champs du composant sélectionné
- **SidebarTemplates:** Gestionnaire de modèles
- **SidebarFooter:** Actions (export, etc.)
- **SidebarEmpty:** État vide

### Preview (`components/Preview/`)
Panel de prévisualisation:
- **Preview:** Container iframe principal
- **PreviewItems:** Rendu des composants via Portal
- **FrameProvider:** Context React Portal
- **PreviewAddButton:** Bouton d'ajout dans preview
- **PreviewPostMessage:** Communication cross-frame

### BlocSelector (`components/Blocs/`)
Modal de sélection de composants:
- **BlocSelector:** Container modal
- **BlocSelectorSearch:** Barre de recherche
- **BlocSelectorGrid:** Grille avec onglets par catégorie
- **BlocSelectorItem:** Carte de composant

### Tiptap Editor (`components/Editor/TiptapEditor/`)
Éditeur de texte riche:
- **TiptapEditor:** Composant principal
- **TiptapToolbar:** Barre d'outils
- **TiptapToolbarButton:** Boutons individuels
- **TiptapToolbarHeadings:** Sélecteur de titres
- **TiptapToolbarAlign:** Alignement de texte
- **TiptapColorPicker:** Sélecteur de couleur

Extensions supportées:
- Bold, Italic, Underline
- Lists (bullet, ordered)
- Headings (h1-h6)
- Links, Blockquotes, Code
- Color, Highlight, TextAlign
- History (undo/redo)

---

## 🛠️ Utilitaires

### Object (`functions/object.ts`)
- `deepSet(obj, path, value)` - Mise à jour immuable
- `indexify(array)` - Ajout d'IDs uniques
- `stringifyFields(data)` - Sérialisation (sans _id)
- `cast(value, type)` - Conversion de type

### String (`functions/string.ts`)
- `uniqId()` - Génération d'IDs uniques
- `textContent(html)` - Extraction de texte HTML

### Array (`functions/array.ts`)
- `insertItem(array, index, item)` - Insertion
- `moveItem(array, from, to)` - Réorganisation

### Fields (`functions/fields.ts`)
- `fillDefaults(data, fields)` - Valeurs par défaut

### i18n (`functions/i18n.ts`)
- `t(key, values?)` - Traduction avec fallback

---

## 🪝 Custom Hooks

| Hook | Description |
|------|-------------|
| `useUniqId()` | Génère des IDs uniques pour éléments |
| `useToggle()` | Toggle état booléen |
| `useUpdateEffect()` | Effect sans exécution initiale |
| `useStateDelayed()` | État avec délai |
| `useAsyncEffect()` | Wrapper pour async effects |
| `useClipboardPaste()` | Gestion du copier-coller |
| `useStopPropagation()` | Arrêt de propagation d'événements |
| `usePreview()` | Gestion URL de preview |
| `useRenderId()` | Tracking de rendu d'élément |
| `useEffectDebounced()` | Effects avec debounce |

---

## 🧪 Tests

### Tests Unitaires (Vitest)
```bash
npm run test:unit
```

Fichiers:
- `test/functions/object.test.ts`
- `test/functions/array.test.ts`
- `test/functions/fields.test.ts`

### Tests E2E (Cypress)
```bash
npm run test:e2e          # Headless
npm run test:e2e:watch    # Interactive
```

Scénarios testés:
- Affichage de l'éditeur
- Ajout de blocs
- Remplissage de champs
- Visibilité conditionnelle
- Persistance des valeurs
- Export de données

---

## 🔨 Build & Déploiement

### Scripts Disponibles

```bash
npm run dev              # Dev server (Vite + PHP)
npm run build            # Build production
npm run test             # Tests complets
npm run test:unit        # Tests unitaires
npm run test:e2e         # Tests E2E
npm run format           # Prettier
```

### Process de Build

1. **TypeScript Check:** `tsc` vérifie les types
2. **Vite Build:** Bundle ES modules
3. **esbuild:** Build additionnel + standalone
4. **Declaration:** Génération des `.d.ts`
5. **Copy Files:** package.json + README → dist/

### Output

```
dist/
├── VisualEditor.js                # ESM build
├── VisualEditor.standalone.js     # Avec dépendances
├── VisualEditor.d.ts              # Types TypeScript
├── package.json
└── README.md
```

---

## 🌍 Internationalisation

### Langues Supportées
- Anglais (`langs/en.ts`)
- Français (`langs/fr.ts`)

### Utilisation

```typescript
import { VisualEditor, FR } from '@boxraiser/visual-editor'

const editor = new VisualEditor({ lang: FR })
```

### Structure des Traductions

```typescript
export const Translations = {
  addItem: 'Ajouter un élément',
  removeItem: 'Supprimer',
  moveUp: 'Monter',
  moveDown: 'Descendre',
  // ...
}
```

---

## 🖥️ Serveur PHP

### Purpose
Render les composants en HTML pour la prévisualisation

### Endpoints
- `server/index.php` - Rendu des previews
- `server/test.php` - Page de test avec démo
- `server/helpers.php` - Fonctions utilitaires

### Flow
```
POST /preview
{
  "data": [...]
}
       ↓
PHP render HTML
       ↓
Response: <html>...</html>
```

---

## 📊 Format de Données

### JSON Structure

```json
[
  {
    "_id": "hero-abc123",
    "_name": "hero",
    "title": "Bienvenue",
    "content": "<p>Contenu riche</p>",
    "buttons": [
      {
        "_id": "btn-xyz789",
        "label": "CTA",
        "url": "#",
        "type": "primary"
      }
    ],
    "backgroundColor": "--bs-primary"
  },
  {
    "_id": "features-def456",
    "_name": "features",
    "title": "Nos Fonctionnalités",
    "items": [
      { "_id": "feat-1", "title": "Feature 1", "icon": "star" },
      { "_id": "feat-2", "title": "Feature 2", "icon": "rocket" }
    ]
  }
]
```

### Règles
- `_id` est auto-généré et unique
- `_name` identifie le type de composant
- Les autres champs sont définis par le composant
- Les champs `Repeater` contiennent des arrays d'objets avec `_id`

---

## 🎯 Patterns de Design

1. **Portal-based Preview:** React Portal dans iframe pour isolation
2. **Immutable Updates:** Toutes les mises à jour créent de nouveaux objets
3. **Field Factory Pattern:** `defineField()` pour créer des champs
4. **Custom Element API:** Web Component pour usage framework-agnostic
5. **Conditional Rendering:** `.when()` pour visibilité conditionnelle
6. **Zustand Store:** Gestion d'état minimale avec DevTools
7. **Emotion Styling:** CSS-in-JS scopé et dynamique
8. **dnd-kit Drag-and-Drop:** Accessible et compatible tactile

---

## 📈 Dépendances Principales

### Runtime Dependencies
```json
{
  "@dnd-kit/*": "^6.0.8",          // Drag & drop
  "@emotion/*": "^11.11.0",        // CSS-in-JS
  "@radix-ui/*": "^1.0.0",         // Primitives UI
  "@tiptap/*": "^3.0.7",           // Rich text editor
  "react": "^18.2.0",              // UI framework
  "zustand": "^4.4.2",             // State management
  "react-datepicker": "^4.18.0",   // Date picker
  "react-use": "^17.4.0",          // Hooks utilities
  "clsx": "^2.0.0"                 // Classnames
}
```

### Build Dependencies
```json
{
  "vite": "^7.0.6",                // Build tool
  "typescript": "^4.9.5",          // Type checking
  "vitest": "^3.2.4",              // Unit testing
  "cypress": "^15.6.0",            // E2E testing
  "esbuild": "^0.19.4",            // Fast bundler
  "prettier": "^3.0.3"             // Code formatting
}
```

---

## ⚡ Performance

### Optimisations
- **Code Splitting:** Vite build avec tree-shaking
- **Lazy Loading:** Composants chargés à la demande
- **Memoization:** `useMemo` et `useCallback` pour éviter re-renders
- **Immutable Updates:** deepSet évite mutations coûteuses
- **debounce:** Événements debounced (resize, search)
- **Portal Rendering:** Preview isolée évite re-renders

### Bundle Size
- `VisualEditor.js`: ~150KB (minified, sans dépendances)
- `VisualEditor.standalone.js`: ~800KB (avec toutes dépendances)

---

## 🔐 Sécurité

### Mesures en Place
- **TypeScript:** Typage strict pour éviter erreurs
- **Sanitization:** Pas de innerHTML direct, React échappe automatiquement
- **CSP-friendly:** Pas d'eval ou code dynamique
- **CORS:** Configuration serveur pour preview

### Recommandations
- Valider les données côté serveur avant rendu
- Sanitizer le HTML des champs HTMLText avant affichage public
- Utiliser HTTPS pour production
- Implémenter CSRF protection pour endpoints de sauvegarde

---

## 🐛 Debugging

### Zustand DevTools
```typescript
// Activées automatiquement en dev
// Visible dans Redux DevTools Extension
```

### Debug Props
```typescript
// Hook disponible pour debug
useDebugProp(value, 'name')
```

### Logs
```typescript
// En développement, logs détaillés dans console
// En production, logs minimaux
```

---

## 🚀 Points Forts

✅ **Architecture Solide:** Séparation claire des responsabilités
✅ **Type Safety:** TypeScript strict
✅ **Testabilité:** Tests unitaires et E2E
✅ **Extensibilité:** Système de champs modulaire
✅ **Performance:** Optimisations React + immutabilité
✅ **UX:** Drag-and-drop, undo, preview temps réel
✅ **i18n:** Support multi-langues
✅ **Documentation:** Docusaurus avec exemples

---

## ⚠️ Points à Améliorer

### Technique
- **React 18:** Utilise encore class components pour Custom Element
- **Dépendances:** Nombreuses dépendances (bundle size)
- **PHP Server:** Couplage avec PHP pour preview
- **Pas de SSR:** Pas de rendu côté serveur natif
- **Tests:** Coverage pourrait être amélioré

### Features Manquantes
- Versionning de contenu
- Collaboration temps réel
- Media library intégrée
- Import/export de composants
- Keyboard shortcuts avancés
- Accessibilité (ARIA) à améliorer

---

## 📚 Documentation Officielle

- **Site:** https://ciklik.github.io/visual-editor/
- **Repo:** https://github.com/boxraiser/visual-editor
- **npm:** https://www.npmjs.com/package/@boxraiser/visual-editor

---

## 🎓 Concepts Clés pour Migration

### 1. State Management
React utilise Zustand → Svelte utilise stores natifs

### 2. Component Model
React: JSX + hooks → Svelte: .svelte files avec réactivité native

### 3. Styling
Emotion (CSS-in-JS) → Svelte: `<style>` scoped + CSS variables

### 4. Portal Rendering
React Portal → Svelte: mount dans target DOM

### 5. Lifecycle
React hooks (useEffect) → Svelte: onMount, reactive statements

### 6. Events
React: synthetic events → Svelte: événements DOM natifs

### 7. Drag & Drop
@dnd-kit → svelte-dnd-action ou dndzone

### 8. Rich Text
Tiptap (React) → Tiptap core peut être adapté pour Svelte

---

## 📝 Notes de Migration

Cette librairie est un candidat idéal pour migration Svelte 5 car:

1. **Réactivité Native:** Svelte élimine le besoin de hooks complexes
2. **Bundle Size:** Svelte compile vers JS vanilla (plus léger)
3. **Performance:** Pas de Virtual DOM = plus rapide
4. **DX:** Syntaxe plus simple et lisible
5. **Web Components:** Svelte peut exporter en Web Component nativement

### Défis Potentiels
- Trouver équivalents Svelte pour @dnd-kit et Tiptap
- Adapter le système de Portal pour iframe
- Réécrire tous les composants React en Svelte
- Adapter les tests Cypress

### Opportunités
- Simplifier le code (moins de boilerplate)
- Améliorer les performances
- Réduire la taille du bundle
- Meilleure expérience développeur
- Support natif de TypeScript dans Svelte 5
