<script context="module">
    import Prism from "prismjs"

    Prism.languages.spwn = Prism.languages.extend("clike", {
        keyword:
            /\b(?:else|for|if|return|error|extract|let|type|import|impl|break|\=>|\->|continue|match|null|sync|throw|while|as|in|is)\b/,
        builtin: /\b(?:null|trigger|obj|\$|self)\b/,
        boolean: /\b(?:true|false)\b/,
        operator:
            /(==|!=|<=|>=|<|>|&&|\|\||!|=|\+\=|\-\=|\*\=|\/\=|\+|\-|\*|\/|%|\^|\.\.|\-\-|\+\+|\/\%|\/\%=|\^=|<=>|\||\&)/,
        number: /(?:\b\d+(\.\d+)?\b)|(\b([0-9]+|\?)[gbci]\b)/,
        string: /[a-z]?"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/,
        tag: /@([a-zA-Z_][a-zA-Z0-9_]*)/,
    })
    delete Prism.languages.spwn["class-name"]

    const highlight = (code, syntax) => Prism.highlight(code, Prism.languages[syntax], syntax)
</script>

<svelte:head>
    <script src="/ace-build/src-noconflict/ace.js" type="text/javascript" charset="utf-8" on:load={initializeEditor}></script>
</svelte:head>

<script lang="ts">
    import P5 from "p5-svelte"
    import { onMount } from 'svelte';
    import World from "./world/world"
    import triggerGraphSketch from "./trigger_graph_sketch/sketch"
    import worldSketch from "./sketch/sketch"
    import { createObject } from "./world/objectHandler"

    export let run_spwn
    export let init_panics
    export let check_syntax
    init_panics()

    import AnsiUp from "ansi_up"
    let ansiUp = new AnsiUp()

    let world = new World()

    let optimize = true

    import { CodeJar } from "@novacbn/svelte-codejar"
    import { Trigger } from "./objects/triggers"
    
    const [triggerSketch, updateBodies] = triggerGraphSketch(world)

    /*
c = counter()
c.display(45, 45)

for_loop(0..10, reset = false, (_) {
    i = counter(reset = false)
    while_loop(() => i < 10, () {
        i += 1
        c += 1	
    })
    while_loop(() => i > 0, () => i--)
    wait(1)
})
    */

    let value = `extract obj_props

$.print("Hello SPWN!")

c = counter()
c.display(45, 45)

$.add(obj{
	OBJ_ID: 1,
	X: 15,
	Y: 15,
	GROUPS: 10g,
})
$.add(obj{
	OBJ_ID: 1,
	X: 15,
	Y: 15,
	GROUPS: 10g,
    SCALING: 0.5,
})

while_loop(() => c < 10, () {
    10g.move(0, 20, 0.5)
    10g.move(20, 0, 0.5)
    10g.move(0, -20, 0.5)
    10g.move(-20, 0, 0.5)
    c += 1
})`


    let editor_console = ""
    let is_showing_error = false
    const run_code = async () => {
        let code = value
        let [txt, lvlStr, status] = run_spwn(code, optimize)
        if (status == "error") {
            editor_console = txt
            is_showing_error = true
            return
        }

        world.reset()
        lvlStr
            .split(";")
            .filter((e) => e.length > 0)
            .forEach((objStr) => {
                world.objects.push(createObject(objStr, world, world.objects.length))
            })

        updateBodies(world)

        editor_console = txt
        is_showing_error = false

        console.log(world.objects)

    }

    const check_syntax_code = async () => {
        let code = value
        let err = check_syntax(code)
        if (err.length > 0) {
            editor_console = err
            is_showing_error = true
        } else if (is_showing_error) {
            editor_console = ""
            is_showing_error = false
        }
    }

    const simulate_triggers = () => {
        // reset items
        Object.keys(world.itemIDs).forEach((id) => {
            world.itemIDs[id].value = 0
        })
        world.objects.forEach((obj) => {
            if (obj instanceof Trigger && !obj.spawnTriggered) {
                obj.trigger(world)
            }
        })
    }

    const initializeEditor = () => {
        let codeEditor = window.ace.edit("code-editor");
        codeEditor.setTheme("ace/theme/dracula");
        codeEditor.setValue(value);
        codeEditor.session.setMode("ace/mode/spwn");
        codeEditor.on("change", () => value = codeEditor.getValue())
    }
    

    run_code()
</script>

<!-- <link href="prism-vsc-dark-plus.css" rel="stylesheet" /> -->
<link href="prism-atom-dark.css" rel="stylesheet" />
<link href="atom-one-dark.css" rel="stylesheet" />
<!-- updates in the same way as the world sketch -->
<!-- yeah but the world sketch has an always running draw call accessing the world -->
<!-- unless im not understanding, the triggerSketch code just runs once on creation -->

<div class="everything">
    <div class="header">
        <a href="https://spu7nix.net/spwn"
            ><img class="logo" src="assets/images/spwn.svg" alt="SPWN Logo" height="36" /></a
        >
        <span class="logo-text">SPWN Playground</span>
    </div>

    <div class="playground">
        <div class="editor">
            <div class="editor-container">
                <div id="code-editor" contenteditable="true"></div>
            </div>

            <div id="console">
                {@html ansiUp.ansi_to_html(editor_console)}
            </div>

            <div class="buttons">
                <button id="run_button" class="big-button" on:click={run_code}> build </button>
                <button id="sim_button" class="big-button" style="background:#09493a" on:click={simulate_triggers}>
                    simulate
                </button>
            </div>
            <div class="optimize">
                <input type="checkbox" bind:checked={optimize} />
                Optimize Triggers
            </div>
        </div>

        <div class="simulation">
            <div id="trigger-graph-sketch" />
            <div id="sketch" />
        </div>
    </div>
</div>

<P5 sketch={triggerSketch} />

<P5 sketch={worldSketch(world)} />

<style>
    .everything {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .simulation {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        gap: 1rem;
    }


    .editor-container {
        position: relative;
        width: 100%;
        height: 75%;
        font-family: 'Source Code Pro', monospace;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }

    * {
        -moz-tab-size : 4;
        -o-tab-size : 4;
        tab-size : 4;
    }

    #code-editor {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 6px;
        margin: 0;
        padding: 8px;
        border: 2px solid #3b3b3b;
        box-shadow: 3px 3px 10px 0px #0005;
        /* background-color: #0002; */
        resize: none;
        color:rgba(255, 255, 255, 0.886);
        font-family: 'Source Code Pro', monospace;
        font-size: 16px;
        font-weight: 0;
    }



    .logo {
        display: block;
        transition: 0.5s all;
    }
    .logo:hover {
        display: auto;
        transform: rotate(360deg);
    }

    .logo-text {
        font-size: 25px;
        font-weight: 600;
        text-shadow: 2px 2px 5px #0005;
        margin: 0 0;
        padding: 0 0 2px 0;
    }

    .header {
        border-bottom: 1px solid rgb(58, 58, 58);
        padding: 8px;
        background: linear-gradient(180deg, rgba(40, 40, 40, 1) 0%, rgba(20, 20, 20, 1) 100%);

        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        gap: 12px;

        font-family: "Source Code Pro", monospace;
        color: #efefef;
    }

    .playground {
        width: 100%;
        height: calc(100% - 53px);
        background-color: rgb(20, 20, 26);
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        padding: 1rem;
        gap: 1rem;
    }
    
    .editor {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;

        background-color: #ffffff09;
        border-radius: 12px;

        font-family: "Source Code Pro", monospace;
        font-size: 16px;
        font-weight: 600;

        box-shadow: 3px 3px 10px 0px #0005;
    }

    .editor > .optimize {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: .5rem;
        color: rgba(255, 255, 255, 0.886);
    }

    input[type="checkbox"] {
        margin: 0;
        padding: 0;
    }

    * ::-webkit-scrollbar {
        width: 10px;
    }

    * ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.15);
        margin: 4px;
        border-radius: 10px;
    }

    /* Handle */
    * ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.486);
        border-radius: 10px;
        transition: 0.2s all;
    }

    /* Handle on hover */
    * ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.886);
    }
    
    #console {
        height: 40%;
        line-height: 20px;
        color: white;
        background: black;
        border: 2px solid #3b3b3b;
        overflow: auto;
        overflow-wrap: break-word;
        border-radius: 6px;
        font-weight: 600;

        padding: 10px;
        font-size: 16px;
        min-height: 100px;
        max-height: 500px;
        overflow-x: auto;
        white-space: pre-wrap;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;

        box-shadow: 3px 3px 10px 0px #0005;
    }
    .big-button {
        width: 100%;
        height: 60px;
        background: #551c1c;
        font-family: "Source Code Pro", monospace;
        color: #ffffff;
        font-size: 30px;
        white-space: nowrap;
        overflow: clip;
        letter-spacing: 0em;
        font-weight: 400;
        padding: 3px 20px;
        margin: 0 0 2px 0;
        border: solid rgba(255, 255, 255, 0.4) 2px;
        border-radius: 0px 14px 0px 14px;
        transition: all 0.1s ease-in-out 0s;
        box-shadow: 3px 3px 10px 0px #0005;
    }

    .big-button:hover {
        border-radius: 14px 0px 14px 0px;
    }

    .buttons {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        float: left;
    }

    #sketch {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        box-shadow: 3px 3px 10px 0px #0005;
    }

    #trigger-graph-sketch {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        box-shadow: 3px 3px 10px 0px #0005;
    }
</style>
