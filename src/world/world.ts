import type Object from "../objects/object"
import {Trigger, ToggleTrigger, SpawnTrigger, PickupTrigger, InstantCountTrigger} from "../objects/triggers"
import {Display} from "../objects/special"


interface GroupIDData {
    objects: Object[];
    on: boolean;
}
interface ColorIDData {
    objects: Object[];
}
interface ItemIDData {
    objects: Object[];
    value: number;
}
interface BlockIDData {
    objects: Object[];
}

class World {

    objects: Object[] = [];

    groupIDs: Record<number, GroupIDData> = {};
    colorIDs: Record<number, ColorIDData> = {};
    itemIDs: Record<number, ItemIDData> = {};
    blockIDs: Record<number, BlockIDData> = {};
    
    displays: Display[] = [];

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
        obj: Object,
        groupID: number,
    ) {
        if (!(groupID in this.groupIDs)) {
            this.groupIDs[groupID] = {on: true, objects: []};
        }
        if (!(this.groupIDs[groupID].objects.includes(obj))) {
            this.groupIDs[groupID].objects.push( obj );
        }
    }
    addColorID(
        obj: Object,
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
        obj: Object,
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
        obj: Object,
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
                    this.groupIDs[groupID].objects[i].toggleOn();
                }
            } else {
                for (let i = 0; i < this.groupIDs[groupID].objects.length; i++) {
                    this.groupIDs[groupID].objects[i].toggleOff();
                }
            }
        }
    }
    
    spawnGroupID(
        groupID: number,
    ) {
        if (!(groupID in this.groupIDs))
            return
        
        for (let i = 0; i < this.groupIDs[groupID].objects.length; i++) {
            let obj = this.groupIDs[groupID].objects[i]
            if ((obj instanceof Trigger) && obj.disables == 0) {
                obj.trigger(this)
            }
        }
    }
    
    changeItemID(
        itemID: number,
        amount: number,
    ) {
        if (!(itemID in this.itemIDs))
            this.itemIDs[itemID] = {value: 0, objects: []};
        
        this.itemIDs[itemID].value += amount;
    
        for (let i = 0; i < this.itemIDs[itemID].objects.length; i++) {
            let obj = this.itemIDs[itemID].objects[i]
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

