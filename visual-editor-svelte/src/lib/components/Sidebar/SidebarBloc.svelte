<script lang="ts">
  import type { EditorComponentData, EditorComponentDefinition } from '$lib/types'
  import { editorStore } from '$lib/stores/editor.svelte'
  import { tick } from 'svelte'
  import SidebarHeading from './SidebarHeading.svelte'
  import SidebarFields from './SidebarFields.svelte'
  import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte'
  import Flex from '$lib/components/ui/Flex.svelte'
  import DragHandle from '$lib/components/ui/DragHandle.svelte'
  import { t } from '$lib/functions/i18n'

  interface Props {
    data: EditorComponentData
    definition?: EditorComponentDefinition
    path: string
  }

  let { data, definition, path }: Props = $props()

  let blocElement: HTMLDivElement
  let isFocused = $derived(editorStore.focusIndex === data._id)
  let isCollapsed = $state(!isFocused)

  // Extract label from data if definition has a label field
  let label = $derived(
    definition?.label && data[definition.label] ? (data[definition.label] as string) : null
  )

  // Strip HTML tags from label for display
  let labelSafe = $derived(label?.replace(/<[^>]*>/g, '') || null)

  function toggleCollapsed() {
    isCollapsed = !isCollapsed
  }

  function focusBloc() {
    if (isCollapsed) {
      editorStore.setFocusIndex(path)
    }
    toggleCollapsed()
  }

  function handleRemove() {
    editorStore.removeBloc(data)
  }

  // Auto-expand and scroll when focused
  $effect(() => {
    if (isFocused) {
      isCollapsed = false
      tick().then(() => {
        if (blocElement) {
          blocElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    } else {
      isCollapsed = true
    }
  })

  // Missing definition case
  if (!definition) {
    return (
      <div class="sidebar-bloc-wrapper sidebar-bloc-missing" data-dragging={false}>
        <DragHandle />
        <div class="missing-content">
          <strong>Composant manquant</strong>
          <p>Le composant "{data._name}" n'est pas défini</p>
          <ButtonIcon danger onclick={handleRemove} title={t('deleteComponent')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"
                fill="currentColor"
              />
            </svg>
          </ButtonIcon>
        </div>
      </div>
    )
  }
</script>

<div bind:this={blocElement} class="sidebar-bloc-wrapper" data-dragging={false}>
  <DragHandle />
  <SidebarHeading
    title={definition.title}
    description={isCollapsed ? labelSafe : null}
    onclick={focusBloc}
  >
    {#snippet hoverActions()}
      <!-- Copy action will be added later -->
      <ButtonIcon danger onclick={handleRemove} title={t('deleteComponent')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path
            d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"
            fill="currentColor"
          />
        </svg>
      </ButtonIcon>
    {/snippet}
    {#snippet children()}
      <ButtonIcon
        onclick={toggleCollapsed}
        style="transform: rotate({isCollapsed ? -90 : 0}deg); transition: transform 0.3s;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path
            d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"
            fill="currentColor"
          />
        </svg>
      </ButtonIcon>
    {/snippet}
  </SidebarHeading>

  {#if !isCollapsed}
    <Flex column gap={1} style="margin-top: 0.5em;">
      <SidebarFields fields={definition.fields} {data} {path} />
    </Flex>
  {/if}
</div>

<style>
  .sidebar-bloc-wrapper {
    position: relative;
    padding: 0.8em 0.6em 0.8em 1.4em;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s;
    cursor: inherit;
  }

  .sidebar-bloc-wrapper[data-dragging='true'] {
    box-shadow: var(--ve-shadow-dragging);
    transition: box-shadow 0.3s !important;
    z-index: 10;
  }

  .sidebar-bloc-missing {
    background-color: #fff3cd;
    border-color: #ffc107;
  }

  .missing-content {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 0.5em 0;
  }

  .missing-content strong {
    color: var(--ve-color);
  }

  .missing-content p {
    margin: 0;
    font-size: 0.9em;
    color: var(--ve-color-light);
  }
</style>
