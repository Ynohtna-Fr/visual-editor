<script lang="ts">
  import type { Snippet } from 'svelte'
  import { editorStore, PreviewModes } from '$lib/stores/editor.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte'
  import Flex from '$lib/components/ui/Flex.svelte'
  import { t } from '$lib/functions/i18n'

  interface Props {
    onclose: () => void
    children?: Snippet
  }

  let { onclose, children }: Props = $props()

  let isPhone = $derived(editorStore.previewMode === PreviewModes.PHONE)

  function togglePreviewMode() {
    editorStore.togglePreviewMode()
  }

  function handleAddComponent() {
    editorStore.setAddBlockIndex(null)
  }
</script>

<div class="sidebar-header">
  <Flex between>
    <div>
      <ButtonIcon title={t('close')} onclick={onclose}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path
            d="M6.99999 5.58599L11.95 0.635986L13.364 2.04999L8.41399 6.99999L13.364 11.95L11.95 13.364L6.99999 8.41399L2.04999 13.364L0.635986 11.95L5.58599 6.99999L0.635986 2.04999L2.04999 0.635986L6.99999 5.58599Z"
            fill="currentColor"
          />
        </svg>
      </ButtonIcon>
    </div>
    <Flex>
      {#if children}
        {@render children()}
      {/if}
      <ButtonIcon onclick={togglePreviewMode} title={t('responsiveView')}>
        {#if isPhone}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M4 16h16V5H4v11zm9 2v2h4v2H7v-2h4v-2H2.992A.998.998 0 0 1 2 16.993V4.007C2 3.451 2.455 3 2.992 3h18.016c.548 0 .992.449.992 1.007v12.986c0 .556-.455 1.007-.992 1.007H13z"
            />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M7 4v16h10V4H7zM6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm6 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
            />
          </svg>
        {/if}
      </ButtonIcon>
      <Button onclick={handleAddComponent}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          style="margin-right: 0.5em;"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
            fill="currentColor"
          />
        </svg>
        {t('addComponent')}
      </Button>
    </Flex>
  </Flex>
</div>

<style>
  .sidebar-header {
    padding: 0 1em;
    flex: none;
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: rgba(0, 0, 0, 0.05) 0 1px 2px 0;
    height: 64px;
    display: flex;
    align-items: center;
  }
</style>
