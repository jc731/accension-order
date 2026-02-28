// Alternative config for Cloudflare Pages deployment
// Usage: astro build --config astro.config.cloudflare.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'advanced',
    runtime: {
      mode: 'local',
      type: 'pages',
    },
  }),
});
