import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import markdownBase from './src/lib/markdown-base.mjs';

// The Pages workflow supplies these from actions/configure-pages.
// Local development stays at / without assuming a repository name or domain.
const base = process.env.PAGES_BASE_PATH || '/';

export default defineConfig({
  output: 'static',
  site: process.env.PAGES_SITE_URL || undefined,
  base,
  trailingSlash: 'always',
  markdown: { processor: satteri({ hastPlugins: [markdownBase({ base })] }) },
});
