import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    svelte({
      preprocess: [
        preprocess({
          postcss: {
            plugins: [autoprefixer],
          },
        }),
      ],
    }),
  ],
});
