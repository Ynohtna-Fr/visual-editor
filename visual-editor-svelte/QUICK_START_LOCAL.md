# 🚀 Démarrage Rapide - Développement Local

Guide ultra-rapide pour utiliser Visual Editor Svelte **sans publication npm**.

---

## ⚡ En 3 commandes

```bash
# 1. Builder le package
npm install && npm run build

# 2. Créer le lien npm global
npm link

# 3. Tester l'exemple
npm run example
# Puis ouvrir: http://localhost:8000/examples/simple-html-example.html
```

---

## 📦 Utiliser dans votre projet

### Dans votre projet

```bash
# Lier le package
npm link @boxraiser/visual-editor-svelte

# Installer les dépendances peer
npm install svelte@^5.0.0 svelte-dnd-action @tiptap/core @tiptap/pm
```

### Dans votre code

```typescript
import { VisualEditorAPI, Text, HTMLText, Color } from '@boxraiser/visual-editor-svelte'

const editor = new VisualEditorAPI()

editor.registerComponent('hero', {
  title: 'Hero Section',
  category: 'Content',
  fields: [
    Text({ name: 'title', label: 'Title' }),
    HTMLText({ name: 'content', label: 'Content' }),
    Color({ name: 'bgColor', label: 'Background', default: '#fff' })
  ]
})

editor.defineElement()
```

```html
<visual-editor
  value='[]'
  preview="/api/preview"
  iconsurl="/icons/[name].svg"
  name="content"
></visual-editor>
```

---

## 🔄 Mode Watch (Rebuild automatique)

Pour développer activement sur le package:

```bash
# Terminal 1: Watch mode
npm run build:watch

# Terminal 2: Votre projet
cd /chemin/vers/votre-projet
npm run dev
```

Vos modifications seront automatiquement rebuilds!

---

## 📖 Documentation complète

- **[LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)** - Guide complet avec toutes les méthodes
- **[examples/README.md](./examples/README.md)** - Exemples pratiques
- **[USAGE.md](./USAGE.md)** - API complète et référence

---

## ❓ Problèmes courants

### Module not found

```bash
cd /chemin/vers/visual-editor-svelte
npm run build
npm link
```

### Changements non reflétés

Utilisez le watch mode:
```bash
npm run build:watch
```

### Types TypeScript manquants

Vérifiez que `dist/index.d.ts` existe:
```bash
ls -la dist/index.d.ts
```

---

## 🛠️ Scripts disponibles

```bash
npm run build          # Builder le package
npm run build:watch    # Builder en mode watch
npm run setup:local    # Configuration complète automatique
npm run example        # Lancer le serveur d'exemple
npm run check          # Vérification TypeScript
npm run format         # Formater le code
npm run test           # Lancer tous les tests
```

---

## 💡 Astuce Pro

Créez un alias pour faciliter le développement:

```bash
# Dans votre ~/.bashrc ou ~/.zshrc
alias ve-dev='cd /chemin/vers/visual-editor-svelte && npm run build:watch'
```

Puis simplement:
```bash
ve-dev  # Lance le watch mode
```

---

**Besoin d'aide?** Consultez [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) pour plus de détails!
