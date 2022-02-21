
import GDObject from "./object";
import type World from "../world/world"


class Block extends GDObject {
    draw(p5: any, world: World) {
        p5.stroke(255)
        p5.strokeWeight(2)
        p5.fill(30)
        p5.rect(-14, -14, 28, 28)
    }
}

export {
    Block
};

