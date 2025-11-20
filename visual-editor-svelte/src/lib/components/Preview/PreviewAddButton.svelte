<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'

  interface Props {
    onclick?: () => void
  }

  let { onclick }: Props = $props()
</script>

<div class="wrapper">
  <Button {onclick}>
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
    Ajouter un bloc
  </Button>
</div>

<style>
  .wrapper {
    background-color: transparent;
    border: 2px dashed var(--ve-field-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: var(--ve-color);
    width: calc(100% - 2rem);
    margin: 1rem;
    padding: 1rem;
  }
</style>
