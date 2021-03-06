<script lang="ts">
	import P5 from "p5-svelte";
	import { World } from "./world/world";
	import triggerGraphSketch from "./trigger_graph_sketch/sketch";
	import { createObject } from "./world/objectHandler";
	import SvelteMarkdown from "svelte-markdown";
	import { tutorials } from "./tutorials";
	import { clamp } from "./util";
	import { Trigger } from "./objects/triggers";
	import { loadResources } from "./gd_world/resources";

	import * as GDWorld from "./gd_world/gd_world"

	export let run_spwn;
	export let init_panics;
	export let check_syntax;
	init_panics();

	enum GuiLayout {
		PortraitTabs,
		LandscapeTabs,
		Full,
	}

	enum Tab {
		Code,
		Sim,
	}

	let dwidth;
	let dheight;
	let layout: GuiLayout;
	let tab = Tab.Code;
	let tutorialMode = false;
	$: {
		const ar = (dwidth - (tutorialMode ? 500 : 0)) / dheight;
		if (ar < 1.3) {
			layout = GuiLayout.PortraitTabs;
		} else if (dheight < 600) {
			layout = GuiLayout.LandscapeTabs;
		} else {
			layout = GuiLayout.Full;
		}
	}


	import AnsiUp from "ansi_up";
	let ansiUp = new AnsiUp();

	const themes = [
		["Clouds Midnight", "clouds_midnight"],
		["Clouds", "clouds"],
		["Cobalt", "cobalt"],
		["Dawn", "dawn"],
		["Idle Fingers", "idle_fingers"],
		["Katzenmilch", "katzenmilch"],
		["Kr Theme", "kr_theme"],
		["Kuroir", "kuroir"],
		["Material Ocean", "material_ocean"],
		["Merbivore Soft", "merbivore_soft"],
		["Merbivore", "merbivore"],
		["Monokai", "monokai"],
		["Pastel On Dark", "pastel_on_dark"],
		["Solarized Dark", "solarized_dark"],
		["Solarized Light", "solarized_light"],
		["Tomorrow Night Blue", "tomorrow_night_blue"],
		["Tomorrow Night Bright", "tomorrow_night_bright"],
		["Tomorrow Night Eighties", "tomorrow_night_eighties"],
		["Tomorrow Night", "tomorrow_night"],
		["Tomorrow", "tomorrow"],
		["Twilight", "twilight"],
		["Vibrant Ink", "vibrant_ink"],
		["XCode", "xcode"],
	];

	let selectedTheme = "material_ocean";

	let world = new World();
	let optimize = true;

	const [triggerSketch, updateBodies] = triggerGraphSketch(world);


	import def_examples from "./examples";
	import { onMount } from "svelte";

	let examples = def_examples;

	let current_example = Object.keys(def_examples)[0];

	let editor_console = "";
	let is_showing_error = false;

	const buildLevel = async (lvlStr) => {
		world.reset();

		lvlStr
			.split(";")
			.filter((e) => e.length > 0)
			.forEach((objStr) => {
				world.objects.push(
					createObject(objStr, world, world.objects.length)
				);
			});
		world.init();
		GDWorld.createObjects(world)
	};
	let current_ls = "";
	let last_build = "";

	const run_code = async () => {
		let code = examples[current_example];
		last_build = code;
		let [txt, lvlStr, status] = run_spwn(code, optimize);
		if (status == "error") {
			editor_console = txt;
			is_showing_error = true;
			return;
		}

		current_ls = lvlStr;

		await buildLevel(lvlStr);
		updateBodies(world);

		editor_console = txt;
		is_showing_error = false;

		//console.log(world.objects)
	};

	const check_syntax_code = async () => {
		let code = examples[current_example];
		let err = check_syntax(code);
		if (err.length > 0) {
			editor_console = err;
			is_showing_error = true;
		} else if (is_showing_error) {
			editor_console = "";
			is_showing_error = false;
		}
	};

	const simulate_triggers = async () => {
		// await buildLevel(current_ls);
		setTimeout(() => {
			world.objects.forEach((obj) => {
				if (obj instanceof Trigger && !obj.spawnTriggered) {
					obj.trigger(world);
				}
			});
		}, 100);
	};

	let codeEditor;

	const initializeEditor = () => {
		codeEditor = (<any>window).ace.edit("code-editor");
		codeEditor.setValue(examples[current_example]);
		codeEditor.setBehavioursEnabled(true);
		codeEditor.setOption("scrollPastEnd", true);
		//codeEditor.setOption("showGutter", false)
		codeEditor.session.setMode("ace/mode/spwn");
		codeEditor.on("change", () => {
			examples[current_example] = codeEditor.getValue();
			check_syntax_code();
		});
		codeEditor.moveCursorTo(0, 0);
		codeEditor.setShowPrintMargin(false);
		codeEditor.setKeyboardHandler("ace/keyboard/vscode");
		codeEditor.setAutoScrollEditorIntoView(true);

		for (const i of document.getElementsByClassName("poop")) {
			(<any>window).ace.edit(i);
		}

		// let otherPoop = (<any>window).ace.edit(document.getElementById("test"))
	};

	$: codeEditor
		? (() => {
				codeEditor.setTheme(`ace/theme/${selectedTheme}`);
				tutSnippets.forEach((s) =>
					s.setTheme(`ace/theme/${selectedTheme}`)
				);
		  })()
		: "";

	let prevMousePos = { x: 0, y: 0 };

	let viewingDocs = false;
	let draggingDocs = false;

	let docsPos = { x: 40, y: 40 };
	let prevDocsPos = { x: 0, y: 0 };

	prevDocsPos.x = docsPos.x;
	prevDocsPos.y = docsPos.y;

	const drag = (e) => {
		if (draggingDocs) {
			docsPos.x = prevDocsPos.x + (e.screenX - prevMousePos.x);
			docsPos.y = prevDocsPos.y + (e.screenY - prevMousePos.y);
		} else if (draggingEditorSeparator) {
			let shift =
				(e.screenY - prevMousePos.y) /
				document.getElementById("code-and-console").offsetHeight;
			editorSeparator = clamp(prevEditorSeparator + shift, 0.1, 0.9);
			if (editorSeparator > 0.68 && editorSeparator < 0.72)
				editorSeparator = 0.7;
			codeEditor.resize();
		} else if (draggingSimSeparator) {
			let shift =
				(e.screenY - prevMousePos.y) /
				(
					document.getElementsByClassName(
						"simulation"
					)[0] as HTMLElement
				).offsetHeight;
			simSeparator = clamp(prevSimSeparator + shift, 0, 1);
			if (simSeparator > 0.48 && simSeparator < 0.52) simSeparator = 0.5;
		} else if (draggingPlaygroundSeparator) {
			let shift =
				(e.screenX - prevMousePos.x) /
				(
					document.getElementsByClassName(
						"playground"
					)[0] as HTMLElement
				).offsetWidth;
			playgroundSeparator = clamp(
				prevPlaygroundSeparator + shift,
				0.2,
				0.8
			);
			if (playgroundSeparator > 0.48 && playgroundSeparator < 0.52)
				playgroundSeparator = 0.5;
			codeEditor.resize();
		}
		//console.log(playgroundSeparator, simSeparator, editorSeparator);
	}; // i think follow triggers lag by 1 frame

	let draggingEditorSeparator = false;
	let editorSeparator = 0.7;
	let prevEditorSeparator = 0;

	

	let draggingSimSeparator = false;
	let simSeparator = 0.5;
	let prevSimSeparator = 0;

	let draggingPlaygroundSeparator = false;
	let playgroundSeparator = 0.5;
	let prevPlaygroundSeparator = 0;

	//run_code();

	let maximized = false;
	let selectedTutorial = 0;

	let tutSnippets = [];
	let solutionShown = false;
	let showmeStyle;
	$: showmeStyle = tutorials[selectedTutorial].solution
		? "opacity: 1; pointer-events: all;"
		: "opacity: 0.3; pointer-events: none;";

	// evil, evil code
	const selectTutorial = () => {
		document.querySelectorAll(".snippet").forEach((g) => {
			g.remove();
		});
		tutSnippets = [];

		codeEditor.setValue(tutorials[selectedTutorial].initialCode ?? "");
		codeEditor.moveCursorTo(0, 0);
		solutionShown = false;
		editor_console = "";

		setTimeout(() => {
			for (const i of document.querySelectorAll(
				".tutorial-content .highlight-spwn"
			)) {
				let snip = document.createElement("div");
				snip.className = "snippet";
				i.insertBefore(snip, i.children[0]);
				let gaga = i.children[1].textContent;
				let snippet = (<any>window).ace.edit(snip);
				snippet.setValue(gaga);
				snippet.setOption("scrollPastEnd", false);
				snippet.setOption("showGutter", false);
				snippet.session.setMode("ace/mode/spwn");
				snippet.setTheme(`ace/theme/${selectedTheme}`);
				snippet.moveCursorTo(0, 0);
				snippet.setShowPrintMargin(false);
				snippet.session.setUseWorker(false);
				snippet.setReadOnly(true);
				snippet.renderer.setPadding(6);
				snippet.renderer.setScrollMargin(5, 6);
				snippet.renderer.setStyle("disabled", true);
				snippet.blur();
				snippet.getSession().setUseWrapMode(true);
				snippet.renderer.$cursorLayer.element.style.display = "none";
				snippet.setOptions({
					maxLines: Infinity,
					highlightActiveLine: false,
					highlightGutterLine: false,
				});
				tutSnippets.push(snippet);
			}
		}, 1);
	};

	let gdWorldCanvas: HTMLCanvasElement;
	let triggerGraphCanvas: HTMLCanvasElement;

	onMount(() => {
		loadResources(() => {
			GDWorld.createApp(gdWorldCanvas, world)
			run_code()
		})
	})
	// window.loadLevelStr = (s) => {
	// 	buildLevel(s);
	// 	updateBodies(world);
	// 	console.log(world.objects.length, "objects")
	// }

</script>

<svelte:head>
	<script
		src="/ace-build/src-noconflict/ace.js"
		type="text/javascript"
		charset="utf-8"
		on:load={initializeEditor}></script>
</svelte:head>


<div style="font-family: Pusab;">gdfgsdfgsdfgsdfgsdfgdf</div>

<div class="everything" bind:clientWidth={dwidth} bind:clientHeight={dheight}>
	<div class="header">
		<a target="_blank" href="https://spu7nix.net/spwn">
			<img
				class="logo"
				src="assets/images/spwn.svg"
				alt="SPWN Logo"
				height="36"
			/></a
		>
		<span class="logo-text">SPWN Playground</span>
		<button
			class="header-button"
			on:click={() => {
				tutorialMode && (tab = Tab.Code);
				tutorialMode = !tutorialMode;
				tutorialMode && setTimeout(selectTutorial, 10);
			}}
		>
			{tutorialMode ? "Close Tutorial" : "Tutorial"}
		</button>

		<button
			class="header-button"
			on:click={() => {
				viewingDocs = !viewingDocs;
			}}>{viewingDocs ? "Close Documentation" : "Documentation"}</button
		>

		<img
			class="header-icons"
			src={maximized
				? "assets/images/minimize.svg"
				: "assets/images/maximize.svg"}
			alt={maximized ? "Minimize editor" : "Maximize editor"}
			style={`
                cursor: pointer;
                margin-bottom: 4px;
            `}
			height="26"
			on:click={() => {
				maximized = !maximized;
				setTimeout(() => {
					// nice!
					codeEditor.resize();
				}, 10);
			}}
		/>

		<a
			class="margin: 0; padding: 0;"
			target="_blank"
			href="https://github.com/Spu7Nix/SPWN-language"
		>
			<img
				class="header-icons"
				src="assets/images/github.png"
				alt="Github Icon"
				height="26"
			/></a
		>

		<a
			style="margin: 0; padding: 0;"
			target="_blank"
			href="https://discord.gg/kUzdUpNgZk"
		>
			<img
				class="header-icons"
				src="assets/images/discord.svg"
				alt="Discord Icon"
				height="26"
			/></a
		>
		<div class="header-right">
			Example:
			<select
				bind:value={current_example}
				on:change={() => {
					tab = Tab.Code;
					codeEditor.setValue(examples[current_example]);
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

	<div class="content">
		<!-- {#if tutorialMode} -->
		<div
			class="tutorial"
			style={`
                min-width: ${
					tutorialMode ? "min(max(500px, 40%), 100%)" : "0px"
				};
                max-width: ${
					tutorialMode ? "min(max(500px, 40%), 100%)" : "0px"
				};
                overflow-x: hidden;
                padding: 5px ${tutorialMode ? 5 : 0}px 10px ${
				tutorialMode ? 5 : 0
			}px;
                border-right: ${tutorialMode ? 1 : 0}px solid rgb(58, 58, 58);
            `}
		>
			<div class="tutorial-header">
				<img
					src="assets/images/arrow.svg"
					alt="Previous"
					height="24"
					style={`cursor: pointer; user-select: none; opacity: ${
						selectedTutorial == 0 ? 0.3 : 1
					}`}
					on:click={() => {
						tab = Tab.Code;
						selectedTutorial = Math.max(0, selectedTutorial - 1);
						selectTutorial();
					}}
				/>
				<select
					bind:value={selectedTutorial}
					on:change={selectTutorial}
				>
					{#each tutorials as tutorial, id}
						<option value={id}>{id + 1}. {tutorial.name}</option>
					{/each}
				</select>
				<img
					src="assets/images/arrow.svg"
					alt="Next"
					height="24"
					style={`cursor: pointer; user-select: none; transform: rotate(180deg); opacity: ${
						selectedTutorial == tutorials.length - 1 ? 0.3 : 1
					}`}
					on:click={() => {
						tab = Tab.Code;
						selectedTutorial = Math.min(
							tutorials.length - 1,
							selectedTutorial + 1
						);
						selectTutorial();
					}}
				/>
			</div>
			<div class="tutorial-content">
				<div class="weird-size-fixer">
					<SvelteMarkdown
						source={tutorials[selectedTutorial].content}
					/>
				</div>
			</div>
			<div class="tutorial-footer">
				{#if solutionShown}
					<button
						class="showme"
						style={showmeStyle}
						on:click={() => {
							tab = Tab.Code;
							codeEditor.setValue(
								tutorials[selectedTutorial].initialCode
							);
							codeEditor.moveCursorTo(0, 0);
							solutionShown = false;
						}}>Reset</button
					>
				{:else}
					<button
						class="showme"
						style={showmeStyle}
						on:click={() => {
							tab = Tab.Code;
							codeEditor.setValue(
								tutorials[selectedTutorial].solution
							);
							codeEditor.moveCursorTo(0, 0);
							solutionShown = true;
						}}>Show me</button
					>
				{/if}
			</div>
		</div>
		<!-- {/if} -->
		<!-- {#if layout == GuiLayout.Full || !tutorialMode} -->
		<div
			class="playground"
			style={`
            grid-template-columns: ${
				maximized
					? "1fr"
					: `${playgroundSeparator}fr auto ${
							1 - playgroundSeparator
					  }fr`
			};
            ${
				layout != GuiLayout.Full
					? "display:flex;flex-direction:column;padding-top:0px;"
					: ""
			}
        `}
		>
			{#if layout != GuiLayout.Full}
				<div class="tabs">
					<button
						class={last_build == examples[current_example] ||
						tab == Tab.Code
							? "tab-button"
							: "tab-button glow"}
						style={tab == Tab.Code
							? "color: rgb(255, 255, 255, 0.6);"
							: ""}
						on:click={() => {
							tab = Tab.Code;
						}}
					>
						Code
					</button>
					<button
						class={last_build != examples[current_example] ||
						tab == Tab.Sim
							? "tab-button"
							: "tab-button glow"}
						style={tab == Tab.Sim
							? "color: rgb(255, 255, 255, 0.6);"
							: ""}
						on:click={() => {
							tab = Tab.Sim;
						}}
					>
						Simulator
					</button>
				</div>
			{/if}
			<div
				class="editor"
				style={`
                    ${
						tab == Tab.Sim
							? `width: 0px;display:none;`
							: layout == GuiLayout.LandscapeTabs
							? `
                        display: grid;
                        grid-template-columns: 60% 40%;
                        gap: 10px;`
							: ""
					}
                `}
			>
				<div
					id="code-and-console"
					style={`
                    grid-template-rows: ${
						maximized
							? "1fr"
							: `${editorSeparator}fr auto ${
									1 - editorSeparator
							  }fr;
                    ${layout != GuiLayout.Full ? "display:block;" : ""}
                    ${layout == GuiLayout.PortraitTabs ? "height:160%;" : ""}
                    `
					};
                `}
				>
					<div class="editor-container">
						<div id="code-editor" />
					</div>

					{#if !maximized && layout == GuiLayout.Full}
						<img
							src="assets/images/resize.svg"
							alt="resize"
							height="16"
							draggable="false"
							on:dragstart|preventDefault={() => false}
							style={`
                            margin: auto;
                            opacity: 0.2;
                            cursor: row-resize;
                        `}
							on:mousedown={(e) => {
								prevMousePos.y = e.screenY;
								prevEditorSeparator = editorSeparator;
								draggingEditorSeparator = true;
							}}
						/>
						<div id="console">
							{@html ansiUp.ansi_to_html(editor_console)}
						</div>
					{/if}
				</div>

				{#if !maximized}
					<div
						class="buttons"
						style={layout != GuiLayout.Full
							? "flex-direction: column;gap: 3px;height:100%;"
							: ""}
					>
						{#if layout != GuiLayout.Full}
							<div id="console">
								{@html ansiUp.ansi_to_html(editor_console)}
							</div>
						{/if}
						<button
							id="run_button"
							class={last_build == examples[current_example]
								? "big-button"
								: "big-button glow"}
							style={last_build == examples[current_example]
								? "opacity: 0.5;"
								: ""}
							on:click={run_code}
							>{last_build == examples[current_example]
								? "rebuild"
								: "build"}</button
						>
						{#if layout == GuiLayout.Full}
							<button
								id="sim_button"
								class={current_ls == "" ||
								last_build != examples[current_example]
									? "big-button"
									: "big-button glow"}
								style={current_ls == ""
									? "opacity:0.5;cursor:not-allowed;"
									: last_build != examples[current_example]
									? "opacity:0.5;"
									: ""}
								on:click={() => {
									if (current_ls != "") simulate_triggers();
								}}
								>{last_build == examples[current_example]
									? "simulate"
									: "simulate*"}</button
							>
						{/if}
					</div>
					{#if layout == GuiLayout.Full}
						<div class="optimize">
							<input type="checkbox" bind:checked={optimize} />
							Optimize Triggers
						</div>
					{/if}
				{/if}
			</div>

			{#if !maximized && layout == GuiLayout.Full}
				<!-- what you doin -->
				<img
					src="assets/images/resize.svg"
					alt="resize"
					height="16"
					draggable="false"
					on:dragstart|preventDefault={() => false}
					style={`
                    margin: auto;
                    opacity: 0.2;
                    cursor: col-resize;
                    transform: rotate(90deg);
                `}
					on:mousedown={(e) => {
						prevMousePos.x = e.screenX;
						prevPlaygroundSeparator = playgroundSeparator;
						draggingPlaygroundSeparator = true;
					}}
				/>
			{/if}
			<!-- {#if !maximized} -->
			<div
				class="simulation"
				style={`
                display: ${
					maximized && layout == GuiLayout.Full
						? "none"
						: layout == GuiLayout.Full
						? "grid"
						: "flex"
				};
                
                ${
					layout == GuiLayout.PortraitTabs
						? "flex-direction: column;"
						: layout == GuiLayout.LandscapeTabs
						? "flex-direction: row;"
						: ""
				}
                ${
					layout == GuiLayout.Full
						? `grid-template-rows: ${simSeparator}fr auto ${
								1 - simSeparator
						  }fr;`
						: tab == Tab.Code
						? `width: 0px;display:none;`
						: ""
				}
                `}
			>
				<canvas bind:this={triggerGraphCanvas} class="trigger-graph-canvas" />
				{#if layout == GuiLayout.Full}
					<img
						src="assets/images/resize.svg"
						alt="resize"
						height="16"
						draggable="false"
						on:dragstart|preventDefault={() => false}
						style={`
                    margin: auto;
                    opacity: 0.2;
                    cursor: row-resize;
                `}
						on:mousedown={(e) => {
							prevMousePos.y = e.screenY;
							prevSimSeparator = simSeparator;
							draggingSimSeparator = true;
						}}
					/>
				{/if}
				<canvas bind:this={gdWorldCanvas}  class="gd-world-canvas" />
			</div>
			{#if layout != GuiLayout.Full && tab == Tab.Sim}
				<button
					id="sim_button"
					class={current_ls == "" ||
					last_build != examples[current_example]
						? "big-button"
						: "big-button glow"}
					style={current_ls == ""
						? "opacity:0.5;cursor:not-allowed;"
						: last_build != examples[current_example]
						? "opacity:0.5;"
						: ""}
					on:click={() => {
						if (current_ls != "") simulate_triggers();
					}}
					>{last_build == examples[current_example]
						? "simulate"
						: "simulate*"}</button
				>
			{/if}
		</div>
		<!-- {/if} -->
	</div>

	<div
		class="docs-window"
		on:pointerdown={(e) => {
			prevMousePos.x = e.screenX;
			prevMousePos.y = e.screenY;
			prevDocsPos.x = docsPos.x;
			prevDocsPos.y = docsPos.y;
			draggingDocs = true;
		}}
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
			on:mouseup={() => (draggingDocs = false)}
			style={`
            pointer-events: ${draggingDocs || !viewingDocs ? "none" : "all"};
            opacity: 0.9;
        `}
		/>
	</div>
</div>


<svelte:window
	on:pointerup={() => {
		draggingDocs = false;
		draggingEditorSeparator = false;
		draggingSimSeparator = false;
		draggingPlaygroundSeparator = false;
	}}
	on:pointermove={drag}
/>

<!-- {#if !maximized} -->
<P5 sketch={triggerSketch} />

<!-- {/if} -->
<style>
	@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

	@font-face {
		font-family: Pusab;
		src: url(/assets/fonts/pusab.otf);
	}
	@font-face {
		font-family: CodeFont;
		src: url(/assets/fonts/FiraCode-SemiBold.ttf);
	}

	canvas {
		outline: none;
	}

	.everything {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
	}

	.weird-size-fixer {
		max-height: 1px;
	}

	:global(.highlight-spwn > code) {
		display: none;
		font-family: CodeFont, monospace;
	}

	:global(.snippet) {
		width: 100%;
		height: 100%;
		border-radius: 6px;
		box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.198);
		/* background-color: #0003; */
		resize: none;
		/* color:rgba(255, 255, 255, 0.886); */
		font-family: CodeFont, monospace;
		font-size: 16px;
		font-weight: 600;
		border: 1.5px solid #ffffff26;
	}

	:global(.tutorial-content a) {
		color: rgb(255, 205, 89);
	}

	:global(.tutorial-content p) {
		color: rgb(255, 255, 255, 0.8);
	}

	:global(.tutorial-content code) {
		background-color: rgb(0, 0, 0, 0.3);
		padding-left: 3px;
		padding-right: 3px;
		border-radius: 6px;
		/*  its just for inline stuff `like this` */
	}

	:global(.tutorial-content tr:nth-child(even)) {
		background-color: rgb(0, 0, 0, 0.2);
	}

	:global(.tutorial-content th) {
		background-color: rgb(0, 0, 0, 0.4);
		border: none;
	}

	:global(.tutorial-content tr) {
		border: none;
	}
	:global(.tutorial-content td) {
		white-space: nowrap;
		padding: 5px 10px;
		border: none;
	}
	/* just wanted to say that this playground is balling */
	/*  it is truly balling */
	/*  when are we gonna do the scrollbars btw */
	:global(.tutorial-content table) {
		border: none;
		display: block;
		overflow: auto;
	}

	:global(.snippet .ace_marker-layer .ace_bracket) {
		display: none;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;

		box-sizing: border-box;
	}

	.tutorial {
		height: 100%;
		background-color: rgb(27, 27, 36);
		box-shadow: 3px 3px 10px 0px #0005;
		z-index: 10;

		display: flex;
		flex-direction: column;
		gap: 5px;
		box-sizing: border-box;
		color: #ffffffed;

		font-family: "Lato";
		font-size: 18px;
		letter-spacing: 0.1px;
		word-spacing: 2px;
		line-height: 1.5;

		transition: all 0.5s ease-in-out;
	}

	.tutorial-header {
		min-height: 50px;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.198);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 4px 0 4px;
		box-sizing: border-box;
		border-radius: 6px;
		overflow-x: hidden;
	}

	.tutorial-footer {
		min-height: 50px;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.198);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px 0 10px;
		box-sizing: border-box;
		border-radius: 6px;
		overflow-x: hidden;
	}

	button.showme {
		margin: 0;
		padding: 0 8px 0 8px;
		height: 30px;
		width: 90px;
		background-color: #aa3b3b;
		box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.198);
		text-align: center;
		font-weight: 600;
		color: white;
		border: none;
		border-radius: 6px;
		transition: all 0.15s;
		cursor: pointer;
		overflow: hidden;
		white-space: nowrap;
	}
	button.showme:hover {
		background-color: #e96363;
	}
	button.showme:active {
		background-color: #5f2b2b;
	}

	.tutorial-header > select {
		margin-bottom: 2px;
	}

	.tutorial-content {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 7px 16px 12px 8px;
		overflow-y: auto;
		overflow-x: hidden;
	}
	/*  might be my fault look */
	/* oh no the dreaded bug is happening */
	/*  */
	.docs-window {
		position: absolute;
		width: 50vw;
		height: 80vh;
		padding: 6px 6px 6px 100px;
		background-color: rgba(75, 69, 87, 0.5);
		border: 1px solid #fff2;
		border-radius: 24px;
		z-index: 1000;
		box-shadow: 8px 8px 36px 3px rgba(0, 0, 0, 0.637);
		backdrop-filter: blur(15px);
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
		box-sizing: border-box;
	}

	.editor-container {
		position: relative;
		width: 100%;
		height: 100%;
		font-family: "Source Code Pro", monospace;
		font-size: 16px;
		font-weight: 600;
		margin: 0;
		box-sizing: border-box;
	}

	* {
		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;
	}

	img {
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}


	#code-and-console {
		width: 100%;
		height: 100%;
		display: grid;
		resize: none;

		box-sizing: border-box;
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
		resize: none;
		font-size: 15px;
		font-family: CodeFont, monospace;
	}

	#console {
		line-height: 20px;
		height: max(100%, 100px);
		color: white;
		background: black;
		border: 2px solid #3b3b3b;
		overflow: auto;
		overflow-wrap: break-word;
		border-radius: 6px;
		margin: 0;
		box-sizing: border-box;
		resize: none;

		padding: 10px;
		font-size: 16px;
		overflow-x: auto;
		overflow-y: scroll;
		white-space: pre-wrap;
		white-space: -moz-pre-wrap;
		white-space: -pre-wrap;
		white-space: -o-pre-wrap;
		word-wrap: break-word;

		box-shadow: 3px 3px 10px 0px #0005;
		
		
		font-size: 15px;
		font-family: CodeFont, monospace;


	}

	.header-right {
		margin: 0 0 0 0;
		padding: 0;
		margin-left: auto;
		font-family: "Source Code Pro", monospace;
		font-size: 16px;
		font-weight: 600;
	}
	select {
		margin: 0;
		padding: 0;
		color: white;

		font-family: "Source Code Pro", monospace;
		font-size: 16px;
		font-weight: 600;
		background-color: #fff3;
		border: none;
		user-select: none;
	}

	.tabs {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 0 10px 0 10px;
		box-sizing: border-box;
		border-radius: 6px;
		overflow: hidden;
		max-height: 30px;
		min-height: 30px;
	}
	.tab-button {
		margin: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		background-color: rgb(0, 0, 0, 0.2);
		color: rgb(255, 255, 255, 0.4);
		font-weight: 200;
		font-size: 18px;
		font-family: "Source Code Pro", monospace;
		/* box-shadow: 3px 3px 10px 0px #0005; */
		border: none;

		transition: 0.1s all;
		user-select: none;
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
		background-color: transparent;
		color: white;
		font-weight: 300;
		font-size: 18px;
		font-family: "Source Code Pro", monospace;
		/* box-shadow: 3px 3px 10px 0px #0005; */
		border-radius: 6px;
		border: none;
		transition: 0.1s all;
		user-select: none;
	}

	.header-button:hover {
		background-color: rgba(255, 255, 255, 0.1);
		/* font-weight: 600; */
	}
	.header-button:active {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.header-icons {
		margin: 4px 0 0 0;
		opacity: 0.3;
		transition: all 0.3s;
		user-select: none;
	}
	.header-icons:hover {
		opacity: 1;
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
		padding: 0 0 4px 0;
	}

	.header {
		max-height: 53px;
		border-bottom: 1px solid rgb(58, 58, 58);
		padding: 8px;
		background: linear-gradient(
			180deg,
			rgba(40, 40, 40, 1) 0%,
			rgba(20, 20, 20, 1) 100%
		);

		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;
		gap: 12px;
		overflow-x: auto;
		overflow-y: clip;
		white-space: nowrap;

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
		display: grid;
		box-sizing: border-box;
		padding: 1rem;
	}

	.editor {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 1rem;
		resize: none;

		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 1rem;

		background-color: #ffffff09;
		border-radius: 12px;

		font-family: "Source Code Pro", monospace;
		font-size: 16px;
		font-weight: 600;

		box-shadow: 3px 3px 10px 0px #0005;
	}

	/* .editor >  */
	.optimize {
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

	:global(::-webkit-scrollbar) {
		width: 10px;
		height: 10px;
	}
	/* :global(.ace_scrollbar-v) {
        display: none;
    } */

	:global(::-webkit-scrollbar-track) {
		background: rgba(255, 255, 255, 0.1);
		margin: 4px 0px;
		border-radius: 10px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: rgba(255, 255, 255, 0.199);
		border-radius: 10px;
		transition: 0.2s all;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: rgba(255, 255, 255, 0.886);
	}

	/*  you can now counter multiply without everyithing going to shit :DDD */
	.big-button {
		width: 100%;
		height: 60px;
		font-family: "Source Code Pro", monospace;
		color: #ffffff;
		font-size: 150%;
		letter-spacing: 0em;
		overflow-wrap: anywhere;
		overflow: hidden;
		text-overflow: clip;
		font-weight: 400;
		padding: 3px 20px;
		margin: 0 0 2px 0;
		border: solid rgba(255, 255, 255, 0.4) 2px;
		border-radius: 0px 14px 0px 14px;
		transition: all 0.1s ease-in-out 0s;
		box-shadow: 3px 3px 10px 0px #0005;
		box-sizing: border-box;
		/* animation: glowing 700ms infinite; */
	}

	.glow {
		animation: glowing 3000ms infinite;
	}

	@keyframes glowing {
		0% {
			border: solid rgba(255, 255, 255, 0.4) 2px;
		}
		50% {
			border: solid rgb(58, 209, 71, 0.7) 2px;
			box-shadow: 0px 0px 7px rgb(58, 255, 71, 0.2);
		}
		100% {
			border: solid rgba(255, 255, 255, 0.4) 2px;
		}
	}

	.big-button:hover {
		border-radius: 14px 0px 14px 0px;
		cursor: pointer;
	}
	/* // wait it totallyu is */
	#run_button {
		background: #551c1c;
	}

	#run_button:hover {
		background: #2a1313;
	}
	#run_button:active::after {
		content: "ing...";
	}

	#sim_button {
		background: #09493a;
	}
	#sim_button:hover {
		background: #0e2520;
	}

	.buttons {
		width: 100%;
		min-width: 0px;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		box-sizing: border-box;
	}

	.gd-world-canvas {
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		border-radius: 12px;
		box-shadow: 3px 3px 10px 0px #0005;
		border: 2px solid #3b3b3b;
		box-sizing: border-box;
	}

	.trigger-graph-canvas {
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		border-radius: 12px;
		box-shadow: 3px 3px 10px 0px #0005;
		border: 2px solid #3b3b3b;
		box-sizing: border-box;
	}
</style>
