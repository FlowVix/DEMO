
import GDObject from "./object";
import type World from "../world/world"
import {sheets} from "../sketch/spritesheets"
import {spritesheets} from "../sketch/sketch"


class Regular extends GDObject {


    mainSize: number;
    detailSize: number;

    mainSheetPos: [number, number];
    detailSheetPos: [number, number];

    sheet: number;

    constructor(x: number, y: number, idx: number, obj_id: number) {
        super(x, y, idx)
        this.sheet = obj_id < 1000 ? 0 : 1;

        this.mainSize = sheets[this.sheet][obj_id][0][2]
        this.detailSize = sheets[this.sheet][obj_id][1][2]

        this.mainSheetPos = [sheets[this.sheet][obj_id][0][0], sheets[this.sheet][obj_id][0][1]]
        this.detailSheetPos = [sheets[this.sheet][obj_id][1][0], sheets[this.sheet][obj_id][1][1]]
    }
    
    draw(p5: any, world: World) {
        if (spritesheets) {
            p5.image(
                spritesheets[this.sheet],
                - this.mainSize / 4,
                - this.mainSize / 4,
                this.mainSize / 2,
                this.mainSize / 2,
                this.mainSheetPos[0],
                this.mainSheetPos[1],
                this.mainSize,
                this.mainSize,
            )
            p5.image(
                spritesheets[this.sheet],
                - this.detailSize / 4,
                - this.detailSize / 4,
                this.detailSize / 2,
                this.detailSize / 2,
                this.detailSheetPos[0],
                this.detailSheetPos[1],
                this.detailSize,
                this.detailSize,
            )
        }
    }
}


export {
    Regular,
}
