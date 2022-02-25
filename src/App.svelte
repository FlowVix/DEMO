<script lang="ts">
    import P5 from "p5-svelte"
    import {World} from "./world/world"
    import triggerGraphSketch from "./trigger_graph_sketch/sketch"
    import { worldSketch } from "./sketch/sketch"
    import { createObject } from "./world/objectHandler"

    export let run_spwn
    export let init_panics
    export let check_syntax
    init_panics()

    import AnsiUp from "ansi_up"
    let ansiUp = new AnsiUp()

    const themes = [
        ["Ambiance", "ambiance"],
        ["Chaos", "chaos"],
        ["Chrome", "chrome"],
        ["Clouds Midnight", "clouds_midnight"],
        ["Clouds", "clouds"],
        ["Cobalt", "cobalt"],
        ["Crimson Editor", "crimson_editor"],
        ["Dawn", "dawn"],
        ["Dracula", "dracula"],
        ["Dreamweaver", "dreamweaver"],
        ["Eclipse", "eclipse"],
        ["Github", "github"],
        ["Gob", "gob"],
        ["Gruvbox", "gruvbox"],
        ["Idle Fingers", "idle_fingers"],
        ["iPlastic", "iplastic"],
        ["Katzenmilch", "katzenmilch"],
        ["Kr Theme", "kr_theme"],
        ["Kuroir", "kuroir"],
        ["Material Ocean", "MaterialOceanHighContrast"],
        ["Merbivore Soft", "merbivore_soft"],
        ["Merbivore", "merbivore"],
        ["Mono Industrial", "mono_industrial"],
        ["Monokai", "monokai"],
        ["Nord Dark", "nord_dark"],
        ["One Dark", "one_dark"],
        ["Pastel On Dark", "pastel_on_dark"],
        ["Solarized Dark", "solarized_dark"],
        ["Solarized Light", "solarized_light"],
        ["Sql Server", "sqlserver"],
        ["Terminal", "terminal"],
        ["Textmate", "textmate"],
        ["Tomorrow Night Blue", "tomorrow_night_blue"],
        ["Tomorrow Night Bright", "tomorrow_night_bright"],
        ["Tomorrow Night Eighties", "tomorrow_night_eighties"],
        ["Tomorrow Night", "tomorrow_night"],
        ["Tomorrow", "tomorrow"],
        ["Twilight", "twilight"],
        ["Vibrant Ink", "vibrant_ink"],
        ["XCode", "xcode"],
    ]

    let selectedTheme = "MaterialOceanHighContrast"

    let world = new World()
    let optimize = true

    import { Trigger } from "./objects/triggers"

    const [triggerSketch, updateBodies] = triggerGraphSketch(world)
    const [gdWorldSketch] = worldSketch(world)

    import def_examples from "./examples"
    import { setG5 } from "./gp5"
    let examples = def_examples

    let current_example = Object.keys(def_examples)[0]

    let editor_console = ""
    let is_showing_error = false

    const buildLevel = (lvlStr) => {
        world.reset()
        lvlStr
            .split(";")
            .filter((e) => e.length > 0)
            .forEach((objStr) => {
                world.objects.push(createObject(objStr, world, world.objects.length))
            })
        world.init()
        // that quirk is kinda sick
        updateBodies(world)
    }

    const run_code = async () => {
        let code = examples[current_example]
        let [txt, lvlStr, status] = run_spwn(code, optimize)
        if (status == "error") {
            editor_console = txt
            is_showing_error = true
            return
        }

        console.log(lvlStr)
        buildLevel(lvlStr)

        editor_console = txt
        is_showing_error = false

        //console.log(world.objects)
    }

    const check_syntax_code = async () => {
        let code = examples[current_example]
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
        Object.keys(world.groupIDs).forEach((id) => {
            world.groupIDs[id].on = true
            world.groupIDs[id].opacity = 1
        })
        world.objects.forEach((_, i) => {
            world.objects[i].disables = 0
        })
        world.moveCommands = []
        world.alphaCommands = {}
        world.touchListeners = []

        world.objects.forEach((obj) => {
            if (obj instanceof Trigger && !obj.spawnTriggered) {
                obj.trigger(world)
            }
        })
    }

    let codeEditor

    const initializeEditor = () => {
        codeEditor = (<any>window).ace.edit("code-editor")
        codeEditor.setValue(examples[current_example])
        codeEditor.setBehavioursEnabled(true)
        codeEditor.setOption("scrollPastEnd", true)
        //codeEditor.setOption("showGutter", false)
        codeEditor.session.setMode("ace/mode/spwn")
        codeEditor.on("change", () => {
            examples[current_example] = codeEditor.getValue()
            check_syntax_code()
        })
        codeEditor.moveCursorTo(0, 0)
        codeEditor.setShowPrintMargin(false)
        codeEditor.setKeyboardHandler("ace/keyboard/vscode")
        codeEditor.setAutoScrollEditorIntoView(true)
        console.log(codeEditor.renderer)
    }

    $: codeEditor ? codeEditor.setTheme(`ace/theme/${selectedTheme}`) : ""


    let docsMaximized = false;

    let viewingDocs = false
    let dragging = false

    let docsPos = { x: 40, y: 40 }

    let prevDocsPos = { x: 0, y: 0 }
    prevDocsPos.x = docsPos.x
    prevDocsPos.y = docsPos.y
    let prevMousePos = { x: 0, y: 0 }
    const startDrag = (e) => {
        prevMousePos.x = e.screenX
        prevMousePos.y = e.screenY
        prevDocsPos.x = docsPos.x
        prevDocsPos.y = docsPos.y
        dragging = true
    }
    // eyo im going for a walk
    // if you need something to do check out the "test" example
    // o oke hav fun
    const drag = (e) => {
        if (dragging) {
            docsPos.x = prevDocsPos.x + (e.screenX - prevMousePos.x)
            docsPos.y = prevDocsPos.y + (e.screenY - prevMousePos.y)
            console.log(docsPos.x, docsPos.y)
        }
    }

    run_code()

    let importFile
    let importedFile

    const fileImported = () => {
        console.log("a")
        if (importedFile && importedFile.length > 0) {
            let reader = new FileReader()
            reader.readAsText(importedFile[0], "UTF-8")
            reader.onload = function (evt) {
                examples[current_example] = evt.target.result
                codeEditor.setValue(examples[current_example])
            }
        }
    }

    let maximized = false

    let globalP5 = (p5) => {
        p5.setup = () => {
            setG5(p5)
        }
    }
</script>

<!--  did you see the test example thing -->
<!--  its supposed to toggle off the else case first -->
<!-- its doing both -->
<!-- yeah, isnt that just the wellknown gd quirk -->
<!-- hm -->
<!-- in the graph, are triggers orderered vertically after their order in world.objects? -->
<!-- yes they are in their trigger order, from what ive seen -->
<!--  they are in the correct order in the example -->
<!-- ill debug the order they're triggered in -->

<svelte:head>
    <script
        src="/ace-build/src-noconflict/ace.js"
        type="text/javascript"
        charset="utf-8"
        on:load={initializeEditor}></script>
</svelte:head>

<!-- <link href="prism-vsc-dark-plus.css" rel="stylesheet" /> -->
<link href="prism-atom-dark.css" rel="stylesheet" />
<link href="atom-one-dark.css" rel="stylesheet" />
<!-- updates in the same way as the world sketch -->
<!-- yeah but the world sketch has an always running draw call accessing the world -->
<!-- unless im not understanding, the triggerSketch code just runs once on creation -->

<!-- yo sput -->
<!-- i got an epic one -->

<div class="everything">
    <div class="header">
        <a target="_blank" href="https://spu7nix.net/spwn">
            <img class="logo" src="assets/images/spwn.svg" alt="SPWN Logo" height="36" /></a
        >
        <span class="logo-text">SPWN Playground</span>
        <input
            type="file"
            accept=".spwn"
            style="display: none"
            bind:this={importFile}
            bind:files={importedFile}
            on:change={fileImported}
        />
        <button
            class="header-button"
            on:click={() => {
                viewingDocs = !viewingDocs
            }}>{viewingDocs ? "Close Docs" : "Open Docs"}</button
        >
        <button class="header-button" on:click={importFile.click()}>Import .spwn</button>
        <button
            class="header-button"
            on:click={() => {
                maximized = !maximized
                setTimeout(() => {
                    codeEditor.resize()
                }, 10)
            }}>{maximized ? "Minimize Editor" : "Maximize Editor"}</button
        >
        <a style="margin: 0; padding: 0;" target="_blank" href="https://github.com/Spu7Nix/SPWN-language">
            <img class="header-icons" src="assets/images/github.png" alt="Github Icon" height="26" /></a
        >
        <a style="margin: 0; padding: 0;" target="_blank" href="https://discord.gg/kUzdUpNgZk">
            <img class="header-icons" src="assets/images/discord.svg" alt="Discord Icon" height="26" /></a
        >
        <div class="header-right">
            Example:
            <select
                bind:value={current_example}
                on:change={() => {
                    codeEditor.setValue(examples[current_example])
                }}
            >
                {#each Object.keys(examples) as name}
                    <option value={name}>{name}</option>
                {/each}
            </select>
            Theme:
            <select bind:value={selectedTheme}>
                {#each themes as [theme_name, theme_id]}
                    <option value={theme_id}>{theme_name}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="playground">
        <div class="editor">
            <div class="editor-container">
                <div id="code-editor" />
            </div>

            {#if !maximized}
                <div id="console">
                    {@html ansiUp.ansi_to_html(editor_console)}
                </div>

                <div class="buttons">
                    <button id="run_button" class="big-button" on:click={run_code}> build </button>
                    <button id="sim_button" class="big-button" on:click={simulate_triggers}>
                        simulate
                    </button>
                </div>
                <div class="optimize">
                    <input type="checkbox" bind:checked={optimize} />
                    Optimize Triggers
                </div>
            {/if}
        </div>
        {#if !maximized}
            <div class="simulation">
                <div id="trigger-graph-sketch" />
                <div id="sketch" />
            </div>
        {/if}
    </div>

    <div
        class="docs-window"
        on:mousedown={startDrag}
        style={`
        left: ${docsPos.x}px;
        top: ${docsPos.y}px;
        opacity: ${viewingDocs ? "1" : "0"};
        pointer-events: ${!viewingDocs ? "none" : "all"};
        transition: opacity 0.3s;
    `}
    >
        <iframe
            title="sex"
            class="docs"
            src="https://spu7nix.net/spwn/#"
            on:mouseup={() => (dragging = false)}
            style={`
            pointer-events: ${dragging || !viewingDocs ? "none" : "all"};
            opacity: 0.98;
        `}
        />
    </div>
</div>

<svelte:window on:mouseup={() => (dragging = false)} on:mousemove={drag} />

{#if !maximized}
    <!-- <P5 sketch={triggerSketch} /> -->
    <P5 sketch={gdWorldSketch} />
{/if}
<P5 sketch={globalP5} />

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

    .docs-window {
        position: absolute;
        width: 50vw;
        height: 80vh;
        padding: 40px 6px 6px 6px;
        background-color: rgba(75, 69, 87, 0.5);
        border: 1px solid #fff2;
        border-radius: 24px;
        z-index: 1000;
        box-shadow: 8px 8px 36px 3px rgba(0, 0, 0, 0.637);
        backdrop-filter: blur(6px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
        font-family: "Source Code Pro", monospace;
        font-size: 24px;
        gap: 100px;
        font-weight: 600;
        text-align: center;
        box-sizing: border-box;

        /* gonna go sleep now, gotta get some rest before i tackle those optimization bugs tommorow */
    }

    .docs {
        width: 100%;
        height: 100%;
        border-radius: 18px;
        border: 1px solid #fff2;
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
        height: 100%;
        font-family: "Source Code Pro", monospace;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }

    * {
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
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
        /* background-color: #0003; */
        resize: none;
        /* color:rgba(255, 255, 255, 0.886); */
        font-family: "Source Code Pro", monospace;
        font-size: 16px;
        font-weight: 600;
    }

    .header-right {
        margin: 0 0 0 0;
        padding: 0;
        margin-left: auto;
        font-family: "Source Code Pro", monospace;
        font-size: 16px;
        font-weight: 600;
    }
    .header-right > select {
        margin: 0;
        padding: 0;
        color: white;

        font-family: "Source Code Pro", monospace;
        font-size: 16px;
        font-weight: 600;
        background-color: #fff3;
        border: none;
    }

    /* :global(embed .markdown-section#main) {
        background-color: red;
    } */

    option {
        margin: 0;
        padding: 0;
        color: black;

        font-family: "Source Code Pro", monospace;
        font-size: 16px;
        font-weight: 600;
        background-color: transparent;
        border: none;
    }

    .header-button {
        margin: 0;
        padding: 3px 6px 3px 6px;
        margin: 0 0 1px 0;
        background-color: #fff4;
        color: white;
        font-weight: 600;
        font-family: "Source Code Pro", monospace;
        box-shadow: 3px 3px 10px 0px #0005;
        border-radius: 6px;
        border: none;
        transition: 0.1s all;
    }

    .header-button:hover {
        background-color: #fff6;
    }
    .header-button:active {
        background-color: #fff2;
    }

    .header-icons {
        margin: 4px 0 0 0;
        transition: all 0.3s;
    }
    .header-icons:hover {
        transform: scale(1.2);
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
        max-height: 53px;
        border-bottom: 1px solid rgb(58, 58, 58);
        padding: 8px;
        background: linear-gradient(180deg, rgba(40, 40, 40, 1) 0%, rgba(20, 20, 20, 1) 100%);

        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        gap: 12px;
        overflow: clip;

        margin: 0;

        font-family: "Source Code Pro", monospace;
        color: #efefef;
        box-sizing: border-box;
        animation: open-header 0.5s ease-in-out forwards;
    }

    .playground {
        width: 100%;
        height: 100%;
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
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.886);
    }

    input[type="checkbox"] {
        margin: 0;
        padding: 0;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }
    /* :global(.ace_scrollbar-v) {
        display: none;
    } */

    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.15);
        margin: 4px;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.486);
        border-radius: 10px;
        transition: 0.2s all;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.886);
    }

    #console {
        height: 50%;
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
        overflow-x: auto;
        white-space: pre-wrap;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;

        box-shadow: 3px 3px 10px 0px #0005;
    }
    /*  you can now counter multiply without everyithing going to shit :DDD */
    .big-button {
        width: 100%;
        height: 60px;
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
        content: "gaga";
        border-radius: 14px 0px 14px 0px;
    }

    #run_button {
        background: #551c1c;
    }


    #run_button:hover {
        background: #2a1313;
    }
    #run_button:active::after {
        content: 'ing...';
    }

    #sim_button {
        background: #09493a;
    }
    #sim_button:hover {
        background: #0e2520;
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
