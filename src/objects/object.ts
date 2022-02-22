
import type World from "../world/world";

class GDObject {

    pos: {
        x: number,
        y: number,
    }
    scale: {
        x: number,
        y: number,
    } = {x: 1, y: 1}
    rotation: number = 0;
    disables: number = 0;
    groups: number[] = [];

    constructor(x: number, y: number) {
        this.pos = {x, y}
    }

    toggleOff() {
        this.disables += 1
    }
    toggleOn() {
        if (this.disables > 0) this.disables -= 1
    }

    drawFull(p5: any, world: World) {
        if (this.disables == 0) {
            p5.push()
            p5.translate(this.pos.x, -this.pos.y)
            p5.rotate(- this.rotation * Math.PI / 180)
            p5.scale(this.scale.x, this.scale.y)
    
            this.draw(p5, world)
    
            p5.pop()
        }
    }

    draw(p5: any, world: World) {}

}

export default GDObject


