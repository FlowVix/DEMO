import type {Trigger} from './triggers';
import type {World} from "../world/world";

export function draw_trigger(p5, world: World, trigger: Trigger, color: [number, number, number], name: string, text: string, progress: number = 1, stroke: [number, number, number] = null) {
    const last_trigger = trigger.lastTrigger;
    const d = new Date();
    const time = d.getTime();
    const flash = 1 + Math.max(0.5 - (time - last_trigger) / 1000, 0);
    const alpha = trigger.disables > 0 ? 0.3 : 1;
    p5.noStroke()
    p5.fill(color[0] * flash * 0.4, color[1] * flash * 0.4, color[2] * flash * 0.4, 255 * alpha, trigger.getTotalOpacity(world)*255)
    p5.rect(-13, -3, 26, 16, 3, 3, 3, 3)
    p5.fill(color[0] * flash, color[1] * flash, color[2] * flash, 255 * alpha, trigger.getTotalOpacity(world)*255)
    p5.rect(-13, -3 + 16 * (1 - progress), 26, 16 * progress, 3, 3, 3, 3)

    p5.strokeWeight(2)
    if (stroke) p5.stroke(stroke[0] * flash, stroke[1] * flash, stroke[2] * flash, 255 * alpha, trigger.getTotalOpacity(world)*255)
    else p5.stroke(color[0] * 0.3 * flash, color[1] * 0.3 * flash, color[2] * 0.3 * flash, 255 * alpha, trigger.getTotalOpacity(world)*255)
    p5.noFill();
    p5.rect(-13, -3, 26, 16, 3, 3, 3, 3)

    p5.textAlign(p5.CENTER, p5.CENTER)

    //console.log((color[0] + color[1] + color[2]) / 3, (color[0] + color[1] + color[2]) / 3 > 150)
    if ((color[0] + color[1] + color[2]) / 3 > 169) {
        p5.strokeWeight(1)
        p5.stroke(0)
    } else {
        p5.noStroke()
    }

    p5.fill(255, 255 * alpha * trigger.getTotalOpacity(world))
    p5.textSize(14 / (text.length ** 0.4))
    p5.text(text, 0, 7)

    p5.textSize(8)
    p5.noStroke()
    p5.text(name, 0, -10)
}