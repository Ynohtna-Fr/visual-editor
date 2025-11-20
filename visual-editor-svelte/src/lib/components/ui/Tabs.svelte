<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Tab {
    title: string
    content: Snippet
  }

  interface Props {
    tabs: Tab[]
  }

  let { tabs }: Props = $props()
  let currentTab = $state(tabs[0]?.title || '')

  $effect(() => {
    if (!currentTab && tabs.length > 0) {
      currentTab = tabs[0].title
    }
  })
</script>

<div class="ve-tabs">
  <div class="ve-tabs-list">
    {#each tabs as tab}
      <button
        type="button"
        class="ve-tabs-trigger"
        class:active={currentTab === tab.title}
        onclick={() => (currentTab = tab.title)}
      >
        {tab.title}
      </button>
    {/each}
  </div>

  <div class="ve-tabs-content">
    {#each tabs as tab}
      {#if currentTab === tab.title}
        <div class="ve-tabs-panel">
          {@render tab.content()}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .ve-tabs {
    display: flex;
    flex-direction: column;
  }

  .ve-tabs-list {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1em;
  }

  .ve-tabs-trigger {
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

  .ve-tabs-trigger.active {
    color: var(--ve-primary);
    background-color: var(--ve-primary-light);
  }

  .ve-tabs-trigger:hover:not(.active) {
    background-color: var(--ve-blocs-background);
  }

  .ve-tabs-content {
    flex: 1;
  }

  .ve-tabs-panel {
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
