

import * as PIXI from "pixi.js"


const setup = (then) => {
    sheet1 = PIXI.Loader.shared.resources["sheet1"].spritesheet;
    sheet2 = PIXI.Loader.shared.resources["sheet2"].spritesheet;
    touch_buttons = PIXI.Loader.shared.resources["touch_buttons"].spritesheet;

    then()
}

const loadResources = (then) => {
    PIXI.Loader.shared
        .add("sheet1", "assets/images/spritesheets/sheet1.json")
        .add("sheet2", "assets/images/spritesheets/sheet2.json")
        .add("touch_buttons", "assets/images/spritesheets/touch_buttons.json")
        .load(() => setup(then))
}


let sheet1: PIXI.Spritesheet;
let sheet2: PIXI.Spritesheet;
let touch_buttons: PIXI.Spritesheet;

export {
    loadResources,
    sheet1,
    sheet2,
    touch_buttons,
}