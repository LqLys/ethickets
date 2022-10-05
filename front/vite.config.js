import { sveltekit } from '@sveltejs/kit/vite';
import nodePolyfills from "rollup-plugin-polyfill-node";
const production = process.env.NODE_ENV === "production";

const config = {
	plugins: [
		sveltekit(),
		!production &&
		nodePolyfills({
			include: ["node_modules/**/*.js", new RegExp("node_modules/.vite/.*js")]
		})
	],
	build: {
		rollupOptions: {
			plugins: [
				// ↓ Needed for build
				nodePolyfills()
			]
		},
		// ↓ Needed for build if using WalletConnect and other providers
		commonjsOptions: {
			transformMixedEsModules: true
		}
	}
};

export default config;
