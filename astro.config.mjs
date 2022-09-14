import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import prefetch from '@astrojs/prefetch';

// https://astro.build/config
export default defineConfig({
	site:'https://tutorlearn.co.ke',
	integrations:[
		tailwind(),
		svelte(),
		sitemap(),
		prefetch()
	]
});
