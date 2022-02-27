import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import rust from "@wasm-tool/rollup-plugin-rust";

//import svelteStaticHtml from "rollup-plugin-svelte-static-html";

const production = !process.env.ROLLUP_WATCH;

// did you see the tutorial things i made
// yee very epic
// there is a thing in the loop examples where `=>` becomes `=&gt;`
// maybe check that out

// lmao i saw that, thought it was a typo
function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				}
			);

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default {
	input: "src/main.ts",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "public/build/app.js",
		inlineDynamicImports: true,
		// allowSyntheticDefaultImports: true,
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: "app.css" }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production,
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload("public"),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		// Add the configuration for your wasm-tool plugins
		// The generated .wasm file is placed in the /build/ folder.
		// To tell the server where to fetch the .wasm file you have to specify
		// the path otherwise you get a 404 error (.wasm file not found).
		rust({
			verbose: true,
			release: true,
			serverPath: "/build/",
		}),

		// svelteStaticHtml({
		// 	component: "src/App.svelte",
		// 	output: "public/build/index.html",
		// }),
	],
	watch: {
		clearScreen: false,
	},
};
