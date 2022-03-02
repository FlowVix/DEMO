import App from './App.svelte';

// const app = new App({
// 	target: document.body,
// 	props: {
        
// 	}
// });

// Load the .toml file of your Rust project.
// The wasm-plugin runs `wasm-pack build` and cpoies the output into
// `svelte-app/target` directory.
// The `.wasm` file is located in the `svelte-app/public/build` dir.
import wasm from './wasm-import';

// we can do that if you want to
const init = async () => {
    const spwn_api = await wasm(); // you need to save the file for me to see the difference

    const app = new App({
        target: document.body,
        props: {
          // https://svelte.dev/docs#Creating_a_component
          run_spwn: spwn_api.run_spwn,
		      init_panics: spwn_api.init_panics,
          check_syntax: spwn_api.check_syntax,
        }
    });
};

init();