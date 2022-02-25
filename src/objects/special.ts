import GDObject from "./object";

import type {ChannelData, World} from "../world/world";

import { PUSAB_FONT } from "../trigger_graph_sketch/sketch";


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
export class CollisionObject extends GDObject {
    blockID: number = 0;
    dynamic: boolean = false;

    draw(p5: any, world: World) {
        p5.stroke(170)
        p5.strokeWeight(2)

        for (let _ in [null, null]) {
            p5.line(-14, -14, -14 + 4.66, -14)
            p5.line(-14, 14, -14 + 4.66, 14)
            p5.line(-14 + 4.66*2, -14, -14 + 4.66*4, -14)
            p5.line(-14 + 4.66*2, 14, -14 + 4.66*4, 14)
            p5.line(14, -14, 14 - 4.66, -14)
            p5.line(14, 14, 14 - 4.66, 14)
            p5.rotate(p5.PI/2)
        }
        

        p5.noStroke()
        p5.fill(255, 50)
        p5.rect(-14, -14, 28, 28)
        if (this.blockID != 0) {
            p5.fill(255, 200)
            p5.textSize(32 / `${this.blockID}b`.length)
            p5.textAlign(p5.CENTER, p5.CENTER)
            p5.text(`${this.blockID}b${this.dynamic?'*':''}`, 0, 0)
        }
    }
}
export class TextObject extends GDObject {
    text: string = ""
    color_id: number = 1;
    draw(p5: any, world: World) {
        if (PUSAB_FONT) {
            p5.textFont(PUSAB_FONT)
        }

        let c: ChannelData = world.getColor(this.color_id)
        let triggerAlpha = 1
        this.groups.forEach(g => {
            triggerAlpha *= world.groupIDs[g].opacity
        })
        // TODO: color shit
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill(c.color.r, c.color.g, c.color.b, c.opacity * triggerAlpha * 255)
        p5.strokeWeight(2)
        p5.stroke(0)
        p5.textSize(16)
        p5.text(this.text, 0, 0)
    }
}
