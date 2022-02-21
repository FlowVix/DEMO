
import P5 from 'p5-svelte';
import { SpawnTrigger, Trigger } from '../objects/triggers';
import type World from '../world/world';

import Body from './graph';

interface Vector {
    x: number,
    y: number,
}

const CAMERA_SPEED = 10;

const triggerGraphSketch = (
    world: World
) => {
    let bodies = [];
    let connections = []
    let graph = []
    
    const updateBodies = (new_world: World) => {
        world = new_world
        bodies = []
        connections = []
        graph = []
        const l = world.objects.length
        console.log(l)
        for (let i = 0; i < l; i++) {
            graph.push(Array(l).fill(false))
        }
    
        let obj_to_body_idx: Record<number, number> = {}

        let start_obj_y = 0
    
        // build graph from triggers
        world.objects.forEach((obj, idx) => {
            if (obj instanceof Trigger) {
                const body_idx = bodies.length
                obj_to_body_idx[idx] = body_idx
                if (obj.spawnTriggered) {
                    bodies.push(new Body({x: Math.random() * 100 - 50, y: Math.random() * 100 - 50}, idx))
                } else {
                    bodies.push(new Body({x: -100, y: start_obj_y}, idx, true))
                    start_obj_y += 50
                }
                if (obj.hasOwnProperty("target")) {
                    const targets = world.groupIDs[obj["target"]];
                    if (targets)
                        targets.objects.forEach(target => {
                            if (world.objects[target] instanceof Trigger) {
                                graph[idx][target] = true;
                                graph[target][idx] = true;
                                connections.push({
                                    source: body_idx,
                                    target: target, // change to body index below
                                })
                            }
                        });
                }
            }
        })
    
        for (let i = 0; i < connections.length; i++) {
            connections[i].target = obj_to_body_idx[connections[i].target]
        }
        if (bodies.length < 100) {
            for (let i = 0; i < 1000; i++) {
                for (let i = 0; i < bodies.length; i++) {
                    bodies[i].affect(bodies, graph)
                }
            }
        }
    }

    const sketch = (p5: any) => {

        let zoom = 1;
        let cameraPos = {x: 0, y: 0};
        let cameraMove = {x: 0, y: 0};
    
        let p5div, cnv;
    
        p5.preload = () => {
            const PUSAB_FONT = p5.loadFont('assets/fonts/pusab.otf');
        }
    
        
        //
        // but it clearly does update, just not after we have added the objects
        // i mean isnt the world empty to begin with
        // yea but try to build
        // i think we just need to call this again when it builds, cause nothing updates it
        // these should be the triggers from the world but it console logs an empty array
    
        p5.setup = () => {
            cnv = p5.createCanvas(400, 400);
            p5.frameRate(240)
            p5div = document.getElementById("trigger-graph-sketch")
            console.log(p5div)
    
        };
    
        p5.keyPressed = () => {
            if (!(p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height))
                switch (p5.keyCode) {
                    case 37:
                        cameraMove.x += CAMERA_SPEED;
                        break;
                    
                    case 38:
                        cameraMove.y -= CAMERA_SPEED;
                        break;
                        
                    case 39:
                        cameraMove.x -= CAMERA_SPEED;
                        break;
                    
                    case 40:
                        cameraMove.y += CAMERA_SPEED;
                        break;
                }
        }
        p5.keyReleased = () => {
            switch (p5.keyCode) {
                case 37:
                    cameraMove.x = 0;
                    break;
                
                case 38:
                    cameraMove.y = 0;
                    break;
                    
                case 39:
                    cameraMove.x = 0;
                    break;
                
                case 40:
                    cameraMove.y = 0;
                    break;
            }
        }
    
        let dragging = false;
        let prevCameraPos = {x: 0, y: 0};
        let prevMousePos = {x: 0, y: 0};
    
        p5.mousePressed = () => {
            dragging = true;
            [prevCameraPos.x, prevCameraPos.y] = [cameraPos.x, cameraPos.y];
            prevMousePos.x = p5.mouseX;
            prevMousePos.y = p5.mouseY;
        }
        p5.mouseReleased = () => {
            dragging = false;
        }
    
        p5.draw = () => {
    
            cnv.position(
                p5div.offsetLeft,
                p5div.offsetTop,
            )
            p5.resizeCanvas(
                p5div.offsetWidth,
                p5div.offsetHeight,
            )
    
            let camera_offset = {x: 0, y: 0};
    
            bodies.forEach(body => {
                camera_offset.x += body.pos.x
                camera_offset.y += body.pos.y
            })
            camera_offset.x /= bodies.length
            camera_offset.y /= bodies.length
    
            // stop dragging when mouse leaves the canvas
            if (p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height) dragging = false;
            //else if (p5.mouseIsPressed) dragging = true;
            
            cameraPos.x += cameraMove.x
            cameraPos.y += cameraMove.y
            if (dragging) {
                cameraPos.x = prevCameraPos.x + (p5.mouseX - prevMousePos.x);
                cameraPos.y = prevCameraPos.y - (p5.mouseY - prevMousePos.y);
            }
    
            
            p5.push()
            p5.background(10, 10, 15)
    
            p5.translate(p5.width/2, p5.height/2)
            
            p5.translate(cameraPos.x, -cameraPos.y)
            p5.scale(2)

            const d = new Date()
            const time = d.getTime()
    
            connections.forEach(({source, target}) => {
                p5.stroke(255, 255, 255, 100)
                const body = bodies[source]
                const body2 = bodies[target]

                p5.stroke(255, 255, 255, 255)
                p5.strokeWeight(1)
                p5.fill(255)

                arrow(p5, body.pos.x, body.pos.y, body2.pos.x, body2.pos.y)

                const obj = world.objects[body.obj]
                if (obj instanceof SpawnTrigger) {
                    if (time - obj.last_trigger < obj.delay * 1000) {
                        const progress = (time - obj.last_trigger) / (obj.delay * 1000)
                        
                        p5.stroke(0, 255, 255, 200)
                        p5.strokeWeight(3)
                        p5.fill(0, 255, 255, 200)
                        arrow(
                            p5, 
                            body.pos.x, 
                            body.pos.y, 
                            body2.pos.x, 
                            body2.pos.y,
                            progress,
                        )       
                    }
                }
            })
            
            if (bodies.length < 100) {
                for (let i = 0; i < bodies.length; i++) {
                    bodies[i].affect(bodies, graph)
                }
            }

            bodies.forEach(body => {
                p5.push()
                p5.translate(body.pos.x, body.pos.y)
                p5.scale(0.7)
                world.objects[body.obj].draw(p5, world)
                p5.pop()
            })
    
            p5.pop()
        };
        
    
    
    }

    return [sketch, updateBodies]


}





function arrow(p5, x1, y1, x2, y2, progress = 1) {
    const offset = 5;
    let angle = p5.atan2(y1 - y2, x1 - x2); //gets the angle of the line
    x1 -= Math.cos(angle) * offset * 2.5; 
    y1 -= Math.sin(angle) * offset * 2.5;
    x2 += Math.cos(angle) * offset * 2.5;
    y2 += Math.sin(angle) * offset * 2.5;
    angle -= Math.PI / 2

    p5.line(x1, y1, x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress); //draw a line beetween the vertices

    // this code is to make the arrow point
    p5.push() //start new drawing state
    p5.translate(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress); //translates to the destination vertex
    p5.rotate(angle); //rotates the arrow point
    p5.triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    p5.pop();
}


export default triggerGraphSketch
