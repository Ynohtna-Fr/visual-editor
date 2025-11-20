<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {}

  let { ...rest }: Props = $props()
</script>

<div class="ve-drag-handle" role="button" tabindex="0" {...rest}></div>

<style>
  .ve-drag-handle {
    width: 10px;
    position: absolute;
    top: 0.5rem;
    left: 3px;
    bottom: 0.5rem;
    cursor: move;
    background: radial-gradient(
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 30%,
        rgba(0, 0, 0, 0) 31%,
        rgba(0, 0, 0, 0)
      )
      left top / 5px 5px repeat;
  }
</style>
