<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
    complete?: boolean
  }

  let { children, complete = true }: Props = $props()
</script>

<div class="ve-base-styles" class:complete>
  {@render children()}
</div>

<style>
  :global(visual-editor) {
    display: block;
  }

  .ve-base-styles {
    --ve-background: #fff;
    --ve-primary: #1771e6;
    --ve-dark: #202227;
    --ve-primary-hover: #388afa;
    --ve-primary-light: #1771e626;
    --ve-color: #111827;
    --ve-hover: #f3f4f9;
    --ve-color-light: #6b7280;
    --ve-field-border: rgb(209, 213, 219);
    --ve-field-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    --ve-blocs-background: rgba(0, 0, 0, 0.05);
    --ve-danger: #ae2121;
    --ve-danger-light: rgba(255, 0, 0, 0.05);
    --ve-shadow-dragging: rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    --ve-gap: 0.5em;
    font-size: 16px;
    line-height: 1.4;
  }

  .ve-base-styles :global(*),
  .ve-base-styles :global(*::before),
  .ve-base-styles :global(*::after) {
    box-sizing: border-box;
  }

  .ve-base-styles.complete :global(img),
  .ve-base-styles.complete :global(picture),
  .ve-base-styles.complete :global(video),
  .ve-base-styles.complete :global(canvas),
  .ve-base-styles.complete :global(svg) {
    display: block;
    max-width: 100%;
  }

  .ve-base-styles.complete :global(input),
  .ve-base-styles.complete :global(button),
  .ve-base-styles.complete :global(textarea),
  .ve-base-styles.complete :global(select) {
    font: inherit;
  }
</style>
