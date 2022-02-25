
import GDObject from "./object";
import type {ChannelData, World} from "../world/world"
import {sheets} from "../sketch/spritesheets"
import {spritesheets} from "../sketch/sketch"


const ctxSize = 540


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
        //console.log(typeof this.mainID, typeof this.detailID)
        if (this.mainGraphics == undefined) {
            this.mainGraphics = p5.createGraphics(ctxSize, ctxSize)
            this.mainGraphics.translate(ctxSize/2, ctxSize/2)
        } else if (this.detailGraphics == undefined) {
            this.detailGraphics = p5.createGraphics(ctxSize, ctxSize)
            this.detailGraphics.translate(ctxSize/2, ctxSize/2)
        } else if (spritesheets) {
            //let g = p5.createGraphics(p5.width, p5.height)

            let main: ChannelData = world.getColor(this.mainID)
            let detail: ChannelData = world.getColor(this.detailID)
            
            let triggerAlpha = 1; // yea but youre multiplying EVERY group in the worldlol
            

            this.groups.forEach(g => {
                triggerAlpha *= world.groupIDs[g].opacity
            })
            

            let ctx = this.mainGraphics.drawingContext
            this.mainGraphics.clear()
            ctx.globalAlpha = main.opacity * triggerAlpha

            ctx.globalCompositeOperation = 'copy';
            ctx.fillStyle = 'rgb(0, 0, 0, 1)';
            ctx.fillRect(-ctxSize/2, -ctxSize/2, ctxSize, ctxSize);

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
            ctx.fillRect(-ctxSize/2, -ctxSize/2, ctxSize, ctxSize);


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

            p5.image(this.mainGraphics, -ctxSize/2, -ctxSize/2)


            ctx = this.detailGraphics.drawingContext
            this.detailGraphics.clear()
            ctx.globalAlpha = detail.opacity * triggerAlpha

            ctx.globalCompositeOperation = 'copy';
            ctx.fillStyle = `rgb(0, 0, 0, 1)`;
            ctx.fillRect(-ctxSize/2, -ctxSize/2, ctxSize, ctxSize);

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
            ctx.fillRect(-ctxSize/2, -ctxSize/2, ctxSize, ctxSize);


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

            ctx.restore()

            p5.image(this.detailGraphics, -ctxSize/2, -ctxSize/2)
            
        }
    }
}


export {
    Regular,
}
