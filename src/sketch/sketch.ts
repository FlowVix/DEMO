
import P5 from 'p5-svelte';
import {type World, Fading, Stable} from '../world/world';
import type GDObject from '../objects/object'
import { CollisionTrigger, InstantCountTrigger, SpawnTrigger, TouchMode } from '../objects/triggers';
import { Regular } from '../objects/regular';
import Col from 'detect-collisions'
import type { CollisionObject } from '../objects/special';



interface Vector {
    x: number,
    y: number,
}

const CAMERA_SPEED = 10;

let spritesheets;

// brb
// oke
const worldSketch = (
    world: World,
): [(any) => any] => {

    let zoom = 1;
    let zoomExp = 0;
    let cameraPos = {x: 0, y: 0};
    let cameraMove = {x: 0, y: 0};

    const sketch = (p5: any) => {


        let p5div, cnv;

        let pressingInput1 = false;
        let pressingInput2 = false;

        const activateListeners = (activate: boolean, touch2: boolean) => {
            if (touch2) pressingInput2 = activate
            else pressingInput1 = activate

            world.touchListeners.forEach((tl) => {
                if (!tl.dualMode && touch2) return
                if ((!tl.holdMode) && (!activate)) return
                switch (tl.touchMode) {
                    case TouchMode.Normal:
                        world.toggleGroupID(tl.groupID, !world.groupIDs[tl.groupID].on)
                        break;
                    case TouchMode.On:
                        world.toggleGroupID(tl.groupID, activate)
                        break;
                    case TouchMode.Off:
                        world.toggleGroupID(tl.groupID, !activate)
                        break;
                }
                if (world.groupIDs[tl.groupID].on) {
                    world.spawnGroupID(tl.groupID)
                }
            })
        }



        const mouseInside = (left = 0, right = p5.width, top = 0, bottom = p5.height): boolean => {
            return !(p5.mouseX < left || p5.mouseX > right || p5.mouseY < top || p5.mouseY > bottom)
        }
        let system: Col.System;

        p5.preload = () => {
            //const PUSAB_FONT = p5.loadFont('assets/fonts/pusab.otf');
            spritesheets = [
                p5.loadImage(`assets/images/objects/spritesheet_1.png`),
                p5.loadImage(`assets/images/objects/spritesheet_2.png`)
            ]
            system = new Col.System();
        }

        

        p5.setup = () => {
            cnv = p5.createCanvas(400, 400);
            p5.frameRate(240)
            p5div = document.getElementById("sketch")
        };

        p5.keyPressed = () => {
            if (mouseInside())
                switch (p5.keyCode) {
                    case 65:
                        cameraMove.x -= CAMERA_SPEED;
                        break;
                    
                    case 87:
                        cameraMove.y += CAMERA_SPEED;
                        break;
                        
                    case 68:
                        cameraMove.x += CAMERA_SPEED;
                        break;
                    
                    case 83:
                        cameraMove.y -= CAMERA_SPEED;
                        break;

                    case 38:
                        activateListeners(true, false)
                        break;

                    case 32:
                        activateListeners(true, true)
                        break;
                }
        }
        p5.keyReleased = () => {
            switch (p5.keyCode) {
                case 65:
                    cameraMove.x = 0;
                    break;
                
                case 87:
                    cameraMove.y = 0;
                    break;
                    
                case 68:
                    cameraMove.x = 0;
                    break;
                
                case 83:
                    cameraMove.y = 0;
                    break;
                
                case 38:
                    if (pressingInput1) {
                        activateListeners(false, false)
                    }
                    break;

                case 32:
                    if (pressingInput2) {
                        activateListeners(false, true)
                    }
                    break;

                
                case 81:
                    console.log(world)
                    break;
            }
        }
        // the buttons do be on top of eachother
        let dragging = false;
        let prevCameraPos = {x: 0, y: 0};
        let prevMousePos = {x: 0, y: 0};
        const button_h_def = 75
        const button_w = 200
        const button_margin = 10
        p5.mousePressed = () => {

            if (mouseInside(p5.width - button_margin - button_w, p5.width - button_margin, p5.height - button_margin - button_h_def, p5.height - button_margin)) {
                activateListeners(true, false)
                return
            }

            if (mouseInside(button_margin, button_margin + button_w, p5.height - button_margin - button_h_def, p5.height - button_margin)) {
                activateListeners(true, true)
                return
            }

            if (mouseInside()) {
                dragging = true;
                [prevCameraPos.x, prevCameraPos.y] = [cameraPos.x, cameraPos.y];
                prevMousePos.x = p5.mouseX;
                prevMousePos.y = p5.mouseY;
            }
        }
        p5.mouseReleased = () => {
            dragging = false;
            if (pressingInput1) {
                activateListeners(false, false)
            }
            if (pressingInput2) {
                activateListeners(false, true)
            }
        }

        p5.touchStarted = () => {
            p5.mousePressed()
            if (!(p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height)) return false
        }

        p5.touchEnded = () => {
            p5.mouseReleased()
            if (!(p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height)) return false
        }

        p5.mouseWheel = (event) => {
            if (!(p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height)) {
                zoomExp += event.delta > 0 ? -1 : 1;
                zoom = 2 ** (zoomExp/10)
            }
        }

        

        p5.draw = () => {
            world.spawned_this_frame = new Set()
            
            //console.log(p5div)

            cnv.position(
                p5div.offsetLeft,
                p5div.offsetTop,
            )
            p5.resizeCanvas(
                p5div.offsetWidth,
                p5div.offsetHeight,
            )
            

            // stop dragging when mouse leaves the canvas
            if (!mouseInside()) dragging = false;
            //else if (p5.mouseIsPressed) dragging = true;
            
            cameraPos.x += cameraMove.x
            cameraPos.y += cameraMove.y
            if (dragging) {
                cameraPos.x = prevCameraPos.x - (p5.mouseX - prevMousePos.x)/zoom;
                cameraPos.y = prevCameraPos.y + (p5.mouseY - prevMousePos.y)/zoom;
            }

            
            p5.push()
            p5.background(
                world.getColor(1000).r,
                world.getColor(1000).g,
                world.getColor(1000).b,
            )

            p5.translate(p5.width/2, p5.height/2)
            
            p5.translate(-cameraPos.x*zoom, cameraPos.y*zoom)
            p5.scale(zoom)

            p5.stroke(0)
            p5.strokeWeight(1/zoom)
            p5.line(0,0,100*30,0)
            p5.line(0,0,0,-100*30)

            p5.textSize(15)
            p5.noStroke()
            p5.fill(0)
            p5.text(world.objects.length + " objects", 20, 50)

            let screenWorldBounds = {
                left: cameraPos.x - p5.width/2/zoom,
                right: cameraPos.x + p5.width/2/zoom,
                up: cameraPos.y + p5.height/2/zoom,
                down: cameraPos.y - p5.height/2/zoom,
            }

            world.objects.forEach(obj => {

                if (
                    obj.pos.x > screenWorldBounds.left - 30 &&
                    obj.pos.x < screenWorldBounds.right + 30 &&
                    obj.pos.y < screenWorldBounds.up + 30 &&
                    obj.pos.y > screenWorldBounds.down - 30
                ) {
                    obj.drawFull(p5, world)
                }
            })

            const date = new Date()
            let time = date.getTime()
            world.time = time;
            
            // if (true) {
            //     world.objects.forEach(obj => {
            //         // draw connections for spawn triggers etc
            //         if (obj instanceof SpawnTrigger || obj instanceof InstantCountTrigger) {
            //             let target = obj.kind.target
            //             let group = world.groupIDs[target]
            //             if (group)
            //                 group.objects.forEach(targetObjIdx => {
            //                     const targetObj = world.objects[targetObjIdx]
            //                     p5.stroke(255, 0, 0, group.on ? 100 : 50)
            //                     p5.noFill()
            //                     p5.strokeWeight(3)
            //                     arrow(p5, obj.pos.x, -obj.pos.y, targetObj.pos.x, -targetObj.pos.y)
            //                 })
            //         }

            //         if (obj instanceof SpawnTrigger) {
            //             if (time - obj.kind.last_spawn < obj.delay * 1000) {
            //                 const progress = (time - obj.kind.last_spawn) / (obj.delay * 1000)
            //                 let target = obj.kind.target
            //                 let group = world.groupIDs[target]
            //                 group.objects.forEach(targetObjIdx => {
            //                     const targetObj = world.objects[targetObjIdx]
            //                     p5.stroke(0, 255, 255, 200)
            //                     p5.strokeWeight(3)
            //                     p5.noFill()
            //                     arrow(
            //                         p5, 
            //                         obj.pos.x, 
            //                         -obj.pos.y, 
            //                         obj.pos.x + (targetObj.pos.x - obj.pos.x) * progress, 
            //                         -obj.pos.y + (-targetObj.pos.y - -obj.pos.y) * progress,
            //                     )
            //                 })
            //             }
            //         }
            //     })
            // }

            p5.pop()

            p5.noFill()
            p5.strokeWeight(12)
            p5.stroke(59, 59, 59)
            p5.rect(-4, -4, p5.width+8, p5.height+8, 18)
            p5.stroke(20, 20, 26)
            p5.rect(-6, -6, p5.width+12, p5.height+12, 18)
            p5.stroke(17, 17, 22)
            p5.rect(-38, -38, p5.width+44, p5.height+44, 18)
            
            if (world.touchListeners.length > 0) {
                const button_h = button_h_def - (pressingInput1 ? 10 : 0)
                p5.stroke(0)
                p5.strokeWeight(3)
                p5.fill(0, pressingInput1 ? 220 : 150)
                p5.rect(p5.width - button_margin - button_w, p5.height - button_margin - button_h, button_w, button_h, 6)

                p5.noStroke()
                p5.fill(255)
                const text = "Touch"
                p5.textSize(20)
                p5.textAlign(p5.CENTER, p5.CENTER)
                p5.text(text, p5.width - button_margin - button_w / 2, p5.height - button_margin - button_h / 2)
            }

            if (world.touchListeners.some(listener => listener.dualMode)) {
                const button_h = button_h_def - (pressingInput2 ? 10 : 0)
                p5.stroke(0)
                p5.strokeWeight(3)
                p5.fill(0, pressingInput2 ? 220 : 150)
                p5.rect(button_margin, p5.height - button_margin - button_h, button_w, button_h, 6)

                p5.noStroke()
                p5.fill(255)
                const text = "Touch Dual"
                p5.textSize(20)
                p5.textAlign(p5.CENTER, p5.CENTER)
                p5.text(text, button_margin + button_w / 2, p5.height - button_margin - button_h / 2)
            }

            
            // p5.fill(255)
            // p5.textSize(20)
            // p5.text(cameraPos.x + " " + cameraPos.y, 30, 30)
            // p5.text(screenWorldBounds.left + " " + screenWorldBounds.up + " " + screenWorldBounds.right + " " + screenWorldBounds.down, 30, 60)



            let to_remove = Array(world.scheduled_spawns.length).fill(false)
            world.scheduled_spawns.forEach((spawn, i) => {
                // console.log("c:", time)
                if (spawn.time <= time) {
                    // console.log("a:", spawn.group)
                    world.spawnGroupID(spawn.group)
                    to_remove[i] = true
                }
            })
            world.scheduled_spawns = world.scheduled_spawns.filter((_, i) => !to_remove[i])
            
            // silly spunix the ids will change!!! !
            // to_remove.forEach(i => world.scheduled_spawns.splice(i, 1))


            world.followCommands.forEach(cmd => {
                cmd.lastVec.x = world.objects[world.groupIDs[cmd.followID].objects[0]].pos.x
                cmd.lastVec.y = world.objects[world.groupIDs[cmd.followID].objects[0]].pos.y
            })

            
            
            let displacements = {}
            to_remove = []
            world.moveCommands.forEach((cmd, i) => {
                if (!(cmd.groupID in displacements)) {
                    displacements[cmd.groupID] = {x: 0, y: 0}
                }
                let displacement = cmd.getDisplacement(time)
                displacements[cmd.groupID].x += displacement.x;
                displacements[cmd.groupID].y += displacement.y;
                if (time >= cmd.startTime + cmd.duration * 1000) {
                    to_remove.push(i)
                }
            })
            world.moveCommands = world.moveCommands.filter((_, i) => !to_remove.includes(i))
            
            for (const i in displacements) {
                for (const objIdx of world.groupIDs[i].objects) {
                    world.objects[objIdx].pos.x += displacements[i].x
                    world.objects[objIdx].pos.y += displacements[i].y
                }
            }

            let angleIncrements = {}
            to_remove = []
            world.rotateCommands.forEach((cmd, i) => {
                let {x: centerX, y: centerY} = world.objects[world.groupIDs[cmd.centerID].objects[0]].pos
                if (!(cmd.groupID in angleIncrements)) {
                    angleIncrements[cmd.groupID] = []
                }

                let increment = cmd.getAngleIncrement(time)
                angleIncrements[cmd.groupID].push( {increment, centerX, centerY, lock: cmd.lockRotation} )
                if (time >= cmd.startTime + cmd.duration * 1000) {
                    to_remove.push(i)
                }
            })
            world.rotateCommands = world.rotateCommands.filter((_, i) => !to_remove.includes(i))
            
            for (const i in angleIncrements) {
                for (const entry of angleIncrements[i]) {
                    for (const objIdx of world.groupIDs[i].objects) {
                        let cos = Math.cos(-entry.increment * Math.PI / 180);
                        let sin = Math.sin(-entry.increment * Math.PI / 180);
                        let [vecX, vecY] = [
                            world.objects[objIdx].pos.x - entry.centerX,
                            world.objects[objIdx].pos.y - entry.centerY,
                        ];
                        [vecX, vecY] = [cos*vecX - sin*vecY, sin*vecX + cos*vecY]

                        world.objects[objIdx].pos.x = entry.centerX + vecX
                        world.objects[objIdx].pos.y = entry.centerY + vecY

                        if (!entry.lock) {
                            world.objects[objIdx].rotation -= entry.increment
                        }
                    }
                }
            }
            
            
            to_remove = []
            for (const i in world.alphaCommands) {
                world.groupIDs[i].opacity = world.alphaCommands[i].getOpacity(time)
                if (time >= world.alphaCommands[i].startTime + world.alphaCommands[i].duration * 1000) {
                    to_remove.push(i)
                }
            }
            to_remove.forEach((i) => delete world.alphaCommands[i])


            for (const blockA in world.collisionListeners) {
                world.collisionListeners[blockA].forEach(listener => {
                    listener.collidingAmount = 0
                    world.blockIDs[blockA].objects.forEach(b1 => {
                        if (world.objects[b1].disables > 0) { return }
                        const s1 = 15 * world.objects[b1].scale.x
                        const a1 = world.objects[b1].rotation * Math.PI / 180
                        let p1 = new Col.Polygon(world.objects[b1].pos,[
                            {x: s1, y: s1},
                            {x: -s1, y: s1},
                            {x: -s1, y: -s1},
                            {x: s1, y: -s1},
                        ])
                        p1.setAngle(a1)
                        //console.log(p1.angle, world.objects[b1].rotation)
                        world.blockIDs[listener.blockB].objects.forEach(b2 => {
                            if (world.objects[b2].disables > 0) { return }
                            if (!(<CollisionObject>world.objects[b1]).dynamic && !(<CollisionObject>world.objects[b2]).dynamic) { return }
                            if ((world.objects[b2].pos.x - world.objects[b1].pos.x) ** 2 + (world.objects[b2].pos.y - world.objects[b1].pos.y) ** 2 > (60*world.objects[b1].scale.x + 60*world.objects[b2].scale.x) ** 2) {
                                return
                            }
                            const s2 = 15 * world.objects[b2].scale.x
                            const a2 = world.objects[b2].rotation * Math.PI / 180
                            let p2 = new Col.Polygon(world.objects[b2].pos,[
                                {x: s2, y: s2},
                                {x: -s2, y: s2},
                                {x: -s2, y: -s2},
                                {x: s2, y: -s2},
                            ])
                            // are you gonna make a divider between the editor and the sim awesome
                            p2.setAngle(a2)
                            if (system.checkCollision(p1, p2)) {
                                listener.collidingAmount += 1
                            }
                        })
                    })
                    if (!listener.onExit) {
                        if (listener.collidingAmount > 0 && listener.prevAmount == 0) {
                            if (listener.activateGroup) { world.spawnGroupID(listener.groupID); (<CollisionTrigger>(world.objects[listener.trigger_obj])).kind.last_spawn = (new Date).getTime() }
                            world.toggleGroupID(listener.groupID, listener.activateGroup) 
                        }
                    } else {
                        if (listener.collidingAmount == 0 && listener.prevAmount > 0) {
                            if (listener.activateGroup) { world.spawnGroupID(listener.groupID); (<CollisionTrigger>(world.objects[listener.trigger_obj])).kind.last_spawn = (new Date).getTime() }
                            world.toggleGroupID(listener.groupID, listener.activateGroup) 
                        }
                    }
                    listener.prevAmount = listener.collidingAmount
                })
            }

            for (const id in world.colorIDs) {
                if (world.colorIDs[id] instanceof Fading && !(<Fading> world.colorIDs[id]).stopped) {
                    (<Fading> world.colorIDs[id]).currentTime = time
                    if (time >= (<Fading> world.colorIDs[id]).startTime + (<Fading> world.colorIDs[id]).duration * 1000) {
                        world.colorIDs[id] = new Stable(
                            (<Fading> world.colorIDs[id]).to
                        )
                    }
                }
            }
            //console.log(world.colorIDs)

            // to_remove = []
            // for (const id in world.colorFades) {
            //     let fade = world.colorFades[id].getColor(time)
            //     world.colorIDs[id].r = fade.r
            //     world.colorIDs[id].g = fade.g
            //     world.colorIDs[id].b = fade.b
            //     world.colorIDs[id].opacity = fade.opacity
            //     if (time >= world.colorFades[id].startTime + world.colorFades[id].duration * 1000) {
            //         to_remove.push(id)
            //     }
            // }
            // to_remove.forEach((i) => delete world.colorFades[i])



            to_remove = []
            world.followCommands.forEach((cmd, i) => {
                if (!(cmd.groupID in displacements)) {
                    displacements[cmd.groupID] = {x: 0, y: 0}
                }
                let newX = world.objects[world.groupIDs[cmd.followID].objects[0]].pos.x
                let newY = world.objects[world.groupIDs[cmd.followID].objects[0]].pos.y
                let displacement = cmd.getDisplacement( {x: newX, y: newY} )
                for (const objIdx of world.groupIDs[cmd.groupID].objects) {
                    world.objects[objIdx].pos.x += displacement.x
                    world.objects[objIdx].pos.y += displacement.y
                }
                if (time >= cmd.startTime + cmd.duration * 1000) {
                    to_remove.push(i)
                }
            })
            world.followCommands = world.followCommands.filter((_, i) => !to_remove.includes(i))

            
            for (const i in world.pulseCommands.channel) {
                to_remove = []
                world.pulseCommands.channel[i].forEach((cmd, i) => {
                    if (time >= cmd.startTime + (cmd.fadeIn + cmd.hold + cmd.fadeOut) * 1000) {
                        to_remove.push(i)
                    }
                })
                world.pulseCommands.channel[i] = world.pulseCommands.channel[i].filter((_, i) => !to_remove.includes(i))
            }
            for (const i in world.pulseCommands.group) {
                to_remove = []
                world.pulseCommands.group[i].forEach((cmd, i) => {
                    if (time >= cmd.startTime + (cmd.fadeIn + cmd.hold + cmd.fadeOut) * 1000) {
                        to_remove.push(i)
                    }
                })
                world.pulseCommands.group[i] = world.pulseCommands.group[i].filter((_, i) => !to_remove.includes(i))
            }
            
            // console.log(world.pulseCommands.channel)

            
        };



    }

    return [sketch]


}


// function arrow(p5, x1, y1, x2, y2) {
//     const offset = 5;
//     p5.line(x1, y1, x2, y2); //draw a line beetween the vertices

//     // this code is to make the arrow point
//     p5.push() //start new drawing state
//     var angle = p5.atan2(y1 - y2, x1 - x2) - Math.PI / 2; //gets the angle of the line
//     p5.translate(x2, y2); //translates to the destination vertex
//     p5.rotate(angle); //rotates the arrow point
//     p5.triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
//     p5.pop();
// }

export {
    worldSketch,
    spritesheets,
}




