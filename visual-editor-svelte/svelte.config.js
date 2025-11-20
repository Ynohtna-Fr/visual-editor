import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter()
  },

  compilerOptions: {
    // Custom elements are enabled per-component with <svelte:options customElement="..." />
    // Global setting is false to avoid converting all components
    customElement: false,
    // Enable Svelte 5 runes ($state, $derived, $effect, etc.)
    runes: true
  }
}

export default config
