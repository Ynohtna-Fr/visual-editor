# Exemples d'utilisation locale

Ce dossier contient des exemples pratiques pour utiliser Visual Editor Svelte en développement local, sans publication npm.

---

## 🚀 Démarrage rapide

### 1. Builder le package

```bash
# Depuis la racine de visual-editor-svelte
npm install
npm run build
```

### 2. Lancer le serveur de développement

```bash
# Option A: Serveur PHP (recommandé - inclut le preview)
php -S localhost:8000

# Option B: Serveur Python
python3 -m http.server 8000

# Option C: Serveur Node.js avec http-server
npx http-server -p 8000
```

### 3. Ouvrir l'exemple

Naviguer vers: http://localhost:8000/examples/simple-html-example.html

---

## 📁 Fichiers

### `simple-html-example.html`
Exemple HTML complet utilisant le Visual Editor comme Web Component.

**Fonctionnalités démontrées:**
- Enregistrement de composants (Hero, Button, Features, Testimonial)
- Utilisation des traductions françaises
- Enregistrement de templates
- Écoute des événements change/close
- Sauvegarde locale avec localStorage

**Utilisation:**
```bash
# 1. Builder le package
npm run build

# 2. Lancer un serveur HTTP
php -S localhost:8000

# 3. Ouvrir dans le navigateur
open http://localhost:8000/examples/simple-html-example.html
```

### `preview.php`
Serveur de preview PHP qui répond aux requêtes POST pour afficher les composants.

**Composants supportés:**
- `hero` - Section hero avec titre, contenu, couleur de fond
- `button` - Boutons avec variantes (primary, secondary, outline)
- `features` - Grille de fonctionnalités configurable
- `testimonial` - Témoignages avec photo, citation, et note

**Endpoint:** `/examples/preview.php` (automatiquement routé par PHP server)

---

## 🔧 Configuration pour votre projet

### Méthode 1: npm link (Recommandé)

```bash
# Dans visual-editor-svelte
npm run build
npm link

# Dans votre projet
npm link @boxraiser/visual-editor-svelte
npm install svelte@^5.0.0 svelte-dnd-action @tiptap/core @tiptap/pm
```

### Méthode 2: Installation locale

```bash
# Dans votre projet
npm install /chemin/vers/visual-editor-svelte
npm install svelte@^5.0.0 svelte-dnd-action @tiptap/core @tiptap/pm
```

### Méthode 3: Import direct du build

```html
<script type="module">
  import { VisualEditorAPI, Text, HTMLText } from './path/to/visual-editor-svelte/dist/index.js'

  const editor = new VisualEditorAPI()
  // ...
</script>
```

Voir [LOCAL_DEVELOPMENT.md](../LOCAL_DEVELOPMENT.md) pour plus de détails.

---

## 💡 Exemples de code

### Enregistrer un composant simple

```javascript
import { VisualEditorAPI, Text, Color } from '@boxraiser/visual-editor-svelte'

const editor = new VisualEditorAPI()

editor.registerComponent('section', {
  title: 'Section',
  category: 'Layout',
  fields: [
    Text({ name: 'title', label: 'Titre' }),
    Color({ name: 'bgColor', label: 'Couleur de fond', default: '#ffffff' })
  ]
})

editor.defineElement()
```

### Utiliser dans le HTML

```html
<visual-editor
  value='[]'
  preview="/api/preview"
  iconsurl="/icons/[name].svg"
  name="content"
></visual-editor>

<script>
  const editor = document.querySelector('visual-editor')

  editor.addEventListener('change', (e) => {
    const data = JSON.parse(e.detail)
    console.log('Données:', data)
  })
</script>
```

### Serveur de preview (PHP)

```php
<?php
header('Content-Type: text/html');

$data = json_decode(file_get_contents('php://input'), true);

switch ($data['_name']) {
  case 'section':
    echo '<div style="background-color: ' . $data['bgColor'] . ';">';
    echo '<h2>' . htmlspecialchars($data['title']) . '</h2>';
    echo '</div>';
    break;
}
```

### Serveur de preview (Node.js/Express)

```javascript
import express from 'express'

const app = express()
app.use(express.json())

app.post('/api/preview', (req, res) => {
  const data = req.body

  let html = ''

  switch (data._name) {
    case 'section':
      html = `
        <div style="background-color: ${data.bgColor};">
          <h2>${escapeHtml(data.title)}</h2>
        </div>
      `
      break
  }

  res.send(html)
})

app.listen(3000)
```

---

## 🎨 Personnalisation

### Champs conditionnels

```javascript
Text({ name: 'title', label: 'Titre' }),
Checkbox({ name: 'hasSubtitle', label: 'Afficher le sous-titre' }),
Text({ name: 'subtitle', label: 'Sous-titre' })
  .when((data) => data.hasSubtitle === true)
```

### Templates

```javascript
editor.registerTemplate({
  name: 'Page À Propos',
  category: 'Pages',
  description: 'Une page À Propos complète',
  image: '/templates/about.jpg',
  data: [
    { _name: 'hero', title: 'À Propos', centered: true },
    { _name: 'features', title: 'Notre équipe', columns: 3 },
    { _name: 'testimonial', author: 'Client satisfait', rating: 5 }
  ]
})
```

### Traductions personnalisées

```javascript
import { VisualEditorAPI, FR } from '@boxraiser/visual-editor-svelte'

// Créer une copie des traductions françaises
const customTranslations = {
  ...FR,
  deleteComponent: 'Supprimer ce bloc',
  searchComponent: 'Rechercher un bloc'
}

const editor = new VisualEditorAPI({
  lang: customTranslations
})
```

---

## 🔍 Débogage

### Vérifier que le package est construit

```bash
ls -la dist/
# Devrait afficher: index.js, index.d.ts, etc.
```

### Vérifier le lien npm

```bash
npm ls -g --depth=0 | grep visual-editor-svelte
```

### Voir les logs du navigateur

Ouvrez la console développeur (F12) pour voir:
- Les messages de démarrage de Visual Editor
- Les événements change/close
- Les erreurs éventuelles

### Problèmes courants

**Erreur: Module not found**
```bash
# Rebuilder et relinker
cd visual-editor-svelte
npm run build
npm link
```

**Preview ne fonctionne pas**
- Vérifiez que le serveur PHP est lancé
- Vérifiez l'URL du preview dans l'attribut `preview="..."`
- Regardez l'onglet Network dans les DevTools pour voir les requêtes

**Changements non reflétés**
```bash
# Utiliser watch mode
npm run build -- --watch
```

---

## 📚 Documentation complète

- [LOCAL_DEVELOPMENT.md](../LOCAL_DEVELOPMENT.md) - Guide complet du développement local
- [USAGE.md](../USAGE.md) - API complète et référence des champs
- [README.md](../README.md) - Documentation principale
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guide de contribution

---

## 🆘 Support

Si vous rencontrez des problèmes:

1. Consultez [LOCAL_DEVELOPMENT.md](../LOCAL_DEVELOPMENT.md)
2. Vérifiez les logs de la console navigateur (F12)
3. Ouvrez une issue sur GitHub

---

**Bon développement! 🚀**
