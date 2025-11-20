# Développement Local - Sans Publication NPM

Ce guide explique comment utiliser @boxraiser/visual-editor-svelte localement sans le publier sur npm.

---

## Méthode 1: npm link (Recommandée)

### Étape 1: Builder et linker le package

```bash
cd /chemin/vers/visual-editor-svelte

# Installer les dépendances
npm install

# Builder le package
npm run build

# Créer un lien symbolique global
npm link
```

### Étape 2: Utiliser le lien dans votre projet

```bash
cd /chemin/vers/votre-projet

# Lier le package local
npm link @boxraiser/visual-editor-svelte

# Installer les peer dependencies
npm install svelte@^5.0.0 svelte-dnd-action @tiptap/core @tiptap/pm
```

### Étape 3: Utiliser dans votre code

```typescript
// Fonctionne exactement comme si c'était installé depuis npm!
import { VisualEditorAPI, Text, HTMLText } from '@boxraiser/visual-editor-svelte'

const editor = new VisualEditorAPI()

editor.registerComponent('hero', {
  title: 'Hero Section',
  fields: [
    Text({ name: 'title', label: 'Title' }),
    HTMLText({ name: 'content', label: 'Content' })
  ]
})

editor.defineElement()
```

### Pour "unlinkˮ plus tard

```bash
# Dans votre projet
npm unlink @boxraiser/visual-editor-svelte

# Dans visual-editor-svelte
npm unlink
```

---

## Méthode 2: Installation depuis le système de fichiers

### Installation directe avec le chemin

```bash
cd /chemin/vers/votre-projet

# Installer depuis le chemin local (Windows: utiliser des backslashes ou chemins absolus)
npm install ../visual-editor/visual-editor-svelte

# Ou avec un chemin absolu
npm install /home/user/visual-editor/visual-editor-svelte

# Installer les peer dependencies
npm install svelte@^5.0.0 svelte-dnd-action @tiptap/core @tiptap/pm
```

Dans `package.json`, vous verrez:

```json
{
  "dependencies": {
    "@boxraiser/visual-editor-svelte": "file:../visual-editor/visual-editor-svelte"
  }
}
```

**Note**: Vous devez rebuilder le package à chaque modification:

```bash
cd /chemin/vers/visual-editor-svelte
npm run build
```

---

## Méthode 3: Monorepo avec Workspaces (Pour projets multiples)

### Structure du projet

```
mon-projet/
├── packages/
│   ├── visual-editor-svelte/    # Le package
│   └── mon-application/          # Votre app
└── package.json                  # Root package.json
```

### package.json racine

```json
{
  "name": "mon-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "dev": "npm run dev --workspace=mon-application"
  }
}
```

### Utilisation dans packages/mon-application/package.json

```json
{
  "name": "mon-application",
  "dependencies": {
    "@boxraiser/visual-editor-svelte": "*",
    "svelte": "^5.0.0",
    "svelte-dnd-action": "^0.9.50",
    "@tiptap/core": "^3.0.7",
    "@tiptap/pm": "^3.0.7"
  }
}
```

```bash
# À la racine
npm install

# Le lien symbolique sera créé automatiquement!
```

---

## Méthode 4: Watch Mode pour développement actif

Si vous modifiez fréquemment le package pendant le développement:

### Terminal 1: Mode watch sur le package

```bash
cd /chemin/vers/visual-editor-svelte

# Builder en mode watch (rebuild auto à chaque changement)
npm run build -- --watch
```

### Terminal 2: Votre application

```bash
cd /chemin/vers/votre-projet

# Avec npm link déjà configuré
npm run dev
```

Vos changements dans visual-editor-svelte seront automatiquement rebuilds et disponibles!

---

## Méthode 5: Copie manuelle du dist/ (Simple mais moins flexible)

```bash
# Builder le package
cd /chemin/vers/visual-editor-svelte
npm run build

# Copier le dossier dist dans votre projet
cp -r dist /chemin/vers/votre-projet/visual-editor-dist

# Dans votre code TypeScript/JavaScript
import { VisualEditorAPI } from './visual-editor-dist/index.js'
```

**Inconvénients**: Pas de résolution de types automatique, chemins d'import manuels.

---

## Méthode 6: Créer un package tarball local

```bash
cd /chemin/vers/visual-editor-svelte

# Builder
npm run build

# Créer un tarball
npm pack
# Crée: boxraiser-visual-editor-svelte-1.0.0-beta.1.tgz
```

```bash
cd /chemin/vers/votre-projet

# Installer depuis le tarball
npm install /chemin/vers/visual-editor-svelte/boxraiser-visual-editor-svelte-1.0.0-beta.1.tgz
```

---

## Exemple complet avec SvelteKit

### 1. Linker le package

```bash
cd /home/user/visual-editor/visual-editor-svelte
npm install
npm run build
npm link
```

### 2. Créer un projet SvelteKit

```bash
npm create svelte@latest mon-projet
cd mon-projet

# Installer les dépendances
npm install

# Linker visual-editor-svelte
npm link @boxraiser/visual-editor-svelte

# Installer les peer dependencies
npm install svelte-dnd-action @tiptap/core @tiptap/pm
```

### 3. Configurer le Web Component (src/routes/+page.svelte)

```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { VisualEditorAPI, Text, HTMLText, Color, Select, FR } from '@boxraiser/visual-editor-svelte'

  onMount(() => {
    const editor = new VisualEditorAPI({ lang: FR })

    editor.registerComponent('hero', {
      title: 'Section Hero',
      category: 'Contenu',
      fields: [
        Text({ name: 'title', label: 'Titre' }),
        HTMLText({ name: 'content', label: 'Contenu' }),
        Color({ name: 'bgColor', label: 'Couleur de fond', default: '#ffffff' })
      ]
    })

    editor.registerComponent('button', {
      title: 'Bouton',
      category: 'Actions',
      fields: [
        Text({ name: 'text', label: 'Texte du bouton' }),
        Text({ name: 'url', label: 'URL' }),
        Select({
          name: 'variant',
          label: 'Style',
          options: ['primary', 'secondary', 'outline']
        })
      ]
    })

    editor.defineElement()

    // Écouter les changements
    const editorElement = document.querySelector('visual-editor')
    editorElement?.addEventListener('change', (e: any) => {
      console.log('Données mises à jour:', JSON.parse(e.detail))
    })
  })
</script>

<svelte:head>
  <title>Test Visual Editor</title>
</svelte:head>

<h1>Visual Editor - Test Local</h1>

<visual-editor
  value='[]'
  preview="/api/preview"
  iconsurl="/icons/[name].svg"
  name="page_content"
></visual-editor>

<style>
  :global(body) {
    margin: 0;
    padding: 20px;
  }

  h1 {
    margin-bottom: 2rem;
  }
</style>
```

### 4. Créer l'endpoint de preview (src/routes/api/preview/+server.ts)

```typescript
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json()

  // Rendu du composant basé sur data._name
  let html = ''

  switch (data._name) {
    case 'hero':
      html = `
        <div class="hero" style="background-color: ${data.bgColor || '#fff'}; padding: 4rem 2rem; text-align: center;">
          <h1>${data.title || ''}</h1>
          <div>${data.content || ''}</div>
        </div>
      `
      break

    case 'button':
      html = `
        <a href="${data.url || '#'}" class="btn btn-${data.variant || 'primary'}">
          ${data.text || 'Button'}
        </a>
      `
      break

    default:
      html = `<div>Unknown component: ${data._name}</div>`
  }

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html'
    }
  })
}
```

### 5. Ajouter les icônes (static/icons/)

Créer les fichiers SVG dans `static/icons/`:
- `add.svg`
- `close.svg`
- `delete.svg`
- etc.

### 6. Lancer le projet

```bash
npm run dev
```

Ouvrez http://localhost:5173 - L'éditeur visuel devrait fonctionner!

---

## Dépannage

### Problème: Module not found après npm link

**Solution**: Rebuilder le package

```bash
cd /chemin/vers/visual-editor-svelte
npm run build
```

### Problème: Types TypeScript non reconnus

**Solution**: Vérifier que `dist/index.d.ts` existe et est généré

```bash
cd /chemin/vers/visual-editor-svelte
npm run build
ls -la dist/  # Vérifier que index.d.ts existe
```

### Problème: Changements non reflétés

**Solution 1**: Utiliser watch mode

```bash
npm run build -- --watch
```

**Solution 2**: Relinker

```bash
npm unlink
npm link
```

### Problème: Conflits de versions Svelte

**Solution**: S'assurer que les versions correspondent

```bash
# Dans visual-editor-svelte
npm ls svelte

# Dans votre projet
npm ls svelte

# Si différentes, aligner les versions
```

---

## Bonnes pratiques

1. **Toujours builder avant de linker**
   ```bash
   npm run build && npm link
   ```

2. **Utiliser watch mode en développement actif**
   ```bash
   npm run build -- --watch
   ```

3. **Vérifier les peer dependencies**
   ```bash
   npm install svelte@^5.0.0 svelte-dnd-action @tiptap/core @tiptap/pm
   ```

4. **Tester le build avant publication**
   ```bash
   npm run build && npm run check
   ```

---

## Publication ultérieure sur npm

Quand vous serez prêt à publier:

```bash
cd /chemin/vers/visual-editor-svelte

# Vérifier que tout est OK
npm run check
npm run build

# Se connecter à npm (première fois seulement)
npm login

# Publier (en tant que beta)
npm publish --tag beta

# Ou publier en version stable
npm publish
```

Ensuite vos utilisateurs pourront simplement faire:

```bash
npm install @boxraiser/visual-editor-svelte
```

---

**Recommandation**: Utilisez `npm link` (Méthode 1) pour le développement quotidien - c'est la plus flexible et la plus proche de l'expérience npm réelle.
