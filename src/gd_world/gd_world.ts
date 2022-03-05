import * as PIXI from "pixi.js"
import { Regular } from "../objects/regular";
import { Display, TextObject } from "../objects/special";
import type {World} from "../world/world"

import {touch_buttons} from "../gd_world/resources"
import { TouchMode } from "../objects/triggers";

const CAMERA_SPEED = 10;

let app: PIXI.Application;
let objects: PIXI.Container;

let prevWidth = 0;
let prevHeight = 0;

let cameraPos = {x: 0, y: 0}
let cameraMove = {x: 0, y: 0}
let prevCameraPos = {x: 0, y: 0}


let zoom = 1;
let zoomExp = 0;
let zoomExpLerp = 0;



let renderMethods = []

const createObjects = (world: World) => {
    objects.removeChildren()
    renderMethods = []
    world.objects.forEach((obj, i) => {

        let objRoot = new PIXI.Container();
        let methods = {}
        obj.render(objRoot, methods)

        objRoot.position.x = obj.pos.x
        objRoot.position.y = -obj.pos.y
        
        objRoot.scale.x = obj.scale.x
        objRoot.scale.y = obj.scale.y

        objRoot.rotation = obj.rotation * Math.PI / 180

        objects.addChild(objRoot)
        renderMethods.push(methods)

    })
}

const updateObjects = (world: World) => {

    let screenWorldBounds = {
        left: cameraPos.x - app.screen.width/2/zoom,
        right: cameraPos.x + app.screen.width/2/zoom,
        up: cameraPos.y + app.screen.height/2/zoom,
        down: cameraPos.y - app.screen.height/2/zoom,
    }

    world.objects.forEach((obj, i) => {

        const methods = renderMethods[i]

        objects.getChildAt(i).position.x = obj.pos.x
        objects.getChildAt(i).position.y = -obj.pos.y

        if (!(
            obj.pos.x > screenWorldBounds.left - 30 &&
            obj.pos.x < screenWorldBounds.right + 30 &&
            obj.pos.y < screenWorldBounds.up + 30 &&
            obj.pos.y > screenWorldBounds.down - 30
        )) {
            objects.getChildAt(i).renderable = false
            return
        } else {
            objects.getChildAt(i).renderable = true
        }

        objects.getChildAt(i).rotation = -obj.rotation * Math.PI / 180
        objects.getChildAt(i).alpha = obj.disables > 0 ? 0 : obj.getTotalOpacity(world)
        // objects.getChildAt(i).scale.x = world.objects[i].scale.x
        // objects.getChildAt(i).scale.y = world.objects[i].scale.y

        if (obj instanceof Display) {
            if (obj.itemID in world.itemIDs) {
                methods.changeText(world.itemIDs[obj.itemID].value)
            }
        } else if (obj instanceof Regular) {
            methods.tintMain(world.getColor(obj.mainID))
            methods.tintDetail(world.getColor(obj.detailID))
        } else if (obj instanceof TextObject) {
            methods.changeColor(world.getColor(obj.color_id))
        }

    })
}


const createApp = (canvas: HTMLCanvasElement, world: World) => {

    
    let mouseX = 0;
    let mouseY = 0;

    let prevMouseX = 0;
    let prevMouseY = 0;

    let dragging = false;

    
    let pressingInput1 = false;
    let pressingInput2 = false;
    let clickingButton = false;

    const mouseInside = () => {
        return mouseX >= 0 && mouseX <= canvas.offsetWidth && mouseY >= 0 && mouseY <= canvas.offsetHeight
    }

    const activateListeners = (activate: boolean, touch2: boolean) => {
        if (touch2) pressingInput2 = activate
        else pressingInput1 = activate

        world.touchListeners.forEach((tl) => {
            if (!tl.dualMode && touch2) return
            if ((!tl.holdMode) && (!activate)) return
            switch (tl.touchMode) {
                case TouchMode.Normal:
                    world.toggleGroupID(tl.groupID, !world.groupIDs[tl.groupID].on)
                    break;
                case TouchMode.On:
                    world.toggleGroupID(tl.groupID, activate)
                    break;
                case TouchMode.Off:
                    world.toggleGroupID(tl.groupID, !activate)
                    break;
            }
            if (world.groupIDs[tl.groupID].on) {
                world.spawnGroupID(tl.groupID)
            }
        })
    }


    app = new PIXI.Application({view: canvas, resizeTo: canvas, backgroundColor: 0x5f79b3, antialias: true})
    
    let center = new PIXI.Container();
    app.stage.addChild(center)

    app.renderer.plugins.interaction
        .on('pointerdown', (e) => {
            [prevCameraPos.x, prevCameraPos.y] = [cameraPos.x, cameraPos.y];
            [prevMouseX, prevMouseY] = [e.data.global.x, e.data.global.y];
            [mouseX, mouseY] = [e.data.global.x, e.data.global.y]
            dragging = true;
        })
        .on('pointerup', (e) => {
            dragging = false;
        })
        .on('pointermove', (e) => {
            mouseX = e.data.global.x
            mouseY = e.data.global.y
        })

    let keys = []
    app.renderer.view.tabIndex = 1000
    app.renderer.view.addEventListener('keydown', (event) => {
        if (keys.includes(event.keyCode)) return
        keys.push( event.keyCode )
        switch (event.keyCode) {
            case 65:
                cameraMove.x -= CAMERA_SPEED;
                break;
            
            case 87:
                cameraMove.y += CAMERA_SPEED;
                break;
                
            case 68:
                cameraMove.x += CAMERA_SPEED;
                break;
            
            case 83:
                cameraMove.y -= CAMERA_SPEED;
                break;

            case 38:
                activateListeners(true, false)
                break;

            case 32:
                activateListeners(true, true)
                break;
        }
    })
    app.renderer.view.addEventListener('keyup', (event) => {
        keys = keys.filter(e => e != event.keyCode)
        switch (event.keyCode) {
            case 65:
                cameraMove.x = 0;
                break;
            
            case 87:
                cameraMove.y = 0;
                break;
                
            case 68:
                cameraMove.x = 0;
                break;
            
            case 83:
                cameraMove.y = 0;
                break;
            
            case 38:
                if (pressingInput1) {
                    activateListeners(false, false)
                }
                break;

            case 32:
                if (pressingInput2) {
                    activateListeners(false, true)
                }
                break;
        }
    })
    app.renderer.view.addEventListener('wheel', (event) => {
        zoomExp += event.deltaY > 0 ? -1 : 1;
    })



    app.ticker.add((delta) => {

        cameraPos.x += cameraMove.x
        cameraPos.y += cameraMove.y

        if (dragging && !clickingButton) {
            cameraPos.x = prevCameraPos.x - (mouseX - prevMouseX) / zoom
            cameraPos.y = prevCameraPos.y + (mouseY - prevMouseY) / zoom
            if (!mouseInside()) dragging = false
        }

        zoomExpLerp = zoomExpLerp + (zoomExp - zoomExpLerp) * 0.2
        zoom = 2 ** (zoomExpLerp/10)

        touch_button.renderable = touch_button.interactive = world.touchListeners.length > 0
        touch_button_dual.renderable = touch_button_dual.interactive = world.touchListeners.some(listener => listener.dualMode)
        

        
        touch_button_dual.position.x = 100 - 4
        touch_button_dual.position.y = app.screen.height - 50

        touch_button.position.x = app.screen.width - 100 + 4
        touch_button.position.y = app.screen.height - 50

        center.position.x = app.screen.width / 2 - cameraPos.x * zoom
        center.position.y = app.screen.height / 2 + cameraPos.y * zoom

        center.scale.x = zoom
        center.scale.y = zoom

        if (prevWidth != canvas.offsetWidth || prevHeight != canvas.offsetHeight) {
            app.resize()
        }

        prevWidth = canvas.offsetWidth;
        prevHeight = canvas.offsetHeight;

        world.update()
        updateObjects(world)
    })




    let axes = new PIXI.Graphics();
    axes.beginFill(0x000000);
    axes.drawRect(-1, -1, 100*30, 2);
    axes.drawRect(-1, -1, 2, -100*30);
    axes.endFill();
    center.addChild(axes)


    objects = new PIXI.Container();
    center.addChild(objects)
    


    let touch_button = new PIXI.Sprite(touch_buttons.textures[`touch.png`])
    touch_button.anchor.x = touch_button.anchor.y = 0.5
    touch_button.interactive = true

    touch_button.position.x = 100-4

    touch_button.on('pointerdown', () => {
        touch_button.texture = touch_buttons.textures[`touch_down.png`]
        activateListeners(true, false)
        clickingButton = true
    })
    touch_button.on('pointerup', () => {
        touch_button.texture = touch_buttons.textures[`touch.png`]
        if (pressingInput1) {
            activateListeners(false, false)
            clickingButton = false
        }
    })
    touch_button.on('pointerupoutside', () => {
        touch_button.texture = touch_buttons.textures[`touch.png`]
        if (pressingInput1) {
            activateListeners(false, false)
            clickingButton = false
        }
    })

    let touch_button_dual = new PIXI.Sprite(touch_buttons.textures[`touch_dual.png`])
    touch_button_dual.anchor.x = touch_button_dual.anchor.y = 0.5
    touch_button_dual.interactive = true


    touch_button_dual.on('pointerdown', () => {
        touch_button_dual.texture = touch_buttons.textures[`touch_dual_down.png`]
        activateListeners(true, true)
        clickingButton = true
    })
    touch_button_dual.on('pointerup', () => {
        touch_button_dual.texture = touch_buttons.textures[`touch_dual.png`]
        if (pressingInput2) {
            activateListeners(false, true)
            clickingButton = false
        }
    })
    touch_button_dual.on('pointerupoutside', () => {
        touch_button_dual.texture = touch_buttons.textures[`touch_dual.png`]
        if (pressingInput2) {
            activateListeners(false, true)
            clickingButton = false
        }
    })


    app.stage.addChild(touch_button)
    app.stage.addChild(touch_button_dual)
    
}


export {createApp, createObjects}