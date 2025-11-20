<script lang="ts">
  import type { EditorComponentDefinition } from '$lib/types'

  interface Props {
    name: string
    definition: EditorComponentDefinition
    iconsUrl: string
    onclick: () => void
  }

  let { name, definition, iconsUrl, onclick }: Props = $props()

  const icon = iconsUrl.replace('[name]', name)
  const title = definition.title
</script>

<button class="bloc-item" type="button" {onclick}>
  <div class="bloc-image">
    <img src={icon} alt="" />
  </div>
  <div class="bloc-title">{title}</div>
</button>

<style>
  .bloc-item {
    background-color: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;
    color: var(--ve-color);
  }

  .bloc-item:hover,
  .bloc-item:focus {
    outline: none;
    color: var(--ve-primary);
  }

  .bloc-item:hover .bloc-image img,
  .bloc-item:focus .bloc-image img {
    transform: translateY(-5px);
  }

  .bloc-image {
    width: 100%;
    background-color: var(--ve-hover);
    height: 107px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: 0.3s;
    border-radius: 4px;
  }

  .bloc-image img {
    width: 120px;
    height: 80px;
    object-fit: contain;
    border-radius: 4px;
    transition: transform 0.3s;
  }

  .bloc-image::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background: var(--ve-primary);
    mix-blend-mode: saturation;
    border-radius: 4px;
    transition: opacity 0.3s;
  }

  .bloc-item:hover .bloc-image::after,
  .bloc-item:focus .bloc-image::after {
    opacity: 1;
  }

  .bloc-item:focus .bloc-image {
    transition: none;
    border: 2px solid var(--ve-primary);
  }

  .bloc-title {
    text-align: center;
  }
</style>
