<script lang="ts">
  import type { EditorComponentData } from '$lib/types'
  import type { DndEvent } from 'svelte-dnd-action'
  import { dndzone } from 'svelte-dnd-action'
  import { editorStore } from '$lib/stores/editor.svelte'
  import { moveItem } from '$lib/functions/array'
  import SidebarBloc from './SidebarBloc.svelte'

  interface Props {
    data: EditorComponentData[]
  }

  let { data }: Props = $props()

  // Map items to include 'id' property for svelte-dnd-action
  let items = $state(data.map(item => ({ ...item, id: item._id })))
  let definitions = $derived(editorStore.definitions)

  // Sync with prop changes
  $effect(() => {
    items = data.map(item => ({ ...item, id: item._id }))
  })

  function handleDndConsider(e: CustomEvent<DndEvent<EditorComponentData>>) {
    items = e.detail.items
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<EditorComponentData>>) {
    const newItems = e.detail.items
    items = newItems

    // Find the from and to indices
    const fromIndex = data.findIndex((item) => item._id === e.detail.info.id)
    const toIndex = newItems.findIndex((item) => item._id === e.detail.info.id)

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      editorStore.updateData(moveItem(data, fromIndex, toIndex))
    }
  }
</script>

<div
  class="sidebar-blocs"
  use:dndzone={{ items, flipDurationMs: 200, dropTargetStyle: {}, type: 'sidebar-blocs' }}
  onconsider={handleDndConsider}
  onfinalize={handleDndFinalize}
>
  {#each items as item, index (item._id)}
    <SidebarBloc data={item} definition={definitions[item._name]} path={index.toString()} />
  {/each}
</div>

<style>
  .sidebar-blocs {
    display: grid;
    grid-template-columns: 1fr;
    flex-direction: column;
    grid-gap: 1em;
    padding: 1em;
    overflow: auto;
    scrollbar-gutter: stable;
  }
</style>
