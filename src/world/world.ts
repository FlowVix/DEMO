import type Object from "../objects/object"
import {Trigger, ToggleTrigger, SpawnTrigger, PickupTrigger, InstantCountTrigger, TouchMode, MoveTrigger, AlphaTrigger, TouchTrigger} from "../objects/triggers"
import {Display} from "../objects/special"
 
type ObjIndex = number;

interface GroupIDData {
    objects: ObjIndex[];
    on: boolean;
    opacity: number;
}
interface ColorIDData {
    objects: ObjIndex[];
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



class World {

    objects: Object[] = [];

    groupIDs: Record<number, GroupIDData> = {};
    colorIDs: Record<number, ColorIDData> = {};
    itemIDs: Record<number, ItemIDData> = {};
    blockIDs: Record<number, BlockIDData> = {};

    scheduled_spawns: {time: number, group: number}[] = [];
    moveCommands: MoveCommand[] = [];
    rotateCommands: RotateCommand[] = [];
    alphaCommands: Record<number, AlphaCommand> = {};
    touchListeners: TouchListener[] = [];

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
        this.alphaCommands = {}
        this.touchListeners = []
        this.time = 0;
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
    addColorID(
        obj: ObjIndex,
        colorID: number,
    ) {
        if (!(colorID in this.colorIDs)) {
            this.colorIDs[colorID] = {objects: []};
        }
        if (!(this.colorIDs[colorID].objects.includes(obj))) {
            this.colorIDs[colorID].objects.push( obj );
        }
    }
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

        console.log(this.touchListeners)
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
        if (this.groupIDs[centerID].objects.length != 1)
                return

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
            } else if (obj instanceof AlphaTrigger) {
                const t = obj.target
                delete this.alphaCommands[t]
            } else if (obj instanceof TouchTrigger) {
                this.touchListeners = this.touchListeners.filter(c => c.trigger_obj != obj_idx)
            }
        });
    }


}




export default World

