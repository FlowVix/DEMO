import GDObject from "./object";
import type {World} from "../world/world";
import {draw_trigger} from "./util";

class Trigger extends GDObject {
    touchTriggered: boolean = false;
    spawnTriggered: boolean = false;
    multiTrigger: boolean = false;
    lastTrigger: number = 0;
    kind = new OutputTrigger()
    trigger(world: World) {}
}

// activates other triggers (spawn, ic, collision, ...)
// me trying to make rust enums lol
export class FunctionTrigger {
    target: number;
    last_spawn: number = 0;
    constructor(){}
}

export class OutputTrigger {
    constructor(){}
}

export type TriggerKind = FunctionTrigger | OutputTrigger


class ToggleTrigger extends Trigger {
    target: number = 0;
    activate: boolean = false;
    kind = new OutputTrigger()
    draw(p5: any, world: World) {
        draw_trigger(p5, world, this, this.activate ? [30, 255, 30] : [255, 30, 30], "Toggle", `${this.target}`)
    }
    trigger(world: World) {
        world.toggleGroupID(this.target, this.activate)
    }
}

class MoveTrigger extends Trigger {
    target: number = 0;

    moveX: number = 0;
    moveY: number = 0;
    moveTime: number = 0;
    easingFunc: Function = x => x;

    useTarget: boolean = false;
    moveToID: number = 0;
    moveAxes: number = 0;

    kind = new OutputTrigger()

    draw(p5: any, world: World) {
        const d = new Date()
        const time = d.getTime()
        const progress = Math.min((time - this.lastTrigger) / (this.moveTime * 1000), 1)
        draw_trigger(p5, world, this, [91, 38, 175], "Move", `${this.target}`, this.easingFunc(progress))
    }

    trigger(world: World) {
        if (!this.useTarget) {
            world.addMoveCommand(
                this.target,
                this.moveX,
                this.moveY,
                this.moveTime,
                this.easingFunc,
                this.index,
            )
        } else if (world.groupIDs[this.target].objects.length == 1 && world.groupIDs[this.moveToID].objects.length == 1) {
            let targetObject = world.objects[world.groupIDs[this.target].objects[0]];
            let toObject = world.objects[world.groupIDs[this.moveToID].objects[0]];
            world.addMoveCommand(
                this.target,
                (this.moveAxes == 0 || this.moveAxes == 1) ? (toObject.pos.x - targetObject.pos.x) : 0,
                (this.moveAxes == 0 || this.moveAxes == 2) ? (toObject.pos.y - targetObject.pos.y) : 0,
                this.moveTime,
                this.easingFunc,
                this.index,
            )
        }
    }
}

class RotateTrigger extends Trigger {
    target: number = 0;
    center: number = 0;

    degrees: number = 0;
    times360: number = 0;
    rotateTime: number = 0;
    easingFunc: Function = x => x;

    lockRotation: boolean = false;

    kind = new OutputTrigger()

    draw(p5: any, world: World) {
        const d = new Date()
        const time = d.getTime()
        const progress = Math.min((time - this.lastTrigger) / (this.rotateTime * 1000), 1)
        draw_trigger(p5, world, this, [138, 122, 230], "Rotate", `${this.target}`, this.easingFunc(progress))
    }

    trigger(world: World) {
        world.addRotateCommand(
            this.target,
            this.center,
            this.degrees + this.times360 * 360,
            this.rotateTime,
            this.easingFunc,
            this.lockRotation,
            this.index,
        )
    }
}

class FollowTrigger extends Trigger {
    target: number = 0;
    follow: number = 0;

    xMod: number = 0;
    yMod: number = 0;
    followTime: number = 0;

    kind = new OutputTrigger()

    draw(p5: any, world: World) {
        const d = new Date()
        const time = d.getTime()
        const progress = Math.min((time - this.lastTrigger) / (this.followTime * 1000), 1)
        draw_trigger(p5, world, this, [163, 93, 67], "Follow", `${this.target}`, progress)
    }

    trigger(world: World) {
        world.addFollowCommand(
            this.target,
            this.follow,
            this.xMod,
            this.yMod,
            this.followTime,
            this.index,
        )
    }
}

class AlphaTrigger extends Trigger {
    target: number = 0;

    opacity: number = 0;
    fadeTime: number = 0;

    draw(p5: any, world: World) {
        const d = new Date()
        const time = d.getTime()
        const progress = Math.min((time - this.lastTrigger) / (this.fadeTime * 1000), 1)
        draw_trigger(p5, world, this, [45, 138, 179], "Alpha", `${this.target}`, progress)
    }

    trigger(world: World) {
        world.addAlphaCommand(
            this.target,
            this.opacity,
            this.fadeTime
        )
    }
}

class SpawnTrigger extends Trigger {
    delay: number = 0;
    kind = new FunctionTrigger()
    draw(p5: any, world: World) {
        const d = new Date()
        const time = d.getTime()
        const progress = Math.min((time - this.lastTrigger) / (this.delay * 1000), 1)
        draw_trigger(p5, world, this, [62, 173, 119], "Spawn", `${this.delay}`.replace(/\.?0*$/,''), progress)
    }

    spawn(world: World) {
        world.spawnGroupID(this.kind.target)
    }

    schedule_spawn(world: World, time: number) {
        world.scheduleSpawnGroupID(this.kind.target, time)
    }

    trigger(world: World) {
        const d = new Date();
        this.kind.last_spawn = d.getTime();
        if (this.delay > 0) {
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
    
    draw(p5: any, world: World) {
        draw_trigger(p5, world, this, [247, 151, 25], "Pickup", `${this.itemID}i${this.amount >= 0 ? "+" : ""}${this.amount}`)
    }
    trigger(world: World): void {
        world.changeItemID(this.itemID, this.amount)
    }
}
/**
 
1i.add(11)
counter(1i).display(45, 45)
wait(1)
else_clause = !{
    1i.add(3)
}
1i.if_is(LARGER_THAN, 10, !{
    else_clause.start_group.toggle_off()
    1i.add(-5)
})

//else_clause! // works correctly
1i.if_is(SMALLER_THAN, 11, else_clause) // wrong

// maybe spawn first, then reactivate?
 */ // sure
// i think i almost found why 'test' breaks
// so the toggle trigger does disable it
// yea
// wait ill go in gd to study this more up close lol
// function triggers send signals between truigggers
// because things like ic can be either
// depending on if they activate group ornot
// what is kind :flushed:
// but why arent they extending FunctionTrigger like before anymore o
enum Cmp { EQUAL, GREATER, LESSER }
class InstantCountTrigger extends Trigger {
    itemID: number = 0;
    amount: number = 0;
    cmpType: Cmp = Cmp.LESSER;
    kind = new FunctionTrigger()

    activate: boolean = false;
    last_fail: number = 0;

    draw(p5: any, world: World) {
        let cmp: string = this.cmpType == Cmp.EQUAL ? "=" : this.cmpType == Cmp.LESSER ? "<" : ">";
        draw_trigger(p5, world, this, [245, 137, 137], "IC", `${this.itemID}i${cmp}${this.amount}`)
        const d = new Date();
        const time = d.getTime();
        const flashlen = 300
        if (time - this.last_fail < flashlen) {
            const alpha = 1 - (time - this.last_fail) / flashlen;
            p5.stroke(255, 0, 0, alpha * 200 * this.getTotalOpacity(world));
            p5.strokeWeight(4);
            const l = alpha * 8 + 5
            p5.line(-l, -l, l, l);
            p5.line(-l, l, l, -l);
        }
        // wtf i tested it tho
        // well the simulation is 
        // the output is wrong then
        // its activating both the if clause and the else 
        // yea
        // so they are both wrong
        // yea i thought that was the problem but apparenly not
        // its giving me the same thing in playtest and regular
        // i think its working fine
        // oh i thought by wrong you meant that the simulation and gd arent identical
        // so wa do 
        if (time - this.kind.last_spawn < flashlen) {
            const alpha = 1 - (time - this.kind.last_spawn) / flashlen;
            p5.stroke(0, 255, 0, alpha * 200 * this.getTotalOpacity(world));
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
                    this.kind.last_spawn = d.getTime();
                    world.toggleGroupID(this.kind.target, this.activate)
                    if (this.activate) {world.spawnGroupID(this.kind.target)}
                } else {
                    this.last_fail = d.getTime();
                }
                break; // just seems like it isnt getting disabled, but ill print JSON.stringify(this) cuz i dont trust js console
            case Cmp.GREATER:
                if (world.getItemID(this.itemID) > this.amount) {
                    this.kind.last_spawn = d.getTime();
                    world.toggleGroupID(this.kind.target, this.activate)
                    if (this.activate) {world.spawnGroupID(this.kind.target)}
                } else {
                    this.last_fail = d.getTime();
                }
                break;
            case Cmp.LESSER:
                if (world.getItemID(this.itemID) < this.amount) {
                    this.kind.last_spawn = d.getTime();
                    world.toggleGroupID(this.kind.target, this.activate)
                    if (this.activate) {world.spawnGroupID(this.kind.target)}
                } else {
                    this.last_fail = d.getTime();
                }
                break;
        }
    }

}



enum TouchMode { Normal = 0, On = 1, Off = 2 }

class TouchTrigger extends Trigger {
    touchMode: TouchMode = TouchMode.Normal;
    kind = new FunctionTrigger()
    holdMode: boolean = false;
    dualMode: boolean = false;
    
    draw(p5: any, world: World) {
        draw_trigger(p5, world, this, [26, 47, 59], "Touch", `${this.kind.target}`)
    }
    trigger(world: World): void {
        world.addTouchListener(this.kind.target, this.touchMode, this.holdMode, this.dualMode, this.index)
    }
}

class StopTrigger extends Trigger {
    kind = new OutputTrigger()
    target: number = 0;
    draw(p5: any, world: World) {
        draw_trigger(p5, world, this, [200, 100, 100], "Stop", `${this.target}`)
    }
    trigger(world: World): void {
        world.stop(this.target)
    }
}

class CountTrigger extends Trigger {

    kind = new FunctionTrigger()
    multi_activate: boolean = false;

    itemID: number = 0;
    target_count: number = 0;
    activate_group: boolean = false;

    draw(p5: any, world: World) {
        draw_trigger(p5, world, this, [229, 133, 210], "Count", `${this.itemID}i=${this.target_count}`)
    }
    trigger(world: World): void {
        world.addCountListener(this.kind.target, this.itemID, this.target_count, this.multi_activate, this.activate_group, this.index)
    }
}

class CollisionTrigger extends Trigger {

    kind = new FunctionTrigger()

    blockA: number = 0;
    blockB: number = 0;
    
    activateGroup: boolean = false;
    onExit: boolean = false;

    draw(p5: any, world: World) {
        draw_trigger(p5, world, this, [31, 42, 107], "Collision", `${this.blockA}b ${this.blockB}b`)
    }
    trigger(world: World): void {
        world.addCollisionListener(
            this.kind.target,
            this.blockA,
            this.blockB,
            this.activateGroup,
            this.onExit,
            this.index,
        )
    }
}

class OnDeathTrigger extends Trigger {
    kind = new FunctionTrigger()

    draw(p5: any, world: World) {
        draw_trigger(p5, world, this, [119, 68, 68], "On Death", `${this.kind.target}`)
    }

    trigger(world: World): void {
        // literally nothing
    }
}


export {
    Trigger,
    ToggleTrigger,
    SpawnTrigger,
    PickupTrigger,
    InstantCountTrigger,
    MoveTrigger,
    AlphaTrigger,
    TouchTrigger,
    StopTrigger,
    RotateTrigger,
    FollowTrigger,
    CountTrigger,
    OnDeathTrigger,
    CollisionTrigger,
    
    TouchMode,
    Cmp,
};
