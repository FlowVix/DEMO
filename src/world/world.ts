import type Object from "../objects/object"
import {Trigger, ToggleTrigger, SpawnTrigger, PickupTrigger, InstantCountTrigger, TouchMode, MoveTrigger, AlphaTrigger, TouchTrigger, RotateTrigger, CountTrigger, CollisionTrigger} from "../objects/triggers"
import {CollisionObject, Display} from "../objects/special"
 
type ObjIndex = number;



class ChannelData {
    color: {r: number, g: number, b: number} = {r: 255, g: 255, b: 255};
    opacity: number = 1;
    blending: boolean = false;
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
        time: number
    ): {x: number, y: number} {
        let lerp = Math.min(1, (time - this.startTime) / (this.duration * 1000));
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
        time: number
    ): number {
        let lerp = Math.min(1, (time - this.startTime) / (this.duration * 1000));
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
        {x: lastX, y: lastY},
        public xMod: number,
        public yMod: number,
        public duration: number,
        public startTime: number,
        public trigger_obj: ObjIndex
    ) {
        this.lastVec.x = lastX
        this.lastVec.y = lastY
        console.log("baba:", lastX, lastY, followID)
    }

    getDisplacement(
        {x: followX, y: followY}
    ): {x: number, y: number} {

        console.log(followX, followY)
        let displacement = {
            x: (followX - this.lastVec.x)*this.xMod,
            y: (followY - this.lastVec.y)*this.yMod,
        }
        this.lastVec.x = followX
        this.lastVec.y = followY
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
        time: number
    ) {
        let lerp = Math.min(1, (time - this.startTime) / (this.duration * 1000));
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

class ColorFade {

    constructor(
        public colorID: number,
        public red: number,
        public green: number,
        public blue: number,
        public opacity: number,
        public duration: number,
        public startTime: number,
        public startRed: number,
        public startGreen: number,
        public startBlue: number,
        public startOpacity: number,
        public triggerObj: ObjIndex,
    ) {}

}

class World {

    objects: Object[] = [];

    groupIDs: Record<number, GroupIDData> = {};
    colorIDs: Record<number, ChannelData> = {};
    itemIDs: Record<number, ItemIDData> = {};
    blockIDs: Record<number, BlockIDData> = {};

    scheduled_spawns: {time: number, group: number}[] = [];

    moveCommands: MoveCommand[] = [];
    rotateCommands: RotateCommand[] = [];
    followCommands: FollowCommand[] = [];
    alphaCommands: Record<number, AlphaCommand> = {};

    touchListeners: TouchListener[] = [];
    countListeners: CountListener[] = [];
    collisionListeners: Record<number, CollisionListener[]> = [];

    collisionBlocks: ObjIndex[] = [];
    dynamicCollisionBlocks: ObjIndex[] = [];

    colorFades: Record<number, ColorFade> = {};

    time: number = 0;

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
        this.countListeners = []
        this.collisionListeners = []
        this.touchListeners = [] // count triggers now work  // epic
        this.time = 0; // had to make a new count macro because the std one doesnt have an option to disable multi activate
    }

    init() {
        this.objects.forEach((obj, i) => {
            if (obj instanceof CollisionObject) {
                this.collisionBlocks.push(i)
                if (obj.dynamic) this.dynamicCollisionBlocks.push(i)
            }
        })
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
            if (obj instanceof Display) {
                obj.set_value(/*...*/)
            }
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
        console.log(juj)
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
                this.objects[this.groupIDs[followID].objects[0]].pos,
                xMod,
                yMod,
                duration,
                this.time,
                trigger_obj
            )
        )

        console.log(this.followCommands)
        
    }

    addColorFade(
        colorID: number,
        red: number,
        green: number,
        blue: number,
        opacity: number,
        duration: number,
        blending: boolean,
        trigger_obj: ObjIndex,
    ) {

        let current: ChannelData = colorID in this.colorIDs ? this.colorIDs[colorID] : new ChannelData();

        this.colorFades[colorID] = new ColorFade(
            colorID,
            red,
            green,
            blue,
            opacity,
            duration,
            this.time,
            current.color.r,
            current.color.g,
            current.color.b,
            current.opacity,
            trigger_obj,
        )
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
                // TODO
            }
        });
    }


}




export {
    World,
    ChannelData
}

