

import Constants from "../constants";
import { type World, RGBData, CopyData, Stable} from "./world";



import type GDObject from "../objects/object";
import {
    Trigger,
    ToggleTrigger,
    SpawnTrigger,
    PickupTrigger,
    InstantCountTrigger,
    MoveTrigger,
    AlphaTrigger,
    TouchTrigger,
    RotateTrigger,
    FollowTrigger,
    CollisionTrigger,
    PulseTrigger,

    PulseChannelTarget,
    PulseGroupTarget,

    TouchMode,
    Cmp,
    StopTrigger,
    CountTrigger,
    OnDeathTrigger,
    ColorTrigger
} from "../objects/triggers" 
import {
    Display,
    CollisionObject,
    TextObject,
} from "../objects/special"
import {
    Regular
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
                    h: parseFloat(value[0]),
                    s: parseFloat(value[1]),
                    v: parseFloat(value[2]),
                    s_c: value[3] == 1,
                    v_c: value[4] == 1,
                }
                break;
            case Constants.OBJ_PROPS.COLOR_2_HVS:
                value = value.split("a")
                value = {
                    h: parseFloat(value[0]),
                    s: parseFloat(value[1]),
                    v: parseFloat(value[2]),
                    s_c: value[3] == 1,
                    v_c: value[4] == 1,
                }
                break;
            case Constants.OBJ_PROPS.COPIED_COLOR_HVS:
                value = value.split("a")
                value = {
                    h: parseFloat(value[0]),
                    s: parseFloat(value[1]),
                    v: parseFloat(value[2]),
                    s_c: value[3] == 1,
                    v_c: value[4] == 1,
                }
                break;
            default:
                switch (Constants.OBJ_PROP_TYPES[key]) {
                    case Constants.PropTypes.Num:
                        value = value as number
                        break;
                    case Constants.PropTypes.Bool:
                        value = value == "1"
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
    idx: number,
): GDObject => {
    const props = parseProps(objStr);
    let obj: GDObject;

    switch (parseInt(props[Constants.OBJ_PROPS.OBJ_ID])) {
        case Constants.OBJ_IDS.Triggers.TOGGLE:
			obj = new ToggleTrigger(idx)
            break;
		case Constants.OBJ_IDS.Triggers.SPAWN:
			obj = new SpawnTrigger(idx)
            break;
		case Constants.OBJ_IDS.Triggers.PICKUP:
			obj = new PickupTrigger(idx)
            break;
		case Constants.OBJ_IDS.Triggers.INSTANT_COUNT:
			obj = new InstantCountTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.MOVE:
            obj = new MoveTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.ALPHA:
            obj = new AlphaTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.TOUCH:
            obj = new TouchTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.COUNT:
            obj = new CountTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.STOP:
            obj = new StopTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.ROTATE:
            obj = new RotateTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.FOLLOW:
            obj = new FollowTrigger(idx)
            break;
		case Constants.OBJ_IDS.Special.ITEM_DISPLAY:
			obj = new Display(idx)
            break;
        case Constants.OBJ_IDS.Special.COLLISION_BLOCK:
            obj = new CollisionObject(idx)
            break;
        case Constants.OBJ_IDS.Special.TEXT:
            obj = new TextObject(idx)
            break;
        case Constants.OBJ_IDS.Triggers.ON_DEATH:
            obj = new OnDeathTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.COLLISION:
            obj = new CollisionTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.COLOR:
            obj = new ColorTrigger(idx)
            break;
        case Constants.OBJ_IDS.Triggers.PULSE:
            obj = new PulseTrigger(idx)
            break;
		default:
			obj = new Regular(idx)
            break;
    }
    obj.objID = parseInt(props[Constants.OBJ_PROPS.OBJ_ID])

    delete props[Constants.OBJ_PROPS.OBJ_ID]

    
    let triggerProps = {}

    for (const i in props) {
        switch (parseInt(i)) {
            case Constants.OBJ_PROPS.X:
                obj.pos.x = parseFloat(props[i])
                break;
            case Constants.OBJ_PROPS.Y:
                obj.pos.y = parseFloat(props[i])
                break;
            case Constants.OBJ_PROPS.HORIZONTAL_FLIP:
                obj.scale.x = props[i] ? (-1) : 1
                break;
            case Constants.OBJ_PROPS.VERTICAL_FLIP:
                obj.scale.y = props[i] ? (-1) : 1
                break;
            case Constants.OBJ_PROPS.ROTATION:
                obj.rotation = -parseFloat(props[i])
                break;
            case Constants.OBJ_PROPS.SCALING:
                obj.scale.x *= parseFloat(props[i])
                obj.scale.y *= parseFloat(props[i])
                break;
            case Constants.OBJ_PROPS.GROUPS:
                props[i].forEach(g => {
                    world.addGroupID(idx, g, false)
                    obj.groups.push(g)
                });
                break;
            default:
                if (obj instanceof Display) {
                    if (parseInt(i) == Constants.OBJ_PROPS.ITEM) {
                        obj.itemID = parseInt(props[i])
                        world.addItemID(idx, parseInt(props[i]))
                    }
                } if (obj instanceof Regular) {
                    if (parseInt(i) == Constants.OBJ_PROPS.COLOR) {
                        obj.mainID = parseInt(props[i])
                        world.colorIDs[parseInt(props[i])] = new Stable(new RGBData(255, 255, 255, 1, false))
                    } else if (parseInt(i) == Constants.OBJ_PROPS.COLOR_2) {
                        obj.detailID = parseInt(props[i])
                        world.colorIDs[parseInt(props[i])] = new Stable(new RGBData(255, 255, 255, 1, false))
                    }
                } else if (obj instanceof CollisionObject) {
                    if (parseInt(i) == Constants.OBJ_PROPS.BLOCK_A) {
                        obj.blockID = parseInt(props[i])
                        world.addBlockID(idx, parseInt(props[i]))
                    } else if (parseInt(i) == Constants.OBJ_PROPS.DYNAMIC_BLOCK) {
                        obj.dynamic = props[i]
                    }
                } else if (obj instanceof TextObject) {
                    if (parseInt(i) == Constants.OBJ_PROPS.TEXT) {
                        obj.text = atob(props[i])
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
										obj.target = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.ACTIVATE_GROUP:
										obj.activate = props[i]
                                        break;
                                }
                            } else if (obj instanceof MoveTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.target = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.MOVE_X:
                                        obj.moveX = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.MOVE_Y:
                                        obj.moveY = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.DURATION:
                                        obj.moveTime = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.EASING:
                                        obj.easingFunc = Object.values(Constants.EASING_FUNCS)[ parseFloat(props[i]) ]
                                        break;
                                    case Constants.OBJ_PROPS.USE_TARGET:
                                        obj.useTarget = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.TARGET_POS:
                                        obj.moveToID = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.TARGET_POS_AXES:
                                        obj.moveAxes = parseInt(props[i])
                                        break;
                                }
                            } else if (obj instanceof SpawnTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.kind.target = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.SPAWN_DURATION:
										obj.delay = parseFloat(props[i])
                                        break;
                                }
                            } else if (obj instanceof ColorTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET_COLOR:
										triggerProps["colorID"] = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.DURATION:
										triggerProps["fadeTime"] = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.TRIGGER_RED:
										triggerProps["red"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.TRIGGER_GREEN:
										triggerProps["green"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.TRIGGER_BLUE:
										triggerProps["blue"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.OPACITY:
										triggerProps["opacity"] = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.BLENDING:
										triggerProps["blending"] = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.COPIED_COLOR_ID:
										triggerProps["copyID"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.COPIED_COLOR_HVS:
										triggerProps["copyHVS"] = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.COPY_OPACITY:
										triggerProps["copyOpacity"] = parseFloat(props[i])
                                        break;
                                }
                            } else if (obj instanceof PulseTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										triggerProps["target"] = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.FADE_IN:
										triggerProps["fadeIn"] = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.HOLD:
										triggerProps["hold"] = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.FADE_OUT:
										triggerProps["fadeOut"] = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.EXCLUSIVE:
										triggerProps["exclusive"] = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.TRIGGER_RED:
										triggerProps["red"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.TRIGGER_GREEN:
										triggerProps["green"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.TRIGGER_BLUE:
										triggerProps["blue"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.PULSE_HSV:
										triggerProps["pulseHSV"] = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.COPIED_COLOR_ID:
										triggerProps["copyID"] = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.COPIED_COLOR_HVS:
										triggerProps["copyHVS"] = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.MAIN_ONLY:
										triggerProps["mainOnly"] = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.DETAIL_ONLY:
										triggerProps["detailOnly"] = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.TARGET_TYPE:
										triggerProps["targetType"] = parseInt(props[i])
                                        break;
                                }
                            } else if (obj instanceof RotateTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.target = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.CENTER:
                                        obj.center = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.ROTATE_DEGREES:
                                        obj.degrees = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.TIMES_360:
                                        obj.times360 = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.EASING:
                                        obj.easingFunc = Object.values(Constants.EASING_FUNCS)[ parseFloat(props[i]) ]
                                        break;
                                    case Constants.OBJ_PROPS.DURATION:
                                        obj.rotateTime = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.LOCK_OBJECT_ROTATION:
                                        obj.lockRotation = props[i]
                                        break;
                                }
                            } else if (obj instanceof FollowTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.target = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.FOLLOW:
                                        obj.follow = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.X_MOD:
                                        obj.xMod = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.Y_MOD:
                                        obj.yMod = parseFloat(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.DURATION:
                                        obj.followTime = parseFloat(props[i])
                                        break;
                                }
                            } else if (obj instanceof StopTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.target = parseInt(props[i])
                                        break;
                                }
                            } else if (obj instanceof CollisionTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.kind.target = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.BLOCK_A:
										obj.blockA = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.BLOCK_B:
										obj.blockB = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.ACTIVATE_GROUP:
										obj.activateGroup = props[i]
                                        break;
                                    case Constants.OBJ_PROPS.ACTIVATE_ON_EXIT:
										obj.onExit = props[i]
                                        break;
                                }
                            } else if (obj instanceof AlphaTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.target = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.DURATION:
										obj.fadeTime = parseFloat(props[i])
                                        break;
									case Constants.OBJ_PROPS.OPACITY:
										obj.opacity = Math.min(1.0, Math.max(0.0, parseFloat(props[i])))
                                        break;
                                }
                            } else if (obj instanceof TouchTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.kind.target = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.TOGGLE_MODE:
										obj.touchMode = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.HOLD_MODE:
										obj.holdMode = props[i]
                                        break;
									case Constants.OBJ_PROPS.DUAL_MODE:
										obj.dualMode = props[i]
                                        break;
                                }
                            } else if (obj instanceof CountTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.kind.target = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.COUNT_MULTI_ACTIVATE:
										obj.multi_activate = props[i]
                                        break;
									case Constants.OBJ_PROPS.ITEM:
										obj.itemID = parseInt(props[i])
                                        break;
                                    case Constants.OBJ_PROPS.COUNT:
                                        obj.target_count = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.ACTIVATE_GROUP:
										obj.activate_group = props[i]
                                        break;
                                }
                            } else if (obj instanceof PickupTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.ITEM:
										obj.itemID = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.COUNT:
										obj.amount = parseInt(props[i])
                                        break;
                                }
                            } else if (obj instanceof InstantCountTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.ITEM:
										obj.itemID = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.COUNT:
										obj.amount = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.ACTIVATE_GROUP:
										obj.activate = props[i]
                                        break;
									case Constants.OBJ_PROPS.TARGET:
										obj.kind.target = parseInt(props[i])
                                        break;
									case Constants.OBJ_PROPS.COMPARISON:
										switch (parseInt(props[i])) {
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
                            }  else if (obj instanceof OnDeathTrigger) {
                                switch (parseInt(i)) {
                                    case Constants.OBJ_PROPS.TARGET:
										obj.kind.target = parseInt(props[i])
                                        break;
                                }
                            }
                    }
                    
                }
        }
    }

    if (obj instanceof ColorTrigger) {
        if (!("copyID" in triggerProps)) {
            let data = new RGBData(
                triggerProps["red"] ?? 255,
                triggerProps["green"] ?? 255,
                triggerProps["blue"] ?? 255,
                triggerProps["opacity"] ?? 1,
                triggerProps["blending"] ?? false,
            )
            obj.colorID = triggerProps["colorID"] ?? 0
            obj.data = data
            obj.fadeTime = triggerProps["fadeTime"] ?? 0.5
        } else {
            let data = new CopyData(
                triggerProps["copyID"] ?? 0,
                triggerProps["copyHVS"]?.h ?? 0,
                triggerProps["copyHVS"]?.s ?? 1,
                triggerProps["copyHVS"]?.v ?? 1,
                triggerProps["copyHVS"]?.s_c ?? false,
                triggerProps["copyHVS"]?.v_c ?? false,
                triggerProps["copyOpacity"] ?? false,
                triggerProps["opacity"] ?? 1, 
                triggerProps["blending"] ?? false,
            )
            obj.colorID = triggerProps["colorID"] ?? 0
            obj.data = data
            obj.fadeTime = triggerProps["fadeTime"] ?? 0.5
        }
    } else if (obj instanceof PulseTrigger) {
        if (!("pulseHSV" in triggerProps && triggerProps["pulseHSV"])) {
            let data = new RGBData(
                triggerProps["red"] ?? 255,
                triggerProps["green"] ?? 255,
                triggerProps["blue"] ?? 255,
                1,
                false,
            )
            obj.pulseData = data
        } else {
            let data = new CopyData(
                triggerProps["copyID"] ?? 0,
                triggerProps["copyHVS"]?.h ?? 0,
                triggerProps["copyHVS"]?.s ?? 1,
                triggerProps["copyHVS"]?.v ?? 1,
                triggerProps["copyHVS"]?.s_c ?? false,
                triggerProps["copyHVS"]?.v_c ?? false,
                false,
                1, 
                false,
            )
            obj.pulseData = data
        }
        obj.fadeIn = triggerProps["fadeIn"] ?? 0
        obj.hold = triggerProps["hold"] ?? 0
        obj.fadeOut = triggerProps["fadeOut"] ?? 0
        obj.exclusive = triggerProps["exclusive"] ?? false
        if ("targetType" in triggerProps && triggerProps["targetType"] == 1) {
            obj.target = new PulseGroupTarget(
                triggerProps["target"],
                triggerProps["mainOnly"] ?? false,
                triggerProps["detailOnly"] ?? false,
            )
        } else {
            obj.target = new PulseChannelTarget(
                triggerProps["target"]
            )
        }

    }

    //console.log(obj)

    return obj

}



export {
    parseProps,
    createObject,
}


