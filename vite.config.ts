import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [devtoolsJson(),
	tailwindcss(), enhancedImages(), sveltekit(),],
	server: {
		fs: {
			allow: ['..']
		}
	}
});
