<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'
  import Flash from './ui/Flash.svelte'
  import { t } from '$lib/functions/i18n'

  // Reactive values from store
  let rollbackMessage = $derived(editorStore.rollbackMessage)

  function handleRollback() {
    editorStore.rollback()
  }

  function handleHide() {
    editorStore.voidRollback()
  }
</script>

<Flash onclick={handleRollback} onhide={handleHide} duration={3}>
  {#snippet children()}
    {rollbackMessage || ''}
  {/snippet}
  {#snippet action()}
    {t('rollback')}
  {/snippet}
</Flash>
