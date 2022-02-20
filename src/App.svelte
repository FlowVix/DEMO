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

<script lang="ts">
  import P5 from "p5-svelte"
  import World from "./world/world"
  import worldSketch from "./sketch/sketch"
  import { parseProps, createObject } from "./world/objectHandler"
  export let run_spwn
  export let init_panics
  init_panics()

  import AnsiUp from "ansi_up"
  let ansiUp = new AnsiUp()

  let world = new World()

  import { CodeJar } from "@novacbn/svelte-codejar"
  import { Trigger } from "./objects/triggers"

  // console.log(parseProps("1,5,2,15,3,30"))
  // console.log(parseProps("1,5,,,,2,15,,57,6.4.9"))
  // console.log(parseProps("1,5,43,1a0.5a0.2a1a0"))

  let value = `
$.print("Hello SPWN!")

while_loop(() => true, () {
  10g.move(0, 20, 0.5)
  10g.move(20, 0, 0.5)
  10g.move(0, -20, 0.5)
  10g.move(-20, 0, 0.5)
})
    `
  let editor_console = ""
  const run_code = () => {
    let code = value

    let [txt, lvlStr] = run_spwn(code)

    world.reset()
    lvlStr
      .split(";")
      .filter((e) => e.length > 0)
      .forEach((objStr) => {
        world.objects.push(createObject(objStr, world))
      })

    console.log(world.objects)

    editor_console = txt
    console.log("a")
  }

  const simulate_triggers = () => {
    world.objects.forEach((obj) => {
      if (obj instanceof Trigger && !obj.spawnTriggered) {
        obj.trigger(world)
      }
    })
  }
</script>

<!-- <link href="prism-vsc-dark-plus.css" rel="stylesheet" /> -->
<link href="prism-atom-dark.css" rel="stylesheet" />

<P5 parentDivStyle="border-radius: 20px;" sketch={worldSketch(world)} />

<div class="everything">
  <div class="header">
    <a href="https://spu7nix.net/spwn"><img class="logo" src="assets/images/spwn.svg" alt="SPWN Logo" height="36" /></a>
    <span class="logo-text">SPWN Playground</span>
  </div>

  <div class="playground">
    <div class="editor">
      <CodeJar
        style="
                font-family:'Source Code Pro', monospace;
                background-color:#0005;
                border-radius:6px;
                margin:0;
                border: 2px solid #3b3b3b;
                box-shadow: 3px 3px 10px 0px #0005;
            "
        syntax="spwn"
        {highlight}
        bind:value
        tab={"\t"}
      />

      <div id="console">
        {@html ansiUp.ansi_to_html(editor_console)}
      </div>

      <div class="buttons">
        <button id="run_button" class="big-button" on:click={run_code}> >> build >> </button>
        <button id="sim_button" class="big-button" style="background:#09493a" on:click={simulate_triggers}>
          >> simulate >>
        </button>
      </div>
    </div>

    <div id="sketch" />
  </div>
</div>

<style>
  .everything {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
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
    height: 100%;
    background-color: rgb(20, 20, 26);
    display: flex;
    flex-direction: row;
    box-sizing: border-box;

    padding: 1rem;
    gap: 1rem;
  }

  .editor {
    width: 50%;
    height: 100%;

    box-sizing: border-box;
    padding: 1rem;

    display: grid;
    grid-template-rows: 3fr 2fr auto;
    gap: 1rem;

    background-color: #ffffff09;
    border-radius: 12px;

    font-family: "Source Code Pro", monospace;
    font-size: 16px;
    font-weight: 600;

    box-shadow: 3px 3px 10px 0px #0005;
  }

  #console {
    line-height: 20px;
    color: white;
    background: black;
    border: 2px solid #3b3b3b;
    overflow: auto;
    overflow-wrap: break-word;
    border-radius: 6px;
    font-weight: 400;

    padding: 10px;
    font-size: 20px;
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
    width: 40%;
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
    float: left;
  }

  #sketch {
    width: 50%;
    border-radius: 12px;
    box-shadow: 3px 3px 10px 0px #0005;
  }
</style>
