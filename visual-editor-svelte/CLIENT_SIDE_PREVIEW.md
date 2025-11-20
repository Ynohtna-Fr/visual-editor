# Guide: Configuration de la page Preview (Client-Side)

Pour que le mode `postmessagepreview="true"` fonctionne, votre page preview doit:

## 1. Avoir un conteneur avec l'ID `ve-components`

```svelte
<!-- src/routes/member/project/[id]/callsheet/[callsheetId]/preview/+page.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import CallsheetHeader from '$lib/components/...';

  let callsheetData = $state([])

  const components = {
    'header': CallsheetHeader,
  };

  const listener = (message) => {
    if (message.data.type === 'visual-editor-update') {
      const { componentId, data } = message.data

      // Mettre à jour ou ajouter le composant
      const index = callsheetData.findIndex(item => item._id === componentId)

      if (index >= 0) {
        // Mise à jour
        callsheetData[index] = data
      } else {
        // Nouveau composant
        callsheetData = [...callsheetData, data]
      }
    }
  }

  onMount(() => {
    window.addEventListener('message', listener);
  })

  onDestroy(() => {
    window.removeEventListener('message', listener);
  })
</script>

<!-- ✅ IMPORTANT: Container avec id="ve-components" -->
<div id="ve-components" class="page">
  {#each callsheetData as block (block._id)}
    {#if components[block._name]}
      {@const Component = components[block._name]}
      <Component {...block} />
    {:else}
      <div class="unknown-block">
        ⚠️ Composant inconnu : {block._name}
      </div>
    {/if}
  {/each}
</div>

<style>
  .page {
    /* Vos styles ici */
    padding: 2rem;
    background: white;
  }

  .unknown-block {
    padding: 1rem;
    background: #fee;
    color: #c00;
    border-radius: 4px;
  }
</style>
```

## 2. Différence avec le mode Server-Side

### Mode Server-Side (par défaut)
- Le preview fait des requêtes POST au serveur
- Le serveur renvoie du HTML rendu
- Nécessite un endpoint POST qui accepte JSON

### Mode Client-Side (postmessagepreview="true")
- L'éditeur charge votre page directement dans l'iframe
- Communication via `window.postMessage`
- Pas de requêtes serveur
- ✅ Fonctionne avec SvelteKit sans endpoints spéciaux

## 3. Structure du message reçu

```typescript
{
  type: 'visual-editor-update',
  componentId: 'header_mm60rd8s4',  // L'ID unique du composant
  data: {
    _id: 'header_mm60rd8s4',
    _name: 'header',
    productionName: 'Nom prod',
    productionLocation: '1 rue de la ville',
    useImg: false,
    crewName: 'Mise en scène : test, test 2'
  }
}
```

## 4. Déboguer

Ajoutez des logs pour voir les messages:

```javascript
const listener = (message) => {
  console.log('📨 Message reçu:', message.data)

  if (message.data.type === 'visual-editor-update') {
    console.log('✅ Mise à jour du composant:', message.data.componentId)
    // ...
  }
}
```

## 5. Exemple complet pour SvelteKit

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import CallsheetHeader from '$lib/components/member/project/callsheet/CallsheetHeader.svelte';

  // Types
  interface BlockData {
    _id: string
    _name: string
    [key: string]: any
  }

  let callsheetData = $state<BlockData[]>([])

  const components: Record<string, any> = {
    'header': CallsheetHeader,
  };

  const listener = (message: MessageEvent) => {
    if (message.data.type === 'visual-editor-update') {
      const { componentId, data } = message.data

      console.log('📝 Update component:', componentId, data)

      const index = callsheetData.findIndex(item => item._id === componentId)

      if (index >= 0) {
        // Mise à jour d'un composant existant
        const newData = [...callsheetData]
        newData[index] = data
        callsheetData = newData
      } else {
        // Nouveau composant
        callsheetData = [...callsheetData, data]
      }
    }
  }

  onMount(() => {
    console.log('✅ Preview page ready - listening for messages')
    window.addEventListener('message', listener);
  })

  onDestroy(() => {
    window.removeEventListener('message', listener);
  })
</script>

<svelte:head>
  <title>Preview</title>
</svelte:head>

<div id="ve-components" class="callsheet-preview">
  {#if callsheetData.length === 0}
    <div class="empty-state">
      👈 Ajoutez des composants depuis la sidebar
    </div>
  {/if}

  {#each callsheetData as block (block._id)}
    {#if components[block._name]}
      {@const Component = components[block._name]}
      <div class="component-wrapper" data-component-id={block._id}>
        <Component {...block} />
      </div>
    {:else}
      <div class="unknown-block">
        ⚠️ Composant inconnu : {block._name}
      </div>
    {/if}
  {/each}
</div>

<style>
  .callsheet-preview {
    min-height: 100vh;
    padding: 2rem;
    background: white;
  }

  .component-wrapper {
    margin-bottom: 2rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
    font-size: 1.5rem;
  }

  .unknown-block {
    padding: 1rem;
    background: #fee;
    color: #c00;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
</style>
```

## 6. Dépannage

### "Layout cassé"
✅ Vérifiez que vous avez bien `<div id="ve-components">` dans votre page preview

### "Les composants ne s'affichent pas"
✅ Vérifiez que vous écoutez bien `'visual-editor-update'` et non `'ve-data'`
✅ Regardez les logs dans la console navigateur (F12)

### "Les changements ne sont pas reflétés"
✅ Vérifiez que vous mettez à jour `callsheetData` de manière reactive (avec spread operator `[...array]`)
