import { defineConfig } from 'astro/config';

import altitudeAdapter from '@thg-altitude/astro-adapter';

export default defineConfig({
  adapter: altitudeAdapter(),
  output: 'server',

  build: {
    assets: 'ssr-assets',
  },

  vite: {
    build: {
      minify: !!import.meta.env.PROD,
    },
  },
});
