import { resolve } from 'path'
import { defineConfig } from 'vite'

const upstreamUrl = process.env.UPSTREAM_URL || '127.0.0.1:3000'

/** @type {import('vite').UserConfig} */
export default defineConfig({
	root: resolve(__dirname, 'src'),
	publicDir: 'public',
	appType: 'mpa',

	build: {
		outDir: '../dist',
		rollupOptions: {
			input: {
				index: resolve(__dirname, 'src/index.html'),
				lt: resolve(__dirname, 'src/lt.html'),
				table: resolve(__dirname, 'src/table.html'),
				score_control: resolve(__dirname, 'src/score_control.html'),
				score_graphic: resolve(__dirname, 'src/score_graphic.html'),
				score_simple: resolve(__dirname, 'src/score_simple.html'),
			},
		},
	},

	server: {
		proxy: {
			'/api': {
				target: `http://${upstreamUrl}`,
			},
			'/socket.io': {
				target: `ws://${upstreamUrl}`,
				ws: true,
			},
		},
	},
})
