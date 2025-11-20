<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import type { EditorComponentDefinitions } from '$lib/types'
  import Modal from '$lib/components/ui/Modal.svelte'
  import BlocSelectorSearch from './BlocSelectorSearch.svelte'
  import BlocSelectorGrid from './BlocSelectorGrid.svelte'
  import BlocSelectorItem from './BlocSelectorItem.svelte'
  import { t } from '$lib/functions/i18n'

  interface Props {
    iconsUrl: string
  }

  let { iconsUrl }: Props = $props()

  const ALL_TAB = 'Tous les blocs'

  let searchValue = $state('')
  let currentTab = $state('')
  let isVisible = $derived(editorStore.addBlockIndex !== undefined)
  let definitions = $derived(editorStore.definitions)
  let hiddenCategories = $derived(editorStore.hiddenCategories)

  // Build categories from definitions
  let categories = $derived.by(() => {
    const allCategories = Object.values(definitions)
      .filter((d) => d.category)
      .filter((d) => !hiddenCategories.includes(d.category ?? ''))
      .reduce(
        (acc, d) => (acc.includes(d.category!) ? acc : [...acc, d.category!]),
        [] as string[]
      )

    return [ALL_TAB, ...allCategories]
  })

  // Get filtered items for a category
  function getFilteredItems(category: string) {
    return Object.keys(definitions)
      .filter((key) => !hiddenCategories.includes(definitions[key]!.category ?? ''))
      .filter(searchDefinition(searchValue, category, definitions))
  }

  function searchDefinition(
    search: string,
    category: string,
    definitions: EditorComponentDefinitions
  ) {
    return (key: string) => {
      const categoryFilter =
        category === ALL_TAB ? true : definitions[key]!.category === category
      const searchFilter =
        search === ''
          ? true
          : definitions[key]!.title.toLowerCase().includes(search.toLowerCase())
      return categoryFilter && searchFilter
    }
  }

  function handleVisibilityChange() {
    editorStore.setAddBlockIndex(null)
    searchValue = ''
  }

  function handleAddBlock(name: string) {
    editorStore.addBlock(name)
  }

  function handleSearchChange(value: string) {
    searchValue = value
  }

  // Initialize current tab when categories change
  $effect(() => {
    if (categories.length > 0 && !currentTab) {
      currentTab = categories[0]
    }
  })

  // Reset search when modal becomes visible
  $effect(() => {
    if (!isVisible) {
      searchValue = ''
    }
  })
</script>

<Modal isOpen={isVisible} onclose={handleVisibilityChange} title={t('addComponent')}>
  <BlocSelectorSearch value={searchValue} onchange={handleSearchChange} />

  <div class="tabs-container">
    <div class="tabs-list">
      {#each categories as category}
        <button
          type="button"
          class="tab-button"
          class:active={currentTab === category}
          onclick={() => (currentTab = category)}
        >
          {category}
        </button>
      {/each}
    </div>

    <div class="tabs-content">
      {#each categories as category}
        {#if currentTab === category}
          <div class="tab-panel">
            <BlocSelectorGrid>
              {#each getFilteredItems(category) as key (key)}
                <BlocSelectorItem
                  name={key}
                  definition={definitions[key]!}
                  {iconsUrl}
                  onclick={() => handleAddBlock(key)}
                />
              {/each}
            </BlocSelectorGrid>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</Modal>

<style>
  .tabs-container {
    margin: 1.5rem 0;
  }

  .tabs-list {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1em;
  }

  .tab-button {
    background-color: var(--ve-hover);
    border-radius: 56px;
    padding: 0.6rem 1rem;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition:
      color 0.3s,
      background-color 0.3s;
    color: var(--ve-color);
  }

  .tab-button.active {
    color: var(--ve-primary);
    background-color: var(--ve-primary-light);
  }

  .tab-button:hover:not(.active) {
    background-color: var(--ve-blocs-background);
  }

  .tab-panel {
    animation: fadeIn 0.2s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
