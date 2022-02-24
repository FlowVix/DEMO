
import GDObject from "./object";
import {ChannelData, World} from "../world/world"
import {sheets} from "../sketch/spritesheets"
import {spritesheets} from "../sketch/sketch"


class Regular extends GDObject {

    mainID: number = 1;
    detailID: number = 1;


    mainSize: number;
    detailSize: number;

    mainSheetPos: [number, number];
    detailSheetPos: [number, number];

    sheet: number;

    mainGraphics: any = undefined;
    detailGraphics: any = undefined;

    constructor(x: number, y: number, idx: number, obj_id: number) {
        super(x, y, idx)
        this.sheet = obj_id < 1000 ? 0 : 1;

        this.mainSize = sheets[this.sheet][obj_id][0][2]
        this.detailSize = sheets[this.sheet][obj_id][1][2]

        this.mainSheetPos = [sheets[this.sheet][obj_id][0][0], sheets[this.sheet][obj_id][0][1]]
        this.detailSheetPos = [sheets[this.sheet][obj_id][1][0], sheets[this.sheet][obj_id][1][1]]
    }
    
    draw(p5: any, world: World) {
        if (this.mainGraphics == undefined) {
            this.mainGraphics = p5.createGraphics(540, 540)
            this.mainGraphics.translate(270, 270)
        } else if (this.detailGraphics == undefined) {
            this.detailGraphics = p5.createGraphics(540, 540)
            this.detailGraphics.translate(270, 270)
        } else if (spritesheets) {
            //let g = p5.createGraphics(p5.width, p5.height)

            let main: ChannelData = this.mainID in world.colorIDs ? world.colorIDs[this.mainID] : new ChannelData();
            let detail: ChannelData = this.detailID in world.colorIDs ? world.colorIDs[this.detailID] : new ChannelData();
            
            

            let ctx = this.mainGraphics.drawingContext
            this.mainGraphics.clear()

            ctx.globalCompositeOperation = 'copy';
            ctx.fillStyle = 'rgb(0, 0, 0, 1)';
            ctx.fillRect(-270, -270, 540, 540);

            ctx.globalCompositeOperation = 'source-over';
            
            ctx.drawImage(
                spritesheets[this.sheet].canvas,
                this.mainSheetPos[0],
                this.mainSheetPos[1],
                this.mainSize,
                this.mainSize,
                - this.mainSize / 4,
                - this.mainSize / 4,
                this.mainSize / 2,
                this.mainSize / 2,
            )

            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = `rgb(${main.color.r}, ${main.color.g}, ${main.color.b}, 1)`;
            ctx.fillRect(-270, -270, 540, 540);


            ctx.globalCompositeOperation = 'destination-atop';
            ctx.drawImage(
                spritesheets[this.sheet].canvas,
                this.mainSheetPos[0],
                this.mainSheetPos[1],
                this.mainSize,
                this.mainSize,
                - this.mainSize / 4,
                - this.mainSize / 4,
                this.mainSize / 2,
                this.mainSize / 2,
            )

            p5.image(this.mainGraphics, -270, -270)


            ctx = this.detailGraphics.drawingContext
            this.detailGraphics.clear()

            ctx.globalCompositeOperation = 'copy';
            ctx.fillStyle = `rgb(0, 0, 0, 1)`;
            ctx.fillRect(-270, -270, 540, 540);

            ctx.globalCompositeOperation = 'source-over';
            
            ctx.drawImage(
                spritesheets[this.sheet].canvas,
                this.detailSheetPos[0],
                this.detailSheetPos[1],
                this.detailSize,
                this.detailSize,
                - this.detailSize / 4,
                - this.detailSize / 4,
                this.detailSize / 2,
                this.detailSize / 2,
            )

            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = `rgb(${detail.color.r}, ${detail.color.g}, ${detail.color.b}, 1)`;
            ctx.fillRect(-270, -270, 540, 540);


            ctx.globalCompositeOperation = 'destination-atop';
            ctx.drawImage(
                spritesheets[this.sheet].canvas,
                this.detailSheetPos[0],
                this.detailSheetPos[1],
                this.detailSize,
                this.detailSize,
                - this.detailSize / 4,
                - this.detailSize / 4,
                this.detailSize / 2,
                this.detailSize / 2,
            )

            p5.image(this.detailGraphics, -270, -270)
            
        }
    }
}


export {
    Regular,
}
