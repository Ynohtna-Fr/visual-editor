<script lang="ts">
  import type { EditorComponentData } from '$lib/types'
  import SidebarHeader from './SidebarHeader.svelte'
  import SidebarFooter from './SidebarFooter.svelte'
  import SidebarBlocs from './SidebarBlocs.svelte'
  import { editorStore } from '$lib/stores/editor.svelte'

  interface Props {
    data: EditorComponentData[]
    onclose: () => void
  }

  let { data, onclose }: Props = $props()

  const ViewMode = {
    BLOCS: 'BLOCS',
    TEMPLATES: 'TEMPLATES'
  } as const

  type ViewMode = (typeof ViewMode)[keyof typeof ViewMode]

  let viewMode = $state<ViewMode>(ViewMode.BLOCS)
  let templates = $derived(editorStore.templates)
  let hasTemplates = $derived(templates.length > 0)
  let showEmpty = $derived(data.length === 0 && hasTemplates)
  let isTemplateMode = $derived(viewMode === ViewMode.TEMPLATES)

  function toggleMode() {
    viewMode = viewMode === ViewMode.BLOCS ? ViewMode.TEMPLATES : ViewMode.BLOCS
  }
</script>

<div class="sidebar-wrapper">
  <SidebarHeader {onclose}>
    {#snippet children()}
      {#if hasTemplates}
        <button type="button" class="mode-toggle" onclick={toggleMode}>
          {#if isTemplateMode}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M4 4v5h16V4H4ZM3 2a1 1 0 0 0-1 1v7c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1H3ZM4 15v5h16v-5H4Zm-1-2a1 1 0 0 0-1 1v7c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1H3Z"
                clip-rule="evenodd"
              />
              <path fill="currentColor" d="M5 5h6v1H5V5ZM5 16h6v1H5v-1Z" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M5 8v12h14V8H5zm0-2h14V4H5v2zm15 16H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zM7 10h4v4H7v-4zm0 6h10v2H7v-2zm6-5h4v2h-4v-2z"
              />
            </svg>
          {/if}
        </button>
      {/if}
    {/snippet}
  </SidebarHeader>

  {#if viewMode === ViewMode.BLOCS}
    {#if showEmpty}
      <div class="sidebar-empty">
        <p>Aucun composant pour le moment</p>
        <button onclick={() => (viewMode = ViewMode.TEMPLATES)}>
          Utiliser un modèle
        </button>
      </div>
    {:else}
      <SidebarBlocs {data} />
    {/if}
  {:else if viewMode === ViewMode.TEMPLATES}
    <!-- Templates list will go here -->
    <div class="sidebar-templates">
      {#each templates as template (template.name)}
        <div class="template-item">
          <span>{template.name}</span>
        </div>
      {/each}
    </div>
  {/if}

  <SidebarFooter />
</div>

<style>
  .sidebar-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #fbfbfd;
    z-index: 2;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.2),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    animation: slideIn 0.7s cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .mode-toggle {
    background: none;
    border: none;
    padding: 0.5em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
  }

  .sidebar-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    padding: 2em;
  }

  .sidebar-templates {
    flex: 1;
    overflow-y: auto;
    padding: 1em;
  }

  .template-item {
    padding: 1em;
    margin-bottom: 0.5em;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
</style>
