<script lang="ts">
  import type { EditorComponentData } from '$lib/types'
  import { editorStore } from '$lib/stores/editor.svelte'
  import { flip } from 'svelte/animate'
  import PreviewItem from './PreviewItem.svelte'
  import PreviewAddFloating from './PreviewAddFloating.svelte'
  import PreviewAddButton from './PreviewAddButton.svelte'

  interface Props {
    data: EditorComponentData[]
    initialHTML: Record<string, string>
    previewUrl: string
    iframeWindow?: Window | null
    usePostMessagePreview?: boolean
  }

  let { data, initialHTML = {}, previewUrl, iframeWindow = null, usePostMessagePreview = false }: Props = $props()

  let definitions = $derived(editorStore.definitions)

  function setAddBlockIndex(index: number) {
    editorStore.setAddBlockIndex(index)
  }
</script>

<div class="preview-items">
  {#each data as item, index (item._id)}
    <div animate:flip={{ duration: 300 }}>
      <PreviewAddFloating onclick={() => setAddBlockIndex(index)} />
      <PreviewItem
        data={item}
        title={definitions[item._name]?.title || ''}
        initialHTML={initialHTML[item._id] || ''}
        {previewUrl}
        {iframeWindow}
        {usePostMessagePreview}
      />
    </div>
  {/each}
  <PreviewAddButton onclick={() => setAddBlockIndex(data.length)} />
</div>

<style>
  .preview-items {
    display: flex;
    flex-direction: column;
  }
</style>
