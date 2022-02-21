import type Object from "../objects/object"
import {Trigger, ToggleTrigger, SpawnTrigger, PickupTrigger, InstantCountTrigger} from "../objects/triggers"
import {Display} from "../objects/special"
 
type ObjIndex = number;

interface GroupIDData {
    objects: ObjIndex[];
    on: boolean;
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

class World {

    objects: Object[] = [];

    groupIDs: Record<number, GroupIDData> = {};
    colorIDs: Record<number, ColorIDData> = {};
    itemIDs: Record<number, ItemIDData> = {};
    blockIDs: Record<number, BlockIDData> = {};

    scheduled_spawns: {time: number, group: number}[] = [];

    constructor() {
        this.reset()
    }
    reset() {
        this.objects = []
        this.groupIDs = {}
        this.colorIDs = {}
        this.itemIDs = {}
        this.blockIDs = {}
    }

    addGroupID(
        obj: ObjIndex,
        groupID: number,
        add_to_obj: boolean = true, //brb
    ) {
        if (add_to_obj) this.objects[obj].groups.push(groupID)
        if (!(groupID in this.groupIDs)) {
            this.groupIDs[groupID] = {on: true, objects: []};
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
    }
    
    spawnGroupID(
        groupID: number,
    ) {
        if (!(groupID in this.groupIDs))
            return
        const d = new Date()
        const time = d.getTime()
        for (let i = 0; i < this.groupIDs[groupID].objects.length; i++) {
            let obj = this.objects[this.groupIDs[groupID].objects[i]]
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

}




export default World

