import GDObject from "./object";

import type World from "../world/world";


export class Display extends GDObject {
    itemID: number = 0;
    //( ͡ °  ͜ ʖ  ͡ °)
    set_value() {

    }

    draw(p5: any, world: World) {
        let value = 0;
        if (this.itemID in world.itemIDs) {
            value = world.itemIDs[this.itemID].value
        }
        p5.noStroke()
        p5.fill(255, this.getTotalOpacity(world)*255)
        p5.textAlign(p5.CENTER)
        p5.textSize(16)
        p5.text(value, 0, 10)
        p5.textSize(6)
        p5.text(`Display ${this.itemID}i`, 0, -5)
    }

}
// brb bat saber time !!
export class CollisionObject extends GDObject {
    blockID: number = 0;
    dynamic: boolean = false;

    draw(p5: any, world: World) {
        p5.stroke(170)
        p5.strokeWeight(2)

        for (let x = -2; x <= 2; x++) {
            p5.point(x * 28 / 4, -14)
            p5.point(x * 28 / 4, 14)
        }
        for (let y = -1; y <= 1; y++) {
            p5.point(-14, y * 28 / 4)
            p5.point(14, y * 28 / 4)
        }

        p5.noStroke()
        p5.fill(255, 50)
        p5.rect(-14, -14, 28, 28)
        if (this.blockID != 0) {
            p5.fill(255, 200)
            p5.textSize(32 / `${this.blockID}b`.length)
            p5.textAlign(p5.CENTER, p5.CENTER)
            p5.text(`${this.blockID}b`, 0, 0)
        }
    }
}

