import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
        customElement: true
      }
    })
  ],

  resolve: {
    alias: {
      $lib: resolve('./src/lib')
    }
  },

  build: {
    lib: {
      entry: resolve('./src/lib/index.ts'),
      name: 'VisualEditor',
      fileName: (format) => `visual-editor.${format}.js`
    },
    rollupOptions: {
      external: [
        'svelte',
        'svelte/internal',
        'svelte-dnd-action',
        /^@tiptap\//
      ],
      output: {
        globals: {
          svelte: 'Svelte'
        }
      }
    }
  },

  server: {
    port: 3000,
    proxy: {
      '/preview': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },

  test: {
    globals: true,
    environment: 'jsdom'
  }
})
