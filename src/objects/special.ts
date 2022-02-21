import GDObject from "./object";

import type World from "../world/world";


class Display extends GDObject {
    itemID: number = 0;

    set_value() {

    }

    draw(p5: any, world: World) {
        let value = 0;
        if (this.itemID in world.itemIDs) {
            value = world.itemIDs[this.itemID].value
        }
        p5.noStroke()
        p5.fill(255)
        p5.textAlign(p5.CENTER)
        p5.textSize(16)
        p5.text(value, 0, 10)
        p5.textSize(6)
        p5.text(`Display ${this.itemID}i`, 0, -5)
    }

}

export {
    Display
};
