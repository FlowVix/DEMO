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


class ToggleTrigger extends Trigger {
    target: number = 0;
    activate: boolean = false;
    draw(p5: any) {
        draw_trigger(p5, this.activate ? [30, 255, 30] : [255, 30, 30], "Toggle", `${this.target}`, this.lastTrigger)
    }
    trigger(world: World) {
        world.toggleGroupID(this.target, this.activate)
    }
}

class MoveTrigger extends Trigger {
    target: number = 0;
    draw(p5: any) {
        draw_trigger(p5, [91, 38, 175], "Move", `${this.target}`, this.lastTrigger)
    }
}

class SpawnTrigger extends Trigger {
    target: number = 0;                 // nope
    delay: number = 0;
    last_trigger: number = 0;
    draw(p5: any) {
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
        this.last_trigger = d.getTime();
        if (this.delay > 0) {
            const d = new Date();
            let time = d.getTime();
            this.schedule_spawn(world, time + this.delay * 1000)
        } else {
            this.spawn(world)
        }
    }
}

class PickupTrigger extends Trigger {
    itemID: number = 0;
    amount: number = 0;
    draw(p5: any) {
        draw_trigger(p5, [247, 151, 25], "Pickup", `${this.itemID}i${this.amount >= 0 ? "+" : ""}${this.amount}`, this.lastTrigger)
    }
}

enum Cmp { EQUAL, GREATER, LESSER }
class InstantCountTrigger extends Trigger {
    itemID: number = 0;
    amount: number = 0;
    cmpType: Cmp = Cmp.LESSER;

    target: number = 0;
    activate: boolean = false;

    draw(p5: any) {
        let cmp: string = this.cmpType == Cmp.EQUAL ? "=" : this.cmpType == Cmp.LESSER ? "<" : ">";
        draw_trigger(p5, [245, 137, 137], "IC", `${this.itemID}i${cmp}${this.amount}`, this.lastTrigger)
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
