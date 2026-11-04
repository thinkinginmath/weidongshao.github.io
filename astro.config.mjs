import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://uubright.com',
  output: 'static',
  publicDir: './.generated-public',
  trailingSlash: 'always',
});
