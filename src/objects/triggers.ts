import GDObject from "./object";
import type World from "../world/world";
import {draw_trigger} from "./util";

class Trigger extends GDObject {
    touchTriggered: boolean = false;
    spawnTriggered: boolean = false;
    multiTrigger: boolean = false;
    lastTrigger: number = 0;
    trigger(world: World) {}
}
// activates other triggers (spawn, ic, collision, ...)
export class FunctionTrigger extends Trigger {
    target: number;
    last_spawn: number = 0;
}

export class OutputTrigger extends Trigger {}

// oops didnt mean to call
class ToggleTrigger extends OutputTrigger {
    target: number = 0;
    activate: boolean = false;
    draw(p5: any, world: World) {
        draw_trigger(p5, this.activate ? [30, 255, 30] : [255, 30, 30], "Toggle", `${this.target}`, this.lastTrigger)
    }
    trigger(world: World) {
        world.toggleGroupID(this.target, this.activate)
    }
}

class MoveTrigger extends OutputTrigger {
    target: number = 0;
    draw(p5: any, world: World) {
        draw_trigger(p5, [91, 38, 175], "Move", `${this.target}`, this.lastTrigger)
    }
}

class SpawnTrigger extends FunctionTrigger {
    delay: number = 0;
    draw(p5: any, world: World) {
        draw_trigger(p5, [62, 173, 119], "Spawn", `${this.delay}`.replace(/\.?0*$/,''), this.lastTrigger)
    }

    spawn(world: World) {
        world.spawnGroupID(this.target)
    }

    schedule_spawn(world: World, time: number) {
        world.scheduleSpawnGroupID(this.target, time)
    }

    trigger(world: World) {
        const d = new Date();
        this.last_spawn = d.getTime();
        if (this.delay > 0) {
            let time = d.getTime();
            this.schedule_spawn(world, time + this.delay * 1000)
        } else {
            this.spawn(world)
        }
    }
}

class PickupTrigger extends OutputTrigger {
    itemID: number = 0;
    amount: number = 0;
    
    draw(p5: any, world: World) {
        draw_trigger(p5, [247, 151, 25], "Pickup", `${this.itemID}i${this.amount >= 0 ? "+" : ""}${this.amount}`, this.lastTrigger)
    }
    trigger(world: World): void {
        world.changeItemID(this.itemID, this.amount)
    }
}

enum Cmp { EQUAL, GREATER, LESSER }
class InstantCountTrigger extends FunctionTrigger {
    itemID: number = 0;
    amount: number = 0;
    cmpType: Cmp = Cmp.LESSER;

    activate: boolean = false;
    last_fail: number = 0;

    draw(p5: any, world: World) {
        let cmp: string = this.cmpType == Cmp.EQUAL ? "=" : this.cmpType == Cmp.LESSER ? "<" : ">";
        draw_trigger(p5, [245, 137, 137], "IC", `${this.itemID}i${cmp}${this.amount}`, this.lastTrigger)
        const d = new Date();
        const time = d.getTime();
        const flashlen = 300
        if (time - this.last_fail < flashlen) {
            const alpha = 1 - (time - this.last_fail) / flashlen;
            p5.stroke(255, 0, 0, alpha * 200);
            p5.strokeWeight(4);
            const l = alpha * 8 + 5
            p5.line(-l, -l, l, l);
            p5.line(-l, l, l, -l);
        }

        if (time - this.last_spawn < flashlen) {
            const alpha = 1 - (time - this.last_spawn) / flashlen;
            p5.stroke(0, 255, 0, alpha * 200);
            p5.strokeWeight(4);
            p5.noFill();
            const r = 13 - alpha * 8
            p5.ellipse(0, 0, r * 2, r * 2);
        }
    }

    trigger(world: World) {
        const d = new Date();
        switch (this.cmpType) {
            case Cmp.EQUAL:
                if (world.getItemID(this.itemID) == this.amount) {
                    this.last_spawn = d.getTime();
                    world.toggleGroupID(this.target, this.activate)
                    if (this.activate) {world.spawnGroupID(this.target)}
                } else {
                    this.last_fail = d.getTime();
                }
                break;
            case Cmp.GREATER:
                if (world.getItemID(this.itemID) > this.amount) {
                    this.last_spawn = d.getTime();
                    world.toggleGroupID(this.target, this.activate)
                    if (this.activate) {world.spawnGroupID(this.target)}
                } else {
                    this.last_fail = d.getTime();
                }
                break;
            case Cmp.LESSER:
                if (world.getItemID(this.itemID) < this.amount) {
                    this.last_spawn = d.getTime();
                    world.toggleGroupID(this.target, this.activate)
                    if (this.activate) {world.spawnGroupID(this.target)}
                } else {
                    this.last_fail = d.getTime();
                }
                break;
        }
    }

}



export {
    Trigger,
    ToggleTrigger,
    SpawnTrigger,
    PickupTrigger,
    InstantCountTrigger,
    MoveTrigger,
    Cmp
};
