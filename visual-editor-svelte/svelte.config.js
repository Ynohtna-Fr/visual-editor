import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter()
  },

  compilerOptions: {
    // Enable custom element support for Web Component export
    customElement: false, // Will be enabled per-component basis
    runes: true // Enable Svelte 5 runes
  }
}

export default config
