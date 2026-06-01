import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

import altitudeAdapter from '@thg-altitude/astro-adapter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  adapter: altitudeAdapter(),
  output: 'server',

  build: {
    assets: 'ssr-assets',
  },

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      minify: !!import.meta.env.PROD,
    },
  },
});
