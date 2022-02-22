


enum PropTypes {
    Num,
    String,
    Bool,
}




const OBJ_PROPS = {
	OBJ_ID: 1,
	X: 2,
	Y: 3,
	HORIZONTAL_FLIP: 4,
	VERTICAL_FLIP: 5,
	ROTATION: 6,
	TRIGGER_RED: 7,
	TRIGGER_GREEN: 8,
	TRIGGER_BLUE: 9,
	DURATION: 10,
	TOUCH_TRIGGERED: 11,
	PORTAL_CHECKED: 13,
	PLAYER_COLOR_1: 15,
	PLAYER_COLOR_2: 16,
	BLENDING: 17,
	EDITOR_LAYER_1: 20,
	COLOR: 21,
	COLOR_2: 22,
	TARGET_COLOR: 23,
	Z_LAYER: 24,
	Z_ORDER: 25,
	MOVE_X: 28,
	MOVE_Y: 29,
	EASING: 30,
	TEXT: 31,
	SCALING: 32,
	GROUP_PARENT: 34,
	OPACITY: 35,
	HVS_ENABLED: 41,
	COLOR_2_HVS_ENABLED: 42,
	HVS: 43,
	COLOR_2_HVS: 44,
	FADE_IN: 45,
	HOLD: 46,
	FADE_OUT: 47,
	PULSE_HSV: 48,
	COPIED_COLOR_HVS: 49,
	COPIED_COLOR_ID: 50,
	TARGET: 51,
	TARGET_TYPE: 52,
	YELLOW_TELEPORTATION_PORTAL_DISTANCE: 54,
	ACTIVATE_GROUP: 56,
	GROUPS: 57,
	LOCK_TO_PLAYER_X: 58,
	LOCK_TO_PLAYER_Y: 59,
	COPY_OPACITY: 60,
	EDITOR_LAYER_2: 61,
	SPAWN_TRIGGERED: 62,
	SPAWN_DURATION: 63,
	DONT_FADE: 64,
	MAIN_ONLY: 65,
	DETAIL_ONLY: 66,
	DONT_ENTER: 67,
	ROTATE_DEGREES: 68,
	TIMES_360: 69,
	LOCK_OBJECT_ROTATION: 70,
	FOLLOW: 71,
	CENTER: 71,
	TARGET_POS: 71,
	X_MOD: 72,
	Y_MOD: 73,
	STRENGTH: 75,
	ANIMATION_ID: 76,
	COUNT: 77,
	SUBTRACT_COUNT: 78,
	PICKUP_MODE: 79,
	ITEM: 80,
	BLOCK_A: 80,
	HOLD_MODE: 81,
	TOGGLE_MODE: 82,
	INTERVAL: 84,
	EASING_RATE: 85,
	EXCLUSIVE: 86,
	MULTI_TRIGGER: 87,
	COMPARISON: 88,
	DUAL_MODE: 89,
	SPEED: 90,
	DELAY: 91,
	Y_OFFSET: 92,
	ACTIVATE_ON_EXIT: 93,
	DYNAMIC_BLOCK: 94,
	BLOCK_B: 95,
	GLOW_DISABLED: 96,
	ROTATION_SPEED: 97,
	DISABLE_ROTATION: 98,
	COUNT_MULTI_ACTIVATE: 104,
	USE_TARGET: 100,
	TARGET_POS_AXES: 101,
	EDITOR_DISABLE: 102,
	HIGH_DETAIL: 103,
	MAX_SPEED: 105,
	RANDOMIZE_START: 106,
	ANIMATION_SPEED: 107,
	LINKED_GROUP: 108,
	ACTIVE_TRIGGER: 36,
}


const OBJ_PROP_TYPES = {
	1: PropTypes.Num,
	2: PropTypes.Num,
	3: PropTypes.Num,
	4: PropTypes.Bool,
	5: PropTypes.Bool,
	6: PropTypes.Num,
	7: PropTypes.Num,
	8: PropTypes.Num,
	9: PropTypes.Num,
	10: PropTypes.Num,
	11: PropTypes.Bool,
	13: PropTypes.Bool,
	15: PropTypes.Bool,
	16: PropTypes.Bool,
	17: PropTypes.Bool,
	20: PropTypes.Num,
	21: PropTypes.Num,
	22: PropTypes.Num,
	23: PropTypes.Num,
	24: PropTypes.Num,
	25: PropTypes.Num,
	28: PropTypes.Num,
	29: PropTypes.Num,
	30: PropTypes.Num,
	31: PropTypes.String,
	32: PropTypes.Num,
	34: PropTypes.Bool,
	35: PropTypes.Num,
	41: PropTypes.Bool,
	42: PropTypes.Bool,
	// 43: PropTypes.String,
	// 44: PropTypes.String,
	45: PropTypes.Num,
	46: PropTypes.Num,
	47: PropTypes.Num,
	48: PropTypes.Bool,
	49: PropTypes.String,
	50: PropTypes.Num,
	51: PropTypes.Num,
	52: PropTypes.Num,
	54: PropTypes.Num,
	56: PropTypes.Bool,
	//57
	58: PropTypes.Bool,
	59: PropTypes.Bool,
	60: PropTypes.Bool,
	61: PropTypes.Num,
	62: PropTypes.Bool,
	63: PropTypes.Num,
	64: PropTypes.Bool,
	65: PropTypes.Bool,
	66: PropTypes.Bool,
	67: PropTypes.Bool,
	68: PropTypes.Num,
	69: PropTypes.Num,
	70: PropTypes.Bool,
	
	71: PropTypes.Num,
	
	72: PropTypes.Num,
	73: PropTypes.Num,
	75: PropTypes.Num,
	76: PropTypes.Num,
	77: PropTypes.Num,
	78: PropTypes.Num,
	79: PropTypes.Num,
	
	80: PropTypes.Num,
	
	81: PropTypes.Bool,
	82: PropTypes.Num,
	84: PropTypes.Num,
	85: PropTypes.Num,
	86: PropTypes.Bool,
	87: PropTypes.Bool,
	88: PropTypes.Num,
	89: PropTypes.Bool,
	90: PropTypes.Num,
	91: PropTypes.Num,
	92: PropTypes.Num,
	93: PropTypes.Bool,
	94: PropTypes.Bool,
	95: PropTypes.Num,
	96: PropTypes.Bool,
	97: PropTypes.Num,
	98: PropTypes.Bool,
	104: PropTypes.Bool,
	100: PropTypes.Bool,
	101: PropTypes.Num,
	102: PropTypes.Bool,
	103: PropTypes.Bool,
	105: PropTypes.Num,
	106: PropTypes.Bool,
	107: PropTypes.Num,
	108: PropTypes.Num,
	36: PropTypes.Bool,
}


const OBJ_IDS = {
    Triggers: {
        MOVE: 901,
		ROTATE: 1346,
		ANIMATE: 1585,
		PULSE: 1006,
		COUNT: 1611,
		ALPHA: 1007,
		TOGGLE: 1049,
		FOLLOW: 1347,
		SPAWN: 1268,
		STOP: 1616,
		TOUCH: 1595,
		INSTANT_COUNT: 1811,
		ON_DEATH: 1812,
		FOLLOW_PLAYER_Y: 1814,
		COLLISION: 1815,
		PICKUP: 1817,
		BG_EFFECT_ON: 1818,
		BG_EFFECT_OFF: 1819,
		SHAKE: 1520,
		COLOR: 899,
		ENABLE_TRAIL: 32,
		DISABLE_TRAIL: 33,
		HIDE: 1612,
		SHOW: 1613,
    },
    Portals: {
		GRAVITY_DOWN: 10,
		GRAVITY_UP: 11,
		CUBE: 12,
		SHIP: 13,
		BALL: 47,
		UFO: 111,
		WAVE: 660,
		ROBOT: 745,
		SPIDER: 1331,
		MIRROR_ON: 45,
		MIRROR_OFF: 46,
		SIZE_NORMAL: 99,
		SIZE_MINI: 101,
		DUAL_ON: 286,
		DUAL_OFF: 287,
		TELEPORT: 747,
		SPEED_YELLOW: 200,
		SPEED_BLUE: 201,
		SPEED_GREEN: 202,
		SPEED_PINK: 203,
		SPEED_RED: 1334,
	},
    Special: {
		COLLISION_BLOCK: 1816,
		
		J_BLOCK: 1813,
		H_BLOCK: 1859,
		D_BLOCK: 1755,
		S_BLOCK: 1829,
		
		ITEM_DISPLAY: 1615,
		TEXT: 914,
		
		USER_COIN: 1329,
	},
}

const PI = Math.PI
const cos = Math.cos
const sin = Math.sin
const pow = Math.pow

function easeOutBounce(x: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

const EASING_FUNCS = {

    NONE: x => x,

    EASE_IN_OUT: x => (x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2),
    EASE_IN: x => x * x,
    EASE_OUT: x => 1 - (1 - x) * (1 - x),

    ELASTIC_IN_OUT: x => {
        const c5 = (2 * Math.PI) / 4.5;
        
        return x === 0
          ? 0
          : x === 1
          ? 1
          : x < 0.5
          ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
          : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
    },
    ELASTIC_IN: x => {
        const c4 = (2 * Math.PI) / 3;
            
        return x === 0
            ? 0
            : x === 1
            ? 1
            : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
    },
    ELASTIC_OUT: x => {
        const c4 = (2 * Math.PI) / 3;
        
        return x === 0
          ? 0
          : x === 1
          ? 1
          : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
    },
    
    BOUNCE_IN_OUT: x => (x < 0.5
        ? (1 - easeOutBounce(1 - 2 * x)) / 2
        : (1 + easeOutBounce(2 * x - 1)) / 2
    ),
    BOUNCE_IN: x => 1 - easeOutBounce(1 - x),
    BOUNCE_OUT: x => easeOutBounce(x),
    
    EXPONENTIAL_IN_OUT: x => (x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5 ? pow(2, 20 * x - 10) / 2
        : (2 - pow(2, -20 * x + 10)) / 2
    ),
    EXPONENTIAL_IN: x => x === 0 ? 0 : pow(2, 10 * x - 10),
    EXPONENTIAL_OUT: x => x === 1 ? 1 : 1 - pow(2, -10 * x),
    
    SINE_IN_OUT: x => -(cos(PI * x) - 1) / 2,
    SINE_IN: x => 1 - cos((x * PI) / 2),
    SINE_OUT: x => sin((x * PI) / 2),

    BACK_IN_OUT: x => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        
        return x < 0.5
          ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
          : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },
    BACK_IN: x => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        
        return c3 * x * x * x - c1 * x * x;
    },
    BACK_OUT: x => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        
        return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
    },


}



export default {
    OBJ_PROPS,
    OBJ_PROP_TYPES,
    OBJ_IDS,
    EASING_FUNCS,
    PropTypes,
}
