import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let siteConfig = { domain: 'example.com', niche: 'Default', city: 'City' };
try {
  const configPath = resolve('./src/data/site.config.json');
  siteConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
} catch (e) {
  console.warn('[astro.config] site.config.json non trovato — uso default. Phase 4 iniettera questo file al deploy.');
}

export default defineConfig({
  site: `https://${siteConfig.domain}`,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // RIMOSSO: nessun define — le pagine importano site.config.json direttamente
  },
});
