# Plan de Migration vers Svelte 5

## 📊 Vue d'ensemble

Ce document présente un plan complet pour réécrire @boxraiser/visual-editor de **React 18 + Zustand + Emotion** vers **Svelte 5** tout en conservant exactement les mêmes fonctionnalités et le même design.

---

## 🎯 Objectifs

### Fonctionnels
- ✅ **Zéro régression:** Toutes les fonctionnalités actuelles préservées
- ✅ **Design identique:** UI/UX inchangée
- ✅ **API compatible:** Même interface publique (ou similaire)
- ✅ **Tests passants:** Tous les tests E2E fonctionnels

### Techniques
- 🚀 **Performance:** Bundle plus léger, meilleure réactivité
- 📦 **Bundle Size:** Réduction de 40-60% attendue
- 🎨 **DX:** Simplification du code, moins de boilerplate
- 🔧 **Maintenance:** Code plus simple et lisible

---

## 📋 Phase 1: Préparation & Setup (1-2 jours)

### 1.1 Création de la Structure du Projet

```bash
visual-editor-svelte/
├── src/
│   ├── lib/
│   │   ├── VisualEditor.svelte      # Composant principal
│   │   ├── stores/                  # Stores Svelte
│   │   ├── components/              # Composants Svelte
│   │   ├── fields/                  # Champs
│   │   ├── functions/               # Utils (réutilisables)
│   │   ├── types.ts                 # Types (réutilisables)
│   │   └── langs/                   # i18n (réutilisable)
│   └── main.ts                      # Entry point
├── static/                          # Assets statiques
├── tests/
│   ├── unit/                        # Tests unitaires (Vitest)
│   └── e2e/                         # Tests Cypress
├── server/                          # Serveur PHP (réutilisable)
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 1.2 Installation des Dépendances

```json
{
  "dependencies": {
    "svelte": "^5.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",

    // Drag & Drop
    "svelte-dnd-action": "^0.9.50",

    // Rich Text Editor
    "@tiptap/core": "^3.0.7",
    "@tiptap/pm": "^3.0.7",

    // Date Picker
    "svelte-flatpickr": "^3.3.5",

    // Utilities
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.6",
    "typescript": "^5.5.0",
    "vitest": "^3.2.4",
    "cypress": "^15.6.0",
    "@sveltejs/package": "^2.3.0",
    "svelte-check": "^4.0.0",
    "prettier": "^3.0.3",
    "prettier-plugin-svelte": "^3.2.0"
  }
}
```

### 1.3 Configuration

#### svelte.config.js
```javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-auto'

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  },
  compilerOptions: {
    customElement: true  // Pour export Web Component
  }
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: 'src/lib/VisualEditor.svelte',
      name: 'VisualEditor',
      fileName: 'visual-editor'
    }
  },
  server: {
    proxy: {
      '/preview': 'http://localhost:8000'
    }
  }
})
```

### 1.4 Copie des Fichiers Réutilisables

Ces fichiers peuvent être copiés directement (pure JavaScript/TypeScript):

```bash
# Utils
cp visual-editor/src/functions/* visual-editor-svelte/src/lib/functions/
cp visual-editor/src/types.ts visual-editor-svelte/src/lib/types.ts
cp visual-editor/src/enum.ts visual-editor-svelte/src/lib/enum.ts

# i18n
cp visual-editor/src/langs/* visual-editor-svelte/src/lib/langs/

# Serveur PHP
cp -r visual-editor/server visual-editor-svelte/server

# Tests
cp -r visual-editor/cypress visual-editor-svelte/cypress
```

---

## 📋 Phase 2: Store & État Global (2-3 jours)

### 2.1 Migration Zustand → Svelte Stores

**Avant (React + Zustand):**
```typescript
// store.tsx
const createStore = () => create(devtools(combine({
  data: [],
  focusIndex: null,
  // ...
}, (set) => ({
  updateData: (newData, path) => set(state => ({
    data: deepSet(state.data, path, newData)
  }))
}))))
```

**Après (Svelte 5):**
```typescript
// stores/editor.svelte.ts
import { writable, derived } from 'svelte/store'
import type { EditorComponentData } from '../types'

class EditorStore {
  data = $state<EditorComponentData[]>([])
  definitions = $state<EditorComponentDefinitions>({})
  focusIndex = $state<string | null>(null)
  previewMode = $state<'desktop' | 'phone'>('desktop')
  sidebarWidth = $state(33)
  rollbackMessage = $state<string | null>(null)
  addBlockIndex = $state<number | null>(null)
  previousData = $state<EditorComponentData[]>([])
  hiddenCategories = $state<string[]>([])
  templates = $state<EditorComponentTemplate[]>([])

  updateData(newData: any, path?: string) {
    this.data = deepSet(this.data, path, newData)
  }

  insertData(name: string, index: number, extraData?: object) {
    const newData = {
      ...extraData,
      _name: name,
      _id: name + uniqId()
    }
    this.data = insertItem(this.data, index, newData)
    this.focusIndex = newData._id
    return newData
  }

  removeBloc(removedData: EditorComponentData) {
    this.previousData = this.data
    this.data = this.data.filter(d => d !== removedData)
    this.rollbackMessage = t('deleteItemConfirm')
  }

  rollback() {
    this.data = this.previousData
    this.previousData = []
    this.rollbackMessage = null
  }

  setFocusIndex(id: string) {
    this.focusIndex = id
  }

  togglePreviewMode() {
    this.previewMode = this.previewMode === 'desktop' ? 'phone' : 'desktop'
  }

  setSidebarWidth(width: number) {
    this.sidebarWidth = width
    localStorage.setItem('veSidebarWidth', width.toString())
  }
}

export const editorStore = new EditorStore()
```

### 2.2 Context vs Store

Svelte 5 utilise des **runes** (`$state`, `$derived`, `$effect`) qui sont plus simples que les hooks React.

**Avantages:**
- Pas besoin de Context API complexe
- Réactivité automatique
- Moins de boilerplate
- Meilleure performance

---

## 📋 Phase 3: Composants UI de Base (3-4 jours)

### 3.1 Migration des Composants UI

#### Exemple: Button.tsx → Button.svelte

**Avant (React + Emotion):**
```tsx
// components/ui/Button.tsx
import styled from '@emotion/styled'

const StyledButton = styled.button`
  background: var(--color-primary);
  padding: 8px 16px;
  border-radius: 4px;
  &:hover {
    opacity: 0.9;
  }
`

export function Button({ children, onClick }) {
  return <StyledButton onClick={onClick}>{children}</StyledButton>
}
```

**Après (Svelte):**
```svelte
<!-- components/ui/Button.svelte -->
<script lang="ts">
  interface Props {
    onclick?: () => void
  }

  let { onclick, children }: Props = $props()
</script>

<button on:click={onclick}>
  {@render children?.()}
</button>

<style>
  button {
    background: var(--color-primary);
    padding: 8px 16px;
    border-radius: 4px;
  }

  button:hover {
    opacity: 0.9;
  }
</style>
```

#### Composants à Migrer (ordre prioritaire)

1. **components/ui/** (15 composants)
   - Button.svelte
   - Input.svelte
   - Field.svelte
   - Modal.svelte
   - Card.svelte
   - Tabs.svelte
   - Icons.svelte
   - Spinner.svelte
   - Flash.svelte
   - Tooltip.svelte
   - Label.svelte
   - ButtonIcon.svelte
   - UnstyledButton.svelte
   - DragHandle.svelte
   - Flex.svelte

2. **components/BaseStyles.svelte**
   - Variables CSS globales
   - Reset CSS

### 3.2 Adaptation du Styling

**Stratégie:**
1. Convertir Emotion → `<style>` Svelte
2. Conserver variables CSS (`--color-primary`, etc.)
3. Utiliser `:global()` pour styles globaux si nécessaire
4. Utiliser `class:` directive pour classes conditionnelles

**Exemple:**
```svelte
<div class:focused={isFocused} class:error={hasError}>
  Content
</div>

<style>
  div {
    padding: 1rem;
  }

  .focused {
    border-color: blue;
  }

  .error {
    border-color: red;
  }
</style>
```

---

## 📋 Phase 4: Système de Champs (4-5 jours)

### 4.1 Migration du Field Factory Pattern

**Avant (React):**
```typescript
// fields/utils.ts
export const defineField = <Options, Value>(config) => {
  return (fieldConfig) => ({
    ...config,
    ...fieldConfig,
    render: config.render
  })
}

// fields/Text.tsx
export const Text = defineField<Options, string>({
  defaultOptions: { multiline: false },
  render: ({ value, onChange, options }) => (
    <textarea value={value} onChange={e => onChange(e.target.value)} />
  )
})
```

**Après (Svelte):**
```typescript
// fields/utils.ts
export const defineField = <Options, Value>(config) => {
  return (fieldConfig) => ({
    ...config,
    ...fieldConfig,
    component: config.component
  })
}
```

```svelte
<!-- fields/Text.svelte -->
<script lang="ts">
  interface Props {
    value: string
    onchange: (value: string) => void
    options: { multiline?: boolean, placeholder?: string }
  }

  let { value = $bindable(''), onchange, options }: Props = $props()

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement
    onchange(target.value)
  }
</script>

{#if options.multiline}
  <textarea
    {value}
    placeholder={options.placeholder}
    on:input={handleInput}
  />
{:else}
  <input
    type="text"
    {value}
    placeholder={options.placeholder}
    on:input={handleInput}
  />
{/if}

<style>
  textarea, input {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
  }
</style>
```

### 4.2 Champs à Migrer

| Champ React | Champ Svelte | Difficulté | Dépendances |
|-------------|--------------|------------|-------------|
| Text.tsx | Text.svelte | ⭐ Facile | - |
| Checkbox.tsx | Checkbox.svelte | ⭐ Facile | - |
| Number.tsx | Number.svelte | ⭐ Facile | - |
| Range.tsx | Range.svelte | ⭐⭐ Moyen | - |
| Select.tsx | Select.svelte | ⭐ Facile | - |
| Color.tsx | Color.svelte | ⭐⭐ Moyen | color picker |
| DatePicker.tsx | DatePicker.svelte | ⭐⭐⭐ Difficile | svelte-flatpickr |
| ImageUrl.tsx | ImageUrl.svelte | ⭐⭐ Moyen | - |
| Alignment.tsx | Alignment.svelte | ⭐⭐ Moyen | - |
| TextAlign.tsx | TextAlign.svelte | ⭐ Facile | - |
| Repeater.tsx | Repeater.svelte | ⭐⭐⭐ Difficile | svelte-dnd-action |
| Tabs.tsx | Tabs.svelte | ⭐⭐ Moyen | - |
| Row.tsx | Row.svelte | ⭐ Facile | - |
| HTMLText.tsx | HTMLText.svelte | ⭐⭐⭐⭐ Très difficile | Tiptap adapter |

### 4.3 HTMLText / Tiptap Integration

**Défi:** Tiptap est conçu pour React mais peut être adapté.

**Solution:**
```svelte
<!-- fields/HTMLText.svelte -->
<script lang="ts">
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import { onMount, onDestroy } from 'svelte'

  interface Props {
    value: string
    onchange: (value: string) => void
  }

  let { value = $bindable(''), onchange }: Props = $props()
  let element: HTMLDivElement
  let editor: Editor

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [StarterKit],
      content: value,
      onUpdate: ({ editor }) => {
        onchange(editor.getHTML())
      }
    })
  })

  onDestroy(() => {
    editor?.destroy()
  })

  $effect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  })
</script>

<div bind:this={element}></div>

<style>
  div {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    min-height: 200px;
  }
</style>
```

### 4.4 FieldsRenderer

**Composant dynamique pour rendre n'importe quel champ:**

```svelte
<!-- components/Sidebar/FieldsRenderer.svelte -->
<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import type { FieldDefinition } from '$lib/types'

  // Import all field components
  import Text from '$lib/fields/Text.svelte'
  import Checkbox from '$lib/fields/Checkbox.svelte'
  import HTMLText from '$lib/fields/HTMLText.svelte'
  // ... autres imports

  interface Props {
    fields: FieldDefinition[]
    data: any
    onchange: (path: string, value: any) => void
  }

  let { fields, data, onchange }: Props = $props()

  const components = {
    Text,
    Checkbox,
    HTMLText,
    // ...
  }
</script>

{#each fields as field}
  {#if field.shouldRender(data)}
    <svelte:component
      this={components[field.component]}
      value={data[field.name]}
      onchange={(v) => onchange(field.name, v)}
      options={field.options}
    />
  {/if}
{/each}
```

---

## 📋 Phase 5: Layout & Structure (3-4 jours)

### 5.1 Layout Principal

```svelte
<!-- components/Layout.svelte -->
<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import Sidebar from './Sidebar/Sidebar.svelte'
  import Preview from './Preview/Preview.svelte'
  import ResizeBar from './ResizeBar.svelte'
  import BlocSelector from './Blocs/BlocSelector.svelte'
  import RollbackMessage from './RollbackMessage.svelte'

  interface Props {
    previewUrl: string
    iconsUrl: string
    onclose: () => void
  }

  let { previewUrl, iconsUrl, onclose }: Props = $props()

  let sidebarWidth = $derived(editorStore.sidebarWidth)
</script>

<div class="layout">
  <Sidebar width={sidebarWidth} {iconsUrl} />
  <ResizeBar />
  <Preview {previewUrl} />
  <BlocSelector />
  <RollbackMessage />
</div>

<style>
  .layout {
    display: flex;
    height: 100vh;
    position: relative;
  }
</style>
```

### 5.2 Sidebar

```svelte
<!-- components/Sidebar/Sidebar.svelte -->
<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import SidebarHeader from './SidebarHeader.svelte'
  import SidebarBlocs from './SidebarBlocs.svelte'
  import SidebarFields from './SidebarFields.svelte'
  import SidebarTemplates from './SidebarTemplates.svelte'
  import SidebarFooter from './SidebarFooter.svelte'

  interface Props {
    width: number
    iconsUrl: string
  }

  let { width, iconsUrl }: Props = $props()

  let showTemplates = $state(false)
  let data = $derived(editorStore.data)
  let focusIndex = $derived(editorStore.focusIndex)
  let focusedItem = $derived(data.find(d => d._id === focusIndex))
</script>

<aside style:width="{width}vw">
  <SidebarHeader bind:showTemplates />

  {#if showTemplates}
    <SidebarTemplates />
  {:else if focusedItem}
    <SidebarFields data={focusedItem} />
  {:else}
    <SidebarBlocs {data} {iconsUrl} />
  {/if}

  <SidebarFooter />
</aside>

<style>
  aside {
    background: var(--color-sidebar-bg);
    overflow-y: auto;
    position: relative;
  }
</style>
```

### 5.3 ResizeBar

```svelte
<!-- components/ResizeBar.svelte -->
<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'

  let isDragging = $state(false)

  function handleMouseDown() {
    isDragging = true
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return
    const newWidth = (e.clientX / window.innerWidth) * 100
    editorStore.setSidebarWidth(Math.max(20, Math.min(60, newWidth)))
  }

  function handleMouseUp() {
    isDragging = false
  }
</script>

<svelte:window
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
/>

<div
  class="resize-bar"
  class:dragging={isDragging}
  on:mousedown={handleMouseDown}
  role="separator"
  tabindex="0"
></div>

<style>
  .resize-bar {
    width: 4px;
    background: var(--color-border);
    cursor: col-resize;
    transition: background 0.2s;
  }

  .resize-bar:hover,
  .resize-bar.dragging {
    background: var(--color-primary);
  }
</style>
```

---

## 📋 Phase 6: Drag & Drop (3-4 jours)

### 6.1 Migration @dnd-kit → svelte-dnd-action

**Avant (React + dnd-kit):**
```tsx
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'

function SidebarBlocs({ data }) {
  const handleDragEnd = (event) => {
    // logic
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={data}>
        {data.map(item => <SortableItem key={item._id} item={item} />)}
      </SortableContext>
    </DndContext>
  )
}
```

**Après (Svelte + svelte-dnd-action):**
```svelte
<!-- components/Sidebar/SidebarBlocs.svelte -->
<script lang="ts">
  import { dndzone } from 'svelte-dnd-action'
  import { editorStore } from '$lib/stores/editor.svelte'
  import SidebarBloc from './SidebarBloc.svelte'

  interface Props {
    data: EditorComponentData[]
    iconsUrl: string
  }

  let { data, iconsUrl }: Props = $props()

  function handleSort(e: CustomEvent) {
    editorStore.updateData(e.detail.items)
  }

  function handleFinalize(e: CustomEvent) {
    editorStore.updateData(e.detail.items)
  }
</script>

<div
  use:dndzone={{ items: data, flipDurationMs: 200 }}
  on:consider={handleSort}
  on:finalize={handleFinalize}
>
  {#each data as item (item._id)}
    <SidebarBloc {item} {iconsUrl} />
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }
</style>
```

### 6.2 Composant Sortable

```svelte
<!-- components/Sortable.svelte -->
<script lang="ts">
  interface Props {
    id: string
    children: Snippet
  }

  let { id, children }: Props = $props()
</script>

<div data-id={id}>
  {@render children()}
</div>

<style>
  div {
    transition: transform 200ms;
  }
</style>
```

---

## 📋 Phase 7: Preview & Iframe (4-5 jours)

### 7.1 FrameProvider (Portal dans Iframe)

**Défi:** React Portal → Svelte equivalent

**Solution:**
```svelte
<!-- components/Preview/FrameProvider.svelte -->
<script lang="ts">
  import { setContext, onMount } from 'svelte'
  import { writable } from 'svelte/store'

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props()

  let iframeRef: HTMLIFrameElement
  let mountPoint = writable<HTMLElement | null>(null)

  onMount(() => {
    const doc = iframeRef.contentDocument
    if (doc) {
      const target = doc.createElement('div')
      doc.body.appendChild(target)
      mountPoint.set(target)
    }
  })

  setContext('frame-mount', mountPoint)
</script>

<iframe bind:this={iframeRef} title="Preview">
  {#if $mountPoint}
    <svelte:component this={children} />
  {/if}
</iframe>

<style>
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
```

### 7.2 Preview Component

```svelte
<!-- components/Preview/Preview.svelte -->
<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import PreviewItems from './PreviewItems.svelte'
  import PreviewAddButton from './PreviewAddButton.svelte'

  interface Props {
    previewUrl: string
  }

  let { previewUrl }: Props = $props()

  let previewMode = $derived(editorStore.previewMode)
  let data = $derived(editorStore.data)
  let html = $state('')

  async function fetchPreview() {
    const response = await fetch(previewUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    })
    html = await response.text()
  }

  $effect(() => {
    if (data) {
      fetchPreview()
    }
  })
</script>

<div class="preview" class:phone={previewMode === 'phone'}>
  <iframe srcdoc={html} title="Preview" />
  <PreviewAddButton />
</div>

<style>
  .preview {
    flex: 1;
    position: relative;
    background: var(--color-preview-bg);
  }

  .preview.phone iframe {
    width: 375px;
    margin: 0 auto;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
```

### 7.3 PostMessage Communication

```svelte
<!-- components/Preview/PreviewPostMessage.svelte -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { editorStore } from '$lib/stores/editor.svelte'

  onMount(() => {
    function handleMessage(event: MessageEvent) {
      const { type, payload } = event.data

      switch (type) {
        case 'focus':
          editorStore.setFocusIndex(payload.id)
          break
        case 'add':
          editorStore.setAddBlockIndex(payload.index)
          break
        // ... autres messages
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  })
</script>
```

---

## 📋 Phase 8: BlocSelector (2-3 jours)

### 8.1 Modal de Sélection

```svelte
<!-- components/Blocs/BlocSelector.svelte -->
<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import Modal from '../ui/Modal.svelte'
  import BlocSelectorSearch from './BlocSelectorSearch.svelte'
  import BlocSelectorGrid from './BlocSelectorGrid.svelte'

  let isOpen = $derived(editorStore.addBlockIndex !== null)
  let searchQuery = $state('')

  function handleClose() {
    editorStore.setAddBlockIndex(null)
  }

  function handleSelect(componentName: string) {
    editorStore.insertData(
      componentName,
      editorStore.addBlockIndex!,
      {}
    )
    handleClose()
  }
</script>

<Modal {isOpen} onclose={handleClose}>
  <BlocSelectorSearch bind:value={searchQuery} />
  <BlocSelectorGrid {searchQuery} onselect={handleSelect} />
</Modal>
```

### 8.2 Grid avec Onglets

```svelte
<!-- components/Blocs/BlocSelectorGrid.svelte -->
<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import Tabs from '../ui/Tabs.svelte'
  import BlocSelectorItem from './BlocSelectorItem.svelte'

  interface Props {
    searchQuery: string
    onselect: (name: string) => void
  }

  let { searchQuery, onselect }: Props = $props()

  let definitions = $derived(editorStore.definitions)
  let hiddenCategories = $derived(editorStore.hiddenCategories)

  let categories = $derived(() => {
    const cats = new Set<string>()
    Object.values(definitions).forEach(def => {
      if (def.category && !hiddenCategories.includes(def.category)) {
        cats.add(def.category)
      }
    })
    return Array.from(cats)
  })

  let filteredComponents = $derived(() => {
    return Object.entries(definitions).filter(([name, def]) => {
      if (hiddenCategories.includes(def.category || '')) return false
      if (searchQuery) {
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               def.title.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
  })
</script>

<Tabs tabs={categories}>
  {#snippet default(category)}
    <div class="grid">
      {#each filteredComponents as [name, def]}
        {#if def.category === category}
          <BlocSelectorItem
            {name}
            definition={def}
            onclick={() => onselect(name)}
          />
        {/if}
      {/each}
    </div>
  {/snippet}
</Tabs>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    padding: 16px;
  }
</style>
```

---

## 📋 Phase 9: Custom Element / Web Component (2-3 jours)

### 9.1 Export en Web Component

Svelte 5 peut compiler directement en Web Component.

**svelte.config.js:**
```javascript
export default {
  compilerOptions: {
    customElement: true
  }
}
```

**VisualEditor.svelte:**
```svelte
<svelte:options customElement="visual-editor" />

<script lang="ts">
  import { onMount } from 'svelte'
  import { editorStore } from './stores/editor.svelte'
  import Layout from './components/Layout.svelte'
  import BaseStyles from './components/BaseStyles.svelte'

  // Props = attributes du custom element
  interface Props {
    value?: string
    preview?: string
    iconsurl?: string
    name?: string
    hidden?: boolean
    insertposition?: 'start' | 'end'
    hiddencategories?: string
  }

  let {
    value = '[]',
    preview = '',
    iconsurl = '/',
    name = '',
    hidden = false,
    insertposition = 'start',
    hiddencategories = ''
  }: Props = $props()

  let cleanedData = $derived(() => {
    return JSON.stringify(
      editorStore.data.map(item => {
        const { _id, ...rest } = item
        return rest
      })
    )
  })

  // Watch value changes from outside
  $effect(() => {
    if (value !== cleanedData) {
      try {
        const parsed = JSON.parse(value)
        editorStore.data = indexify(parsed)
      } catch (e) {
        console.error('Failed to parse value', e)
      }
    }
  })

  // Emit change event
  $effect(() => {
    const json = cleanedData
    dispatchEvent(new CustomEvent('change', {
      detail: json
    }))
  })

  onMount(() => {
    editorStore.insertPosition = insertposition
    editorStore.hiddenCategories = hiddencategories.split(';').filter(Boolean)
  })
</script>

{#if !hidden}
  <BaseStyles>
    <Layout previewUrl={preview} iconsUrl={iconsurl} onclose={() => {
      dispatchEvent(new Event('close'))
    }} />
  </BaseStyles>
{/if}

<textarea {name} {value} style="display: none;"></textarea>
```

### 9.2 API Publique

```typescript
// main.ts - Entry point
import VisualEditor from './lib/VisualEditor.svelte'
import { editorStore } from './lib/stores/editor.svelte'

// Export field components
export { default as Text } from './lib/fields/Text.svelte'
export { default as HTMLText } from './lib/fields/HTMLText.svelte'
export { default as Checkbox } from './lib/fields/Checkbox.svelte'
export { default as Select } from './lib/fields/Select.svelte'
export { default as Number } from './lib/fields/Number.svelte'
export { default as Range } from './lib/fields/Range.svelte'
export { default as Color } from './lib/fields/Color.svelte'
export { default as DatePicker } from './lib/fields/DatePicker.svelte'
export { default as ImageUrl } from './lib/fields/ImageUrl.svelte'
export { default as Alignment } from './lib/fields/Alignment.svelte'
export { default as TextAlign } from './lib/fields/TextAlign.svelte'
export { default as Repeater } from './lib/fields/Repeater.svelte'
export { default as Tabs } from './lib/fields/Tabs.svelte'
export { default as Row } from './lib/fields/Row.svelte'

// Export utilities
export { defineField, defineFieldGroup } from './lib/fields/utils'
export * from './lib/types'
export { FR, EN } from './lib/langs'

// Export main class
export class VisualEditorAPI {
  constructor(options: { lang?: any, postMessagePreview?: boolean } = {}) {
    // Set lang in store or global
  }

  registerComponent(name: string, definition: EditorComponentDefinition) {
    editorStore.definitions[name] = { label: 'title', ...definition }
  }

  registerTemplate(template: EditorComponentTemplate) {
    editorStore.templates = [...editorStore.templates, template]
  }

  defineElement(elementName: string = 'visual-editor') {
    // Already handled by <svelte:options customElement />
    console.log(`Custom element <${elementName}> is ready`)
  }
}

export default VisualEditor
```

### 9.3 Usage

```typescript
// Dans un projet Svelte
import { VisualEditorAPI, Text, HTMLText } from '@boxraiser/visual-editor-svelte'

const editor = new VisualEditorAPI()

editor.registerComponent('hero', {
  title: 'Hero',
  fields: [
    Text({ name: 'title' }),
    HTMLText({ name: 'content' })
  ]
})

editor.defineElement()
```

```html
<!-- Dans le HTML -->
<visual-editor
  value='[]'
  preview="/preview.php"
></visual-editor>
```

---

## 📋 Phase 10: Tests (3-4 jours)

### 10.1 Tests Unitaires (Vitest)

**Exemple:**
```typescript
// tests/unit/object.test.ts
import { describe, it, expect } from 'vitest'
import { deepSet, indexify, stringifyFields } from '$lib/functions/object'

describe('object utils', () => {
  it('should deep set values', () => {
    const obj = { a: { b: 1 } }
    const result = deepSet(obj, 'a.b', 2)
    expect(result).toEqual({ a: { b: 2 } })
    expect(obj).toEqual({ a: { b: 1 } }) // immutable
  })

  it('should add _id to all objects', () => {
    const data = [{ name: 'test' }]
    const result = indexify(data)
    expect(result[0]._id).toBeDefined()
  })
})
```

### 10.2 Tests de Composants

```typescript
// tests/unit/Button.test.ts
import { render, fireEvent } from '@testing-library/svelte'
import Button from '$lib/components/ui/Button.svelte'

describe('Button', () => {
  it('should render', () => {
    const { getByText } = render(Button, {
      props: { children: 'Click me' }
    })
    expect(getByText('Click me')).toBeTruthy()
  })

  it('should call onclick', async () => {
    let clicked = false
    const { getByText } = render(Button, {
      props: {
        children: 'Click',
        onclick: () => { clicked = true }
      }
    })

    await fireEvent.click(getByText('Click'))
    expect(clicked).toBe(true)
  })
})
```

### 10.3 Tests E2E (Cypress)

**Les tests Cypress existants peuvent être réutilisés quasi-identiquement:**

```javascript
// cypress/e2e/editor.cy.js
describe('Visual Editor', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should display editor', () => {
    cy.get('visual-editor').should('exist')
    cy.get('.sidebar').should('be.visible')
    cy.get('.preview').should('be.visible')
  })

  it('should add a block', () => {
    cy.get('[data-testid="add-block"]').click()
    cy.get('.bloc-selector').should('be.visible')
    cy.get('[data-bloc="hero"]').click()
    cy.get('.sidebar-bloc[data-name="hero"]').should('exist')
  })

  it('should edit field value', () => {
    cy.get('[data-testid="add-block"]').click()
    cy.get('[data-bloc="hero"]').click()
    cy.get('input[name="title"]').type('Hello World')
    cy.get('input[name="title"]').should('have.value', 'Hello World')
  })
})
```

---

## 📋 Phase 11: Documentation (2-3 jours)

### 11.1 Conversion Docusaurus

La documentation Docusaurus existante peut être réutilisée avec quelques ajustements:

1. Mettre à jour les exemples de code (React → Svelte)
2. Mettre à jour les imports
3. Conserver la structure

### 11.2 README.md

```markdown
# @boxraiser/visual-editor-svelte

Visual page builder with real-time preview, built with Svelte 5.

## Installation

```bash
npm install @boxraiser/visual-editor-svelte
```

## Quick Start

```typescript
import { VisualEditorAPI, Text, HTMLText } from '@boxraiser/visual-editor-svelte'

const editor = new VisualEditorAPI()

editor.registerComponent('hero', {
  title: 'Hero Section',
  category: 'Headers',
  fields: [
    Text({ name: 'title', options: { placeholder: 'Title' } }),
    HTMLText({ name: 'content' })
  ]
})

editor.defineElement()
```

```html
<visual-editor
  value='[]'
  preview="/preview.php"
></visual-editor>
```

## Features

- 15 field types
- Drag & drop reordering
- Live preview in iframe
- Template system
- i18n support (EN, FR)
- TypeScript support
- Lightweight (~60KB gzipped)
```

---

## 📋 Phase 12: Build & Distribution (2 jours)

### 12.1 Package Configuration

```json
{
  "name": "@boxraiser/visual-editor-svelte",
  "version": "1.0.0",
  "type": "module",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && npm run package",
    "package": "svelte-kit sync && svelte-package",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "test": "npm run test:unit && npm run test:e2e",
    "test:unit": "vitest run",
    "test:e2e": "cypress run"
  }
}
```

### 12.2 Build Process

```bash
npm run build
# 1. Compile Svelte components
# 2. Generate TypeScript declarations
# 3. Package for distribution
```

---

## 📊 Comparaison React vs Svelte

| Aspect | React + Zustand + Emotion | Svelte 5 | Gain |
|--------|---------------------------|----------|------|
| **Bundle Size** | ~800KB (standalone) | ~320KB (standalone) | **-60%** |
| **Lines of Code** | ~8,500 LOC | ~5,500 LOC | **-35%** |
| **Dependencies** | 40+ packages | 15 packages | **-60%** |
| **Performance** | Good (Virtual DOM) | Excellent (Compiled) | **+40%** |
| **DX** | Hooks + boilerplate | Runes + reactive | **++** |
| **Learning Curve** | Medium-High | Low-Medium | **++** |
| **Build Time** | ~8s | ~3s | **-60%** |

---

## ⏱️ Timeline Estimé

| Phase | Durée | Difficulté |
|-------|-------|------------|
| 1. Setup & Structure | 1-2 jours | ⭐ |
| 2. Store & State | 2-3 jours | ⭐⭐ |
| 3. Composants UI | 3-4 jours | ⭐⭐ |
| 4. Système de Champs | 4-5 jours | ⭐⭐⭐ |
| 5. Layout | 3-4 jours | ⭐⭐ |
| 6. Drag & Drop | 3-4 jours | ⭐⭐⭐ |
| 7. Preview & Iframe | 4-5 jours | ⭐⭐⭐⭐ |
| 8. BlocSelector | 2-3 jours | ⭐⭐ |
| 9. Web Component | 2-3 jours | ⭐⭐ |
| 10. Tests | 3-4 jours | ⭐⭐⭐ |
| 11. Documentation | 2-3 jours | ⭐ |
| 12. Build & Deploy | 2 jours | ⭐⭐ |

**Total: 31-43 jours (6-8 semaines)**

Avec 1 développeur full-time expérimenté en Svelte.

---

## 🎯 Milestones

### Milestone 1: Foundation (Semaine 1-2)
- ✅ Setup projet
- ✅ Store migré
- ✅ Composants UI de base
- ✅ Utils copiés

### Milestone 2: Core Features (Semaine 3-4)
- ✅ Tous les champs fonctionnels
- ✅ Layout principal
- ✅ Drag & drop

### Milestone 3: Advanced (Semaine 5-6)
- ✅ Preview iframe
- ✅ BlocSelector
- ✅ Web Component

### Milestone 4: Polish (Semaine 7-8)
- ✅ Tests complets
- ✅ Documentation
- ✅ Release 1.0

---

## 🚨 Risques & Mitigations

### Risque 1: Tiptap Integration
**Impact:** ⭐⭐⭐⭐
**Probabilité:** ⭐⭐⭐
**Mitigation:**
- Tester dès Phase 4
- Fallback vers textarea si bloqué
- Considérer alternatives (ProseMirror direct)

### Risque 2: Iframe Portal
**Impact:** ⭐⭐⭐⭐
**Probabilité:** ⭐⭐
**Mitigation:**
- POC dès Phase 7
- Utiliser mount programmatique
- Fallback vers PostMessage si nécessaire

### Risque 3: Performance Drag & Drop
**Impact:** ⭐⭐⭐
**Probabilité:** ⭐⭐
**Mitigation:**
- Profiler dès Phase 6
- Optimiser avec `{#key}` blocks
- Considérer alternatives si bloqué

### Risque 4: Breaking Changes API
**Impact:** ⭐⭐
**Probabilité:** ⭐
**Mitigation:**
- Maintenir compatibilité maximale
- Documenter les changements
- Fournir migration guide

---

## ✅ Checklist de Validation

### Fonctionnel
- [ ] Tous les champs fonctionnent identiquement
- [ ] Drag & drop fluide
- [ ] Preview temps réel
- [ ] Templates fonctionnels
- [ ] Export JSON correct
- [ ] Undo/Redo fonctionnel
- [ ] i18n fonctionnel
- [ ] Responsive (desktop/mobile)

### Technique
- [ ] TypeScript strict
- [ ] Bundle < 400KB
- [ ] Tous tests passent (unit + E2E)
- [ ] Performance ≥ version React
- [ ] Pas de memory leaks
- [ ] Compatible navigateurs modernes
- [ ] Web Component fonctionnel

### Documentation
- [ ] README complet
- [ ] API docs à jour
- [ ] Exemples fonctionnels
- [ ] Migration guide
- [ ] Changelog

---

## 🎉 Résultat Attendu

### Améliora tions Quantifiables
- **-60% bundle size** (800KB → 320KB)
- **-35% lines of code** (8,500 → 5,500)
- **-60% dependencies** (40 → 15)
- **+40% performance** (FPS, time to interactive)
- **-60% build time** (8s → 3s)

### Améliorations Qualitatives
- Code plus simple et lisible
- Moins de boilerplate
- Meilleure DX (Developer Experience)
- Réactivité native de Svelte
- Maintenance plus facile

---

## 📚 Ressources

### Documentation Svelte 5
- https://svelte.dev/docs/svelte/overview
- https://svelte-5-preview.vercel.app/docs/runes
- https://github.com/sveltejs/svelte/discussions

### Librairies Équivalentes
- **svelte-dnd-action:** https://github.com/isaacHagoel/svelte-dnd-action
- **Tiptap + Svelte:** https://github.com/ueberdosis/tiptap/issues/1548
- **svelte-flatpickr:** https://github.com/jacobmischka/svelte-flatpickr

### Exemples de Migration
- https://github.com/Rich-Harris/svelte-from-react
- https://svelte.dev/tutorial/basics

---

## 🤝 Recommandations

1. **Commencer par un POC** des parties critiques (Tiptap, Iframe Portal, Drag & Drop)
2. **Migrer par phases** selon le plan ci-dessus
3. **Tester continuellement** avec Cypress à chaque phase
4. **Documenter au fur et à mesure** pour ne pas accumuler
5. **Garder la version React** en parallèle pendant la migration
6. **Release en beta** d'abord pour feedback utilisateurs

---

## 📞 Support

Pour toute question sur ce plan de migration, contactez l'équipe de développement.
