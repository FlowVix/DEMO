

import Constants from "../constants";
import type World from "./world";



import type GDObject from "../objects/object";
import {
    Trigger,
    ToggleTrigger,
    SpawnTrigger,
    PickupTrigger,
    InstantCountTrigger,
    Cmp
} from "../objects/triggers"
import {
    Display
} from "../objects/special"
import {
    Block
} from "../objects/regular"


const parseProps = (
    objStr: string,
): Record<number, any> => {
    const propArr = objStr
                    .replace(/;/g, "")
                    .split(",")
                    .filter(e => e.length > 0)
    let props = {}

    for (let i = 0; i < propArr.length; i += 2) {
        const key = parseInt(propArr[i])
        let value: any = propArr[i + 1]
        switch (key) {
            case Constants.OBJ_PROPS.GROUPS:
                value = value.split(".").map(s => parseInt(s))
                break;
            case Constants.OBJ_PROPS.HVS:
                value = value.split("a")
                value = {
                    h: value[0],
                    s: value[1],
                    v: value[2],
                    s_c: value[3],
                    v_c: value[4],
                }
                break;
            case Constants.OBJ_PROPS.COLOR_2_HVS:
                value = value.split("a")
                value = {
                    h: value[0],
                    s: value[1],
                    v: value[2],
                    s_c: value[3],
                    v_c: value[4],
                }
                break;
            default:
                switch (Constants.OBJ_PROP_TYPES[key]) {
                    case Constants.PropTypes.Num:
                        value = value as number
                        break;
                    case Constants.PropTypes.Bool:
                        value = value == 1
                        break;
                    case Constants.PropTypes.String:
                        value = value as string
                }
                break;
        }

        props[key] = value

    }

    return props

}



const createObject = (
    objStr: string,
    world: World,
): GDObject => {
    const props = parseProps(objStr);
    let obj: GDObject;

    console.log("a", parseInt(props[Constants.OBJ_PROPS.OBJ_ID]))

    switch (parseInt(props[Constants.OBJ_PROPS.OBJ_ID])) {
        case Constants.OBJ_IDS.Triggers.TOGGLE:
			obj = new ToggleTrigger(0, 0)
            break;
		case Constants.OBJ_IDS.Triggers.SPAWN:
			obj = new SpawnTrigger(0, 0)
            break;
		case Constants.OBJ_IDS.Triggers.PICKUP:
			obj = new PickupTrigger(0, 0)
            break;
		case Constants.OBJ_IDS.Triggers.INSTANT_COUNT:
			obj = new InstantCountTrigger(0, 0)
            break;
		case Constants.OBJ_IDS.Special.ITEM_DISPLAY:
			obj = new Display(0, 0)
            break;
		default:
			obj = new Block(0, 0)
            break;
    }

    delete props[Constants.OBJ_PROPS.OBJ_ID]

    for (const i in props) {
        switch (parseInt(i)) {
            case Constants.OBJ_PROPS.X:
                obj.pos.x = props[i]
                break;
            case Constants.OBJ_PROPS.Y:
                obj.pos.y = props[i]
                break;
            case Constants.OBJ_PROPS.HORIZONTAL_FLIP:
                obj.scale.x = props[i] ? (-1) : 1
                break;
            case Constants.OBJ_PROPS.VERTICAL_FLIP:
                obj.scale.y = props[i] ? (-1) : 1
                break;
            case Constants.OBJ_PROPS.ROTATION:
                obj.rotation = props[i]
                break;
            case Constants.OBJ_PROPS.GROUPS:
                props[i].forEach(g => {
                    world.addGroupID(obj, g)
                });
                break;
            default:
                if (obj instanceof Display) {
                    if (parseInt(i) == Constants.OBJ_PROPS.ITEM) {
                        obj.itemID = parseInt(props[i])
                        world.addItemID(obj, parseInt(props[i]))
                    }
                } else if (obj instanceof Trigger) {
                    switch (parseInt(i)) {
                        case Constants.OBJ_PROPS.TOUCH_TRIGGERED:
							obj.touchTriggered = props[i]
                            break;
						case Constants.OBJ_PROPS.SPAWN_TRIGGERED:
							obj.spawnTriggered = props[i]
                            break;
						case Constants.OBJ_PROPS.MULTI_TRIGGER:
							obj.multiTrigger = props[i]
                            break;
                        default:
                            if (obj instanceof ToggleTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.target = props[i]
                                        break;
									case Constants.OBJ_PROPS.ACTIVATE_GROUP:
										obj.activate = props[i]
                                        break;
                                }
                            } else if (obj instanceof SpawnTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.target = props[i]
                                        break;
									case Constants.OBJ_PROPS.SPAWN_DURATION:
										obj.delay = props[i]
                                        break;
                                }
                            } else if (obj instanceof PickupTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.ITEM:
										obj.itemID = props[i]
                                        break;
									case Constants.OBJ_PROPS.COUNT:
										obj.amount = props[i]
                                        break;
                                }
                            } else if (obj instanceof InstantCountTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.ITEM:
										obj.itemID = props[i]
                                        break;
									case Constants.OBJ_PROPS.COUNT:
										obj.amount = props[i]
                                        break;
									case Constants.OBJ_PROPS.ACTIVATE_GROUP:
										obj.activate = props[i]
                                        break;
									case Constants.OBJ_PROPS.TARGET:
										obj.target = props[i]
                                        break;
									case Constants.OBJ_PROPS.COMPARISON:
										switch (parseInt(i)) {
                                            case 0:
                                                obj.cmpType = Cmp.EQUAL
                                                break;
                                            case 1:
                                                obj.cmpType = Cmp.GREATER
                                                break;
                                            case 2:
                                                obj.cmpType = Cmp.LESSER
                                                break;
                                        }
                                        break;
                                }
                            }
                    }
                    
                }
        }
    }

    return obj

}



export {
    parseProps,
    createObject,
}


