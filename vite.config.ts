/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		copyPublicDir: false,
		rollupOptions: {
			external: ['react', 'react/jsx-runtime']
		},
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			formats: ['es']
		}
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './test/setup.ts',
		coverage: {
			include: ['lib/components/*']
		}
	}
})
