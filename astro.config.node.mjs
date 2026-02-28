// Alternative config for Node/Ubuntu VPS deployment
// Usage: astro build --config astro.config.node.mjs
// Then: node ./dist/server/entry.mjs (or use your process manager)
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});
