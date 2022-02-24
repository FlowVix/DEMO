
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
    index: number

    constructor(x: number, y: number, idx: number) {
        this.pos = {x, y}
        this.index = idx
    } // the test example works with optimisation off :oooooooh:

    toggleOff() {
        this.disables += 1
    }
    toggleOn() {
        if (this.disables > 0) this.disables -= 1
    }

    getTotalOpacity(world: World) {
        let total = 1
        this.groups.forEach((g) => total *= world.groupIDs[g].opacity)
        return total
    }

    drawFull(p5: any, world: World) {
        if (this.disables == 0) {
            p5.push()
            p5.translate(this.pos.x, -this.pos.y)
            p5.rotate(- this.rotation * Math.PI / 180)
            p5.scale(this.scale.x, this.scale.y)

            let g = p5.createGraphics(p5.width, p5.height, p5.WEBGL)
    
            this.draw(p5, world)
    
            p5.pop()
        }
    }

    draw(p5: any, world: World) {}

}

export default GDObject


