import GDObject from "./object";

import type {ChannelData, rgbab, World} from "../world/world";

import { PUSAB_FONT } from "../trigger_graph_sketch/sketch";

import * as PIXI from "pixi.js";

import constants from "../constants"
import {sheet2} from "../gd_world/resources"


export class Display extends GDObject {
    itemID: number = 0;
    //( ͡ °  ͜ ʖ  ͡ °)

    draw(p5: any, world: World) {
        let value = 0;
        if (this.itemID in world.itemIDs) {
            value = world.itemIDs[this.itemID].value
        }
        p5.noStroke()
        p5.fill(255, this.getTotalOpacity(world)*255)
        p5.textAlign(p5.CENTER)
        p5.textSize(16)
        p5.text(value, 0, 10)
        p5.textSize(6)
        p5.text(`Display ${this.itemID}i`, 0, -5)
    }

    render(root, methods) {

        let qualityResizer = new PIXI.Container()
        let quality = 4;
        
        const title = new PIXI.Text(`Display ${this.itemID}i`, {
            fill: "white",
            fontSize: 8*quality,
            fontFamily: "Arial",
            strokeThickness: 1*quality,
            align: "center",
        });
        
        title.anchor.x = 0.5
        title.anchor.y = 0.5
        title.position.y = -9*quality

        const text = new PIXI.Text("0", {
            fill: "white",
            fontFamily: "Pusab",
            miterLimit: 0,
            fontSize: 18*quality,
            strokeThickness: 2*quality,
            align: "center",
        });
        text.anchor.x = 0.5
        text.anchor.y = 0.5
        text.position.y = 5*quality

        qualityResizer.addChild(title)
        qualityResizer.addChild(text)

        qualityResizer.scale.x = 1/quality
        qualityResizer.scale.y = 1/quality

        root.addChild(qualityResizer)
        methods["changeText"] = (t: string) => text.text = t
    }

}
export class CollisionObject extends GDObject {
    blockID: number = 0;
    dynamic: boolean = false;

    draw(p5: any, world: World) {
        p5.stroke(170)
        p5.strokeWeight(2)

        for (let _ in [null, null]) {
            p5.line(-14, -14, -14 + 4.66, -14)
            p5.line(-14, 14, -14 + 4.66, 14)
            p5.line(-14 + 4.66*2, -14, -14 + 4.66*4, -14)
            p5.line(-14 + 4.66*2, 14, -14 + 4.66*4, 14)
            p5.line(14, -14, 14 - 4.66, -14)
            p5.line(14, 14, 14 - 4.66, 14)
            p5.rotate(p5.PI/2)
        }
        p5.rotate(p5.PI)

        p5.noStroke()
        p5.fill(255, 50)
        p5.rect(-14, -14, 28, 28)
        if (this.blockID != 0) {
            p5.fill(255, 200)
            p5.textSize(32 / `${this.blockID}b`.length)
            p5.textAlign(p5.CENTER, p5.CENTER)
            p5.text(`${this.blockID}b${this.dynamic?'*':''}`, 0, 0)
        }
    }

    render(root: PIXI.Container, methods): void {

        let spriteMain = new PIXI.Sprite(sheet2.textures[`${constants.OBJ_IDS.Special.COLLISION_BLOCK}_main.png`])
        spriteMain.anchor.x = 0.5
        spriteMain.anchor.y = 0.5

        spriteMain.scale.x = 0.5
        spriteMain.scale.y = 0.5

        root.addChild(spriteMain)

        let qualityResizer = new PIXI.Container()
        let quality = 4;
        
        const blockText = new PIXI.Text(`${this.blockID}b${this.dynamic?'*':''}`, {
            fill: "white",
            fontSize: 14*quality,
            fontFamily: "Arial",
            strokeThickness: 2*quality,
            align: "center",
        });
        
        blockText.anchor.x = 0.5
        blockText.anchor.y = 0.5
        
        qualityResizer.scale.x = 1/quality
        qualityResizer.scale.y = 1/quality

        qualityResizer.addChild(blockText)
        root.addChild(qualityResizer)

    }

}





export class TextObject extends GDObject {
    text: string = ""
    color_id: number = 1;
    draw(p5: any, world: World) {
        if (PUSAB_FONT) {
            p5.textFont(PUSAB_FONT)
        }

        let c = world.getColor(this.color_id)
        let triggerAlpha = 1
        this.groups.forEach(g => {
            triggerAlpha *= world.groupIDs[g].opacity
        })
        // TODO: color shit
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill(c.r, c.g, c.b, c.a * triggerAlpha * 255)
        p5.strokeWeight(2)
        p5.stroke(0)
        p5.textSize(16)
        p5.text(this.text, 0, 0)
    }

    render(root: PIXI.Container, methods): void {


        let qualityResizer = new PIXI.Container()
        let quality = 4;

        let textStyle = new PIXI.TextStyle({
            align: "center",
            dropShadow: true,
            dropShadowAlpha: 0.4,
            dropShadowDistance: 3*quality,
            dropShadowAngle: 0.6,
            fill: "white",
            fontFamily: "pusab",
            fontSize: 32*quality,
            miterLimit: 0,
            strokeThickness: 4*quality
        })

        const text = new PIXI.Text(this.text, textStyle);
        text.anchor.x = 0.5
        text.anchor.y = 0.5

        qualityResizer.addChild(text)

        qualityResizer.scale.x = 1/quality
        qualityResizer.scale.y = 1/quality

        root.addChild(qualityResizer)

        methods["changeColor"] = (c: rgbab) => textStyle.fill = PIXI.utils.rgb2hex([c.r/255, c.g/255, c.b/255])

    }
}
