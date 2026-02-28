import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import netlify from '@astrojs/netlify';

// Use Netlify by default; switch to @astrojs/cloudflare for Cloudflare Pages
// or @astrojs/node for Ubuntu/VPS deployment
export default defineConfig({
  output: 'server',
  adapter: netlify(),
});
