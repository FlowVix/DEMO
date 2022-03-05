import type Object from "../objects/object"
import {Trigger, ToggleTrigger, SpawnTrigger, PickupTrigger, InstantCountTrigger, TouchMode, MoveTrigger, AlphaTrigger, TouchTrigger, RotateTrigger, CountTrigger, CollisionTrigger, ColorTrigger, PulseChannelTarget, PulseGroupTarget} from "../objects/triggers"
import {CollisionObject, Display} from "../objects/special"
import {gdHvsConvert, map} from "../util"
import Col from 'detect-collisions'

type ObjIndex = number;
type rgbab = {r: number, g: number, b: number, a: number, blending: boolean}
type rgba = {r: number, g: number, b: number, a: number}

let system = new Col.System();

enum PlayerColor {
    None,
    P1,
    P2,
}


interface ChannelData {
    opacity: number;
    blending: boolean;
    playerColor: PlayerColor;
    getColor: (world: World, override?: {id: number, color: rgbab}) => rgbab;
}

class RGBData implements ChannelData {
    
    playerColor: PlayerColor = PlayerColor.None;

    constructor(
        public red: number,
        public green: number,
        public blue: number,
        public opacity: number,
        public blending: boolean,
    ) {}

    getColor(world: World, override?: {id: number, color: rgbab}): rgbab {
        
        return this.playerColor == PlayerColor.None ? {
            r: this.red,
            g: this.green,
            b: this.blue,
            a: this.opacity,
            blending: this.blending,
        } : {r: 0, g: 0, b: 0, a: 1, blending: false}
        
    }
}
class CopyData implements ChannelData {

    playerColor: PlayerColor = PlayerColor.None;


    constructor(
        public channel: number,
        public hue: number,
        public saturation: number,
        public brightness: number,
        public sChecked: boolean,
        public bChecked: boolean,
        public copyOpacity: boolean,
        public opacity: number,
        public blending: boolean,
    ) {}

    getColor(world: World, override?: {id: number, color: rgbab}): rgbab {
        let col: rgbab;

        if (override && (override.id == this.channel || this.channel == 0))
            col = override.color
        else
            col = world.getColor(this.channel)
        
        let convertedCol = gdHvsConvert(
            col,
            this.hue,
            this.saturation,
            this.brightness,
            this.sChecked,
            this.bChecked
        )
        return {
            r: convertedCol.r,
            g: convertedCol.g,
            b: convertedCol.b,
            a: this.opacity * (this.copyOpacity ? col.a : 1),
            blending: this.blending,
        }
    }
}

interface ChannelState {
    getColor: (world: World) => rgbab,
}
class Stable implements ChannelState {
    constructor(
        public data: ChannelData,
    ) {}
    getColor(world: World): rgbab {
        return this.data.getColor(world)
    }
}
class Fading implements ChannelState {

    currentTime: number;
    stopped: boolean = false;

    constructor(
        public from: rgba,
        public to: ChannelData,
        public duration: number,
        public startTime: number,
        public triggerObj: ObjIndex,
    ) {this.currentTime = startTime}

    getColor(world: World): rgbab {
        let lerp = Math.min(1, (this.currentTime - this.startTime) / (this.duration * 1000));
        if (this.duration === 0) {
            lerp = 1;
        }
        const toCol = this.to.getColor(world,)
        return {
            r: this.from.r + (toCol.r - this.from.r) * lerp,
            g: this.from.g + (toCol.g - this.from.g) * lerp,
            b: this.from.b + (toCol.b - this.from.b) * lerp,
            a: this.from.a + (toCol.a - this.from.a) * lerp,
            blending: toCol.blending,
        }
    }
}



interface GroupIDData {
    objects: ObjIndex[];
    on: boolean;
    opacity: number;
}

interface ItemIDData {
    objects: ObjIndex[];
    value: number;
}
interface BlockIDData {
    objects: ObjIndex[];
}


class MoveCommand {

    lastVec: {x: number, y: number} = {x: 0, y: 0};

    constructor(
        public groupID: number,
        public moveX: number,
        public moveY: number,
        public duration: number,
        public easingFunc: Function,
        public startTime: number,
        public trigger_obj: ObjIndex
    ) {}

    getDisplacement(
        world: World
    ): {x: number, y: number} {
        let lerp = Math.min(1, (world.time - this.startTime) / (this.duration * 1000));
        if (this.duration === 0) {
            lerp = 1;
        }
        lerp = this.easingFunc(lerp)
        let newVec = {
            x: this.moveX * lerp,
            y: this.moveY * lerp,
        }
        let displacement = {
            x: newVec.x - this.lastVec.x,
            y: newVec.y - this.lastVec.y,
        }
        this.lastVec = newVec
        return displacement
    }

}

class RotateCommand {

    lastAngle: number = 0;

    constructor(
        public groupID: number,
        public centerID: number,
        public degrees: number,
        public duration: number,
        public easingFunc: Function,
        public lockRotation: boolean,
        public startTime: number,
        public trigger_obj: ObjIndex
    ) {}

    getAngleIncrement(
        world: World
    ): number {
        let lerp = Math.min(1, (world.time - this.startTime) / (this.duration * 1000));
        if (this.duration === 0) {
            lerp = 1;
        }
        lerp = this.easingFunc(lerp)
        let newAngle = this.degrees * lerp
        let increment = newAngle - this.lastAngle
        this.lastAngle = newAngle
        return increment
    }

}

class FollowCommand {

    lastVec: {x: number, y: number} = {x: 0, y: 0};

    constructor(
        public groupID: number,
        public followID: number,
        public xMod: number,
        public yMod: number,
        public duration: number,
        public startTime: number,
        public trigger_obj: ObjIndex
    ) { }

    getDisplacement(
        {x: followX, y: followY}
    ): {x: number, y: number} {

        let displacement = {
            x: (followX - this.lastVec.x)*this.xMod,
            y: (followY - this.lastVec.y)*this.yMod,
        }
        return displacement
    }

}


class AlphaCommand {

    constructor(
        public groupID: number,
        public opacity: number,
        public duration: number,
        public startOpacity: number,
        public startTime: number,
    ) {}

    getOpacity(
        world: World
    ) {
        let lerp = Math.min(1, (world.time - this.startTime) / (this.duration * 1000));
        if (this.duration === 0) {
            lerp = 1;
        }
        return this.startOpacity + (this.opacity - this.startOpacity) * lerp;
    }

}

class TouchListener {
    constructor(
        public groupID: number,
        public touchMode: TouchMode,
        public holdMode: boolean,
        public dualMode: boolean,
        public trigger_obj: ObjIndex,
    ) {}
}

class CountListener {
    constructor(
        public groupID: number,
        public itemID: number,
        public target_count: number,
        public multi_activate: boolean,
        public activate_group: boolean,
        public trigger_obj: ObjIndex,
        public activated_before = false,
    ) {}
}

class CollisionListener {

    collidingAmount: number = 0;
    prevAmount: number = 0;

    constructor(
        public groupID: number,
        public blockB: number,
        public activateGroup: boolean,
        public onExit: boolean,
        public trigger_obj: ObjIndex,
    ) {}
}

class PulseCommand {

    constructor(
        public fadeIn: number,
        public hold: number,
        public fadeOut: number,

        public pulseData: ChannelData,

        public mainOnly: boolean,
        public detailOnly: boolean,

        public startTime: number,
        public trigger_obj: ObjIndex
    ) {}

    getColorLerp(world: World, override: {id: number, color: rgbab}) {
        let lerp = 1;
        if (world.time < this.startTime + this.fadeIn * 1000) {
            lerp = (world.time - this.startTime) / (this.fadeIn * 1000)
        } else if (world.time > this.startTime + this.fadeIn * 1000 + this.hold * 1000) {
            lerp = (this.startTime + this.fadeIn * 1000 + this.hold * 1000 + this.fadeOut * 1000 - world.time) / (this.fadeOut * 1000)
        }
        let col = this.pulseData.getColor(world, override)
        return {
            r: col.r,
            g: col.g,
            b: col.b,
            lerp,
        }
    }

}

class World {

    objects: Object[] = [];

    groupIDs: Record<number, GroupIDData> = {};
    colorIDs: Record<number, ChannelState> = {};
    itemIDs: Record<number, ItemIDData> = {};
    blockIDs: Record<number, BlockIDData> = {};

    scheduled_spawns: {time: number, group: number}[] = [];

    moveCommands: MoveCommand[] = [];
    rotateCommands: RotateCommand[] = [];
    followCommands: FollowCommand[] = [];
    alphaCommands: Record<number, AlphaCommand> = {};
    pulseCommands: {
        channel: Record<number, PulseCommand[]>,
        group: Record<number, PulseCommand[]>,
    } = {
        channel: {},
        group: {}
    };

    touchListeners: TouchListener[] = [];
    countListeners: CountListener[] = [];
    collisionListeners: Record<number, CollisionListener[]> = [];

    collisionBlocks: ObjIndex[] = [];
    dynamicCollisionBlocks: ObjIndex[] = [];

    time: number = 0;

    spawned_this_frame: Set<number> = new Set();

    constructor() {
        this.reset()
    }
    reset() {
        this.objects = []
        this.groupIDs = {}
        this.colorIDs = {}
        this.itemIDs = {}
        this.blockIDs = {}
        this.scheduled_spawns = []
        this.moveCommands = []
        this.rotateCommands = []
        this.alphaCommands = {}
        this.followCommands = []
        this.pulseCommands = {
            channel: {},
            group: {}
        };
        this.countListeners = []
        this.collisionListeners = []
        this.touchListeners = [] // count triggers now work  // epic
        this.time = 0; // had to make a new count macro because the std one doesnt have an option to disable multi activate
        this.spawned_this_frame = new Set();
    }

    init() {
        this.objects.forEach((obj, i) => {
            if (obj instanceof CollisionObject) {
                this.collisionBlocks.push(i)
                if (obj.dynamic) this.dynamicCollisionBlocks.push(i)
            }
        })
        this.colorIDs[1] = new Stable(new RGBData(255, 255, 255, 1, false))

        this.colorIDs[1000] = new Stable(new RGBData(54, 66, 92, 1, false))
        this.colorIDs[1001] = new Stable(new RGBData(20, 31, 56, 1, false))
        
    }

    update() {
        this.spawned_this_frame = new Set()

        let time = (new Date()).getTime()
        this.time = time;

        let to_remove = Array(this.scheduled_spawns.length).fill(false)
        this.scheduled_spawns.forEach((spawn, i) => {
            // console.log("c:", time)
            if (spawn.time <= time) {
                // console.log("a:", spawn.group)
                this.spawnGroupID(spawn.group)
                to_remove[i] = true
            }
        })
        this.scheduled_spawns = this.scheduled_spawns.filter((_, i) => !to_remove[i])
        
        // silly spunix the ids will change!!! !
        // to_remove.forEach(i => this.scheduled_spawns.splice(i, 1))


        this.followCommands.forEach(cmd => {
            cmd.lastVec.x = this.objects[this.groupIDs[cmd.followID].objects[0]].pos.x
            cmd.lastVec.y = this.objects[this.groupIDs[cmd.followID].objects[0]].pos.y
        })

        
        
        let displacements = {}
        to_remove = []
        this.moveCommands.forEach((cmd, i) => {
            if (!(cmd.groupID in displacements)) {
                displacements[cmd.groupID] = {x: 0, y: 0}
            }
            let displacement = cmd.getDisplacement(this)
            displacements[cmd.groupID].x += displacement.x;
            displacements[cmd.groupID].y += displacement.y;
            if (time >= cmd.startTime + cmd.duration * 1000) {
                to_remove.push(i)
            }
        })
        this.moveCommands = this.moveCommands.filter((_, i) => !to_remove.includes(i))
        
        for (const i in displacements) {
            for (const objIdx of this.groupIDs[i].objects) {
                this.objects[objIdx].pos.x += displacements[i].x
                this.objects[objIdx].pos.y += displacements[i].y
            }
        }

        let angleIncrements = {}
        to_remove = []
        this.rotateCommands.forEach((cmd, i) => {
            let {x: centerX, y: centerY} = this.objects[this.groupIDs[cmd.centerID].objects[0]].pos
            if (!(cmd.groupID in angleIncrements)) {
                angleIncrements[cmd.groupID] = []
            }

            let increment = cmd.getAngleIncrement(this)
            angleIncrements[cmd.groupID].push( {increment, centerX, centerY, lock: cmd.lockRotation} )
            if (time >= cmd.startTime + cmd.duration * 1000) {
                to_remove.push(i)
            }
        })
        this.rotateCommands = this.rotateCommands.filter((_, i) => !to_remove.includes(i))
        
        for (const i in angleIncrements) {
            for (const entry of angleIncrements[i]) {
                for (const objIdx of this.groupIDs[i].objects) {
                    let cos = Math.cos(-entry.increment * Math.PI / 180);
                    let sin = Math.sin(-entry.increment * Math.PI / 180);
                    let [vecX, vecY] = [
                        this.objects[objIdx].pos.x - entry.centerX,
                        this.objects[objIdx].pos.y - entry.centerY,
                    ];
                    [vecX, vecY] = [cos*vecX - sin*vecY, sin*vecX + cos*vecY]

                    this.objects[objIdx].pos.x = entry.centerX + vecX
                    this.objects[objIdx].pos.y = entry.centerY + vecY

                    if (!entry.lock) {
                        this.objects[objIdx].rotation -= entry.increment
                    }
                }
            }
        }
        
        
        to_remove = []
        for (const i in this.alphaCommands) {
            this.groupIDs[i].opacity = this.alphaCommands[i].getOpacity(this)
            if (time >= this.alphaCommands[i].startTime + this.alphaCommands[i].duration * 1000) {
                to_remove.push(i)
            }
        }
        to_remove.forEach((i) => delete this.alphaCommands[i])


        for (const blockA in this.collisionListeners) {
            this.collisionListeners[blockA].forEach(listener => {
                listener.collidingAmount = 0
                this.blockIDs[blockA].objects.forEach(b1 => {
                    if (this.objects[b1].disables > 0) { return }
                    const s1 = 15 * this.objects[b1].scale.x
                    const a1 = this.objects[b1].rotation * Math.PI / 180
                    let p1 = new Col.Polygon(this.objects[b1].pos,[
                        {x: s1, y: s1},
                        {x: -s1, y: s1},
                        {x: -s1, y: -s1},
                        {x: s1, y: -s1},
                    ])
                    p1.setAngle(a1)
                    //console.log(p1.angle, this.objects[b1].rotation)
                    this.blockIDs[listener.blockB].objects.forEach(b2 => {
                        if (this.objects[b2].disables > 0) { return }
                        if (!(<CollisionObject>this.objects[b1]).dynamic && !(<CollisionObject>this.objects[b2]).dynamic) { return }
                        if ((this.objects[b2].pos.x - this.objects[b1].pos.x) ** 2 + (this.objects[b2].pos.y - this.objects[b1].pos.y) ** 2 > (60*this.objects[b1].scale.x + 60*this.objects[b2].scale.x) ** 2) {
                            return
                        }
                        const s2 = 15 * this.objects[b2].scale.x
                        const a2 = this.objects[b2].rotation * Math.PI / 180
                        let p2 = new Col.Polygon(this.objects[b2].pos,[
                            {x: s2, y: s2},
                            {x: -s2, y: s2},
                            {x: -s2, y: -s2},
                            {x: s2, y: -s2},
                        ])
                        // are you gonna make a divider between the editor and the sim awesome
                        p2.setAngle(a2)
                        if (system.checkCollision(p1, p2)) {
                            listener.collidingAmount += 1
                        }
                    })
                })
                if (!listener.onExit) {
                    if (listener.collidingAmount > 0 && listener.prevAmount == 0) {
                        if (listener.activateGroup) { this.spawnGroupID(listener.groupID); (<CollisionTrigger>(this.objects[listener.trigger_obj])).kind.last_spawn = (new Date).getTime() }
                        this.toggleGroupID(listener.groupID, listener.activateGroup) 
                    }
                } else {
                    if (listener.collidingAmount == 0 && listener.prevAmount > 0) {
                        if (listener.activateGroup) { this.spawnGroupID(listener.groupID); (<CollisionTrigger>(this.objects[listener.trigger_obj])).kind.last_spawn = (new Date).getTime() }
                        this.toggleGroupID(listener.groupID, listener.activateGroup) 
                    }
                }
                listener.prevAmount = listener.collidingAmount
            })
        }

        for (const id in this.colorIDs) {
            if (this.colorIDs[id] instanceof Fading && !(<Fading> this.colorIDs[id]).stopped) {
                (<Fading> this.colorIDs[id]).currentTime = time
                if (time >= (<Fading> this.colorIDs[id]).startTime + (<Fading> this.colorIDs[id]).duration * 1000) {
                    this.colorIDs[id] = new Stable(
                        (<Fading> this.colorIDs[id]).to
                    )
                }
            }
        }
        //console.log(this.colorIDs)

        // to_remove = []
        // for (const id in this.colorFades) {
        //     let fade = this.colorFades[id].getColor(time)
        //     this.colorIDs[id].r = fade.r
        //     this.colorIDs[id].g = fade.g
        //     this.colorIDs[id].b = fade.b
        //     this.colorIDs[id].opacity = fade.opacity
        //     if (time >= this.colorFades[id].startTime + this.colorFades[id].duration * 1000) {
        //         to_remove.push(id)
        //     }
        // }
        // to_remove.forEach((i) => delete this.colorFades[i])



        to_remove = []
        this.followCommands.forEach((cmd, i) => {
            if (!(cmd.groupID in displacements)) {
                displacements[cmd.groupID] = {x: 0, y: 0}
            }
            let newX = this.objects[this.groupIDs[cmd.followID].objects[0]].pos.x
            let newY = this.objects[this.groupIDs[cmd.followID].objects[0]].pos.y
            let displacement = cmd.getDisplacement( {x: newX, y: newY} )
            for (const objIdx of this.groupIDs[cmd.groupID].objects) {
                this.objects[objIdx].pos.x += displacement.x
                this.objects[objIdx].pos.y += displacement.y
            }
            if (time >= cmd.startTime + cmd.duration * 1000) {
                to_remove.push(i)
            }
        })
        this.followCommands = this.followCommands.filter((_, i) => !to_remove.includes(i))

        
        for (const i in this.pulseCommands.channel) {
            to_remove = []
            this.pulseCommands.channel[i].forEach((cmd, i) => {
                if (time >= cmd.startTime + (cmd.fadeIn + cmd.hold + cmd.fadeOut) * 1000) {
                    to_remove.push(i)
                }
            })
            this.pulseCommands.channel[i] = this.pulseCommands.channel[i].filter((_, i) => !to_remove.includes(i))
        }
        for (const i in this.pulseCommands.group) {
            to_remove = []
            this.pulseCommands.group[i].forEach((cmd, i) => {
                if (time >= cmd.startTime + (cmd.fadeIn + cmd.hold + cmd.fadeOut) * 1000) {
                    to_remove.push(i)
                }
            })
            this.pulseCommands.group[i] = this.pulseCommands.group[i].filter((_, i) => !to_remove.includes(i))
        }
    }

    getColor(colorID: number): rgbab {

        if (!(colorID in this.colorIDs))
            return {r: 255, g: 255, b: 255, a: 1, blending: false}

        let base = this.colorIDs[colorID].getColor(this)
        if (colorID in this.pulseCommands.channel) {
            for (const cmd of this.pulseCommands.channel[colorID]) {
                let {r, g, b, lerp} = cmd.getColorLerp(this, {id: colorID, color: base})
                base.r = base.r + (r - base.r) * lerp
                base.g = base.g + (g - base.g) * lerp
                base.b = base.b + (b - base.b) * lerp
            }
        }

        return base;
    }

    addGroupID(
        obj: ObjIndex,
        groupID: number,
        add_to_obj: boolean = true, //brb
    ) {
        if (add_to_obj) this.objects[obj].groups.push(groupID)
        if (!(groupID in this.groupIDs)) {
            this.groupIDs[groupID] = {on: true, objects: [], opacity: 1.0};
        }
        if (!(this.groupIDs[groupID].objects.includes(obj))) {
            this.groupIDs[groupID].objects.push( obj );
        }
    }
    // addColorID(
    //     obj: ObjIndex,
    //     colorID: number,
    // ) {
    //     if (!(colorID in this.colorIDs)) {
    //         this.colorIDs[colorID] = {objects: []};
    //     }
    //     if (!(this.colorIDs[colorID].objects.includes(obj))) {
    //         this.colorIDs[colorID].objects.push( obj );
    //     }
    // }
    addItemID(
        obj: ObjIndex,
        itemID: number,
    ) {
        if (!(itemID in this.itemIDs)) {
            this.itemIDs[itemID] = {value: 0, objects: []};
        }
        if (!(this.itemIDs[itemID].objects.includes(obj))) {
            this.itemIDs[itemID].objects.push( obj );
        }
    }
    addBlockID(
        obj: ObjIndex,
        blockID: number,
    ) {
        if (!(blockID in this.blockIDs)) {
            this.blockIDs[blockID] = {objects: []};
        }
        if (!(this.blockIDs[blockID].objects.includes(obj))) {
            this.blockIDs[blockID].objects.push( obj );
        }
    }
    
    toggleGroupID(
        groupID: number,
        on: boolean,
    ) {
        if ((groupID in this.groupIDs) && (on != this.groupIDs[groupID].on)) {
            this.groupIDs[groupID].on = on
            if (on) {
                for (let i = 0; i < this.groupIDs[groupID].objects.length; i++) {
                    this.objects[this.groupIDs[groupID].objects[i]].toggleOn();
                }
            } else {
                for (let i = 0; i < this.groupIDs[groupID].objects.length; i++) {
                    this.objects[this.groupIDs[groupID].objects[i]].toggleOff();
                }
            }
        }
        // console.log("/")
        // this.objects.forEach((o) => console.log(o.disables))
        // console.log("/")
    }
    
    spawnGroupID(
        groupID: number,
    ) {
        if (!(groupID in this.groupIDs))
            return
        if (this.spawned_this_frame.has(groupID)) return
        this.spawned_this_frame.add(groupID)

        this.spawnObjects(this.groupIDs[groupID].objects)
        // const d = new Date()
        // const time = d.getTime()
        // for (let i = 0; i < this.groupIDs[groupID].objects.length; i++) {
        //     let obj = this.objects[this.groupIDs[groupID].objects[i]]
        //     if ((obj instanceof Trigger) && obj.disables == 0) {
        //         obj.lastTrigger = time
        //         obj.trigger(this)
        //     }
        // }
    }

    spawnObjects(objects: ObjIndex[]) {
        const d = new Date()
        const time = d.getTime()
        for (let i = 0; i < objects.length; i++) {
            let obj = this.objects[objects[i]]
            if ((obj instanceof Trigger) && obj.disables == 0) {
                obj.lastTrigger = time
                obj.trigger(this)
            }
        } 
    }

    scheduleSpawnGroupID(
        groupID: number,
        time: number,
    ) {
        if (!(groupID in this.groupIDs))
            return
        
        this.scheduled_spawns.push({time: time, group: groupID})
    }
    
    changeItemID(
        itemID: number,
        amount: number,
    ) {
        if (!(itemID in this.itemIDs))
            this.itemIDs[itemID] = {value: 0, objects: []};
        
        this.itemIDs[itemID].value += amount;

        this.countListeners.forEach((l, i) => {
            if (l.itemID == itemID && this.itemIDs[itemID].value == l.target_count) {
                this.countListeners[i].activated_before = true
                this.toggleGroupID(l.groupID, l.activate_group)
                if (l.activate_group) {
                    this.spawnGroupID(l.groupID)
                }
            }
        })
        
        
        this.countListeners = this.countListeners.filter(l => !(l.activated_before && !l.multi_activate))
    
        for (let i = 0; i < this.itemIDs[itemID].objects.length; i++) {
            let obj = this.objects[this.itemIDs[itemID].objects[i]]
            // if (obj instanceof Display) {
            //     obj.set_value(/*...*/)
            // }
        }
    }
    
    getItemID(
        itemID: number,
    ) {
        if (!(itemID in this.itemIDs))
            return 0
    
        return this.itemIDs[itemID].value
    }

    addMoveCommand(
        groupID: number,
        moveX: number,
        moveY: number,
        duration: number,
        easingFunc: Function,
        trigger_obj: ObjIndex
    ) {
        if (!(groupID in this.groupIDs))
            return
        
        this.moveCommands.push(
            new MoveCommand(
                groupID,
                moveX,
                moveY,
                duration,
                easingFunc,
                this.time,
                trigger_obj
            )
        )
    }
    addAlphaCommand(
        groupID: number,
        opacity: number,
        duration: number,
    ) {
        if (!(groupID in this.groupIDs))
            return

        this.alphaCommands[groupID] = new AlphaCommand(
            groupID,
            opacity,
            duration,
            this.groupIDs[groupID].opacity,
            this.time
        )
        
    }

    addTouchListener(
        groupID: number,
        touchMode: TouchMode,
        holdMode: boolean,
        dualMode: boolean,
        trigger_obj: ObjIndex
    ) {
        if (!(groupID in this.groupIDs))
            return

        this.touchListeners.push(new TouchListener(
            groupID, touchMode, holdMode, dualMode, trigger_obj
        ))
    }

    addCountListener(groupID: number, itemID: number, target_count: number, multi_activate: boolean, activate_group: boolean, trigger_obj: number) {
        if (!(groupID in this.groupIDs))
            return

        this.countListeners.push(new CountListener(
            groupID, itemID, target_count, multi_activate, activate_group, trigger_obj
        ))
    }

    addCollisionListener(
        groupID: number,
        blockA: number,
        blockB: number,
        activateGroup: boolean,
        onExit: boolean,
        trigger_obj: ObjIndex
    ) {
        if (!(groupID in this.groupIDs))
            return

        if (!(blockA in this.collisionListeners))
            this.collisionListeners[blockA] = []

        let juj = new CollisionListener(
            groupID, blockB, activateGroup, onExit, trigger_obj
        )
        this.collisionListeners[blockA].push(juj)
    }

    addRotateCommand(
        groupID: number,
        centerID: number,
        degrees: number,
        duration: number,
        easingFunc: Function,
        lockRotation: boolean,
        trigger_obj: ObjIndex
    ) {
        if (!(groupID in this.groupIDs))
            return
        if (!(centerID in this.groupIDs))
            return
        
        if (this.groupIDs[centerID].objects.length != 1)
            return

        this.rotateCommands = this.rotateCommands.filter((cmd) => cmd.groupID != groupID)
    
        this.rotateCommands.push(
            new RotateCommand(
                groupID,
                centerID,
                degrees,
                duration,
                easingFunc,
                lockRotation,
                this.time,
                trigger_obj
            )
        )
        
    }

    addFollowCommand(
        groupID: number,
        followID: number,
        xMod: number,
        yMod: number,
        duration: number,
        trigger_obj: ObjIndex
    ) {
        if (!(groupID in this.groupIDs))
            return
        if (!(followID in this.groupIDs))
            return
        
        if (this.groupIDs[followID].objects.length != 1)
            return

        this.followCommands = this.followCommands.filter((cmd) => !(cmd.groupID == groupID && cmd.followID == followID))
    
        this.followCommands.push(
            new FollowCommand(
                groupID,
                followID,
                xMod,
                yMod,
                duration,
                this.time,
                trigger_obj
            )
        )

        
    }

    startFade(
        colorID: number,
        duration: number,
        data: ChannelData,
        trigger_obj: ObjIndex,
    ) {
        
        let {r, g, b, a} = colorID in this.colorIDs ? this.colorIDs[colorID].getColor(this) : {r: 255, b: 255, g: 255, a: 1}
        let from: rgba = {r, g, b, a}
        
        this.colorIDs[colorID] = new Fading(
            from,
            data,
            duration,
            (new Date()).getTime(),
            trigger_obj,
        )
        
    }

    addPulseCommand(
        target: PulseChannelTarget | PulseGroupTarget,
        fadeIn: number,
        hold: number,
        fadeOut: number,
        exclusive: boolean,
        pulseData: ChannelData,
        trigger_obj: ObjIndex,
    ) {

        if (target instanceof PulseChannelTarget && !(target.id in this.colorIDs))
            return
        if (target instanceof PulseGroupTarget && !(target.id in this.groupIDs))
            return
        
        if (exclusive) {
            if (target instanceof PulseChannelTarget && (target.id in this.pulseCommands.channel))
                this.pulseCommands.channel[target.id] = []
            if (target instanceof PulseGroupTarget && (target.id in this.pulseCommands.group))
                this.pulseCommands.group[target.id] = []
        }

        if (target instanceof PulseChannelTarget) {

            if (!(target.id in this.pulseCommands.channel)) {
                this.pulseCommands.channel[target.id] = []
            }

            this.pulseCommands.channel[target.id].push(new PulseCommand(
                fadeIn,
                hold,
                fadeOut,
                pulseData,
                false,
                false,
                (new Date()).getTime(),
                trigger_obj,
            ))
        } else {

            if (!(target.id in this.pulseCommands.group)) {
                this.pulseCommands.group[target.id] = []
            }

            this.pulseCommands.group[target.id].push(new PulseCommand(
                fadeIn,
                hold,
                fadeOut,
                pulseData,
                target.mainOnly,
                target.detailOnly,
                (new Date()).getTime(),
                trigger_obj,
            ))
        }

        
    }

    /*
extract obj_props

// create an object with group 10
$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})

a = !{
    10g.move(0, 80, 3)
}
wait(1)
a!
wait(1.2)
a.start_group.stop()
*/
// stop triggers work too!!
// yo i think touch triggers work
// they dont have any of the graph lines yet tho cuz i havent done any of dat yet

    stop(groupID: number) {
        this.groupIDs[groupID].objects.forEach(obj_idx => {
            
            const obj = this.objects[obj_idx]
            if (obj instanceof Trigger) {
                obj.lastTrigger = 0
            }
            if (obj instanceof MoveTrigger) {
                this.moveCommands = this.moveCommands.filter(c => c.trigger_obj != obj_idx)
            } else if (obj instanceof RotateTrigger) {
                this.rotateCommands = this.rotateCommands.filter(c => c.trigger_obj != obj_idx)
            } else if (obj instanceof AlphaTrigger) {
                const t = obj.target
                delete this.alphaCommands[t]
            } else if (obj instanceof TouchTrigger) {
                this.touchListeners = this.touchListeners.filter(c => c.trigger_obj != obj_idx)
            } else if (obj instanceof CountTrigger) {
                this.countListeners = this.countListeners.filter(c => c.trigger_obj != obj_idx)
            } else if (obj instanceof CollisionTrigger) {
                let to_remove = []
                for (const i in this.collisionListeners) {
                    this.collisionListeners[i] = this.collisionListeners[i].filter(c => c.trigger_obj != obj_idx)
                    if (this.collisionListeners[i].length == 0) to_remove.push(i)
                }
                for (const i of to_remove) delete this.collisionListeners[i]
            } else if (obj instanceof ColorTrigger) {
                const t = obj.colorID
                if (this.colorIDs[t] instanceof Fading) {
                    (<Fading>this.colorIDs[t]).stopped = true
                }
                // delete this.colorFades[t]
            }
        });
    }


}




export {
    World,
    type ChannelData,
    RGBData,
    CopyData,
    Stable,
    Fading,
    PlayerColor,
    type rgbab,
}

