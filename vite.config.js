import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
	plugins: [glsl(), wasm(), topLevelAwait()],
	build: {
		/** this make things working in production!! */
		rollupOptions: {
			treeshake: false,
		},
	},
})
