
import P5 from 'p5-svelte';
import type World from '../world/world';
import type GDObject from '../objects/object'
import { InstantCountTrigger, SpawnTrigger } from '../objects/triggers';


interface Vector {
    x: number,
    y: number,
}

const CAMERA_SPEED = 10;

const drawObject = (p5: any, obj: Object) => {

}


const worldSketch = (
    world: World,
) => (p5: any) => {



    let zoom = 2;
    let cameraPos = {x: 0, y: 0};
    let cameraMove = {x: 0, y: 0};

    let p5div, cnv;

    p5.preload = () => {
        const PUSAB_FONT = p5.loadFont('assets/fonts/pusab.otf');
    }

    p5.setup = () => {
        cnv = p5.createCanvas(400, 400);
        p5.frameRate(240)
        p5div = document.getElementById("sketch")
    };

    p5.keyPressed = () => {
        if (!(p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height))
            switch (p5.keyCode) {
                case 37:
                    cameraMove.x -= CAMERA_SPEED;
                    break;
                
                case 38:
                    cameraMove.y += CAMERA_SPEED;
                    break;
                    
                case 39:
                    cameraMove.x += CAMERA_SPEED;
                    break;
                
                case 40:
                    cameraMove.y -= CAMERA_SPEED;
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
        

        // stop dragging when mouse leaves the canvas
        if (p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height) dragging = false;
        //else if (p5.mouseIsPressed) dragging = true;
        
        cameraPos.x += cameraMove.x
        cameraPos.y += cameraMove.y
        if (dragging) {
            cameraPos.x = prevCameraPos.x - (p5.mouseX - prevMousePos.x)/zoom;
            cameraPos.y = prevCameraPos.y + (p5.mouseY - prevMousePos.y)/zoom;
        }

        
        p5.push()
        p5.background(50, 60, 70)

        p5.translate(p5.width/2, p5.height/2)
        
        p5.translate(-cameraPos.x*zoom, cameraPos.y*zoom)
        p5.scale(zoom)

        p5.stroke(0)
        p5.strokeWeight(1)
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
        
        if (true) {
            world.objects.forEach(obj => {
                // draw connections for spawn triggers etc
                if (obj instanceof SpawnTrigger || obj instanceof InstantCountTrigger) {
                    let target = obj.target
                    let group = world.groupIDs[target]
                    if (group)
                        group.objects.forEach(targetObjIdx => {
                            const targetObj = world.objects[targetObjIdx]
                            p5.stroke(255, 0, 0, group.on ? 100 : 50)
                            p5.noFill()
                            p5.strokeWeight(3)
                            arrow(p5, obj.pos.x, -obj.pos.y, targetObj.pos.x, -targetObj.pos.y)
                        })
                }

                if (obj instanceof SpawnTrigger) {
                    if (time - obj.last_spawn < obj.delay * 1000) {
                        const progress = (time - obj.last_spawn) / (obj.delay * 1000)
                        let target = obj.target
                        let group = world.groupIDs[target]
                        group.objects.forEach(targetObjIdx => {
                            const targetObj = world.objects[targetObjIdx]
                            p5.stroke(0, 255, 255, 200)
                            p5.strokeWeight(3)
                            p5.noFill()
                            arrow(
                                p5, 
                                obj.pos.x, 
                                -obj.pos.y, 
                                obj.pos.x + (targetObj.pos.x - obj.pos.x) * progress, 
                                -obj.pos.y + (-targetObj.pos.y - -obj.pos.y) * progress,
                            )
                        })
                    }
                }
            })
        }

        p5.pop()

        p5.noFill()
        p5.stroke(20, 20, 26)
        p5.strokeWeight(12)
        p5.rect(-6, -6, p5.width+12, p5.height+12, 18)
        p5.stroke(17, 17, 22)
        p5.rect(-38, -38, p5.width+44, p5.height+44, 18)

        
        // p5.fill(255)
        // p5.textSize(20)
        // p5.text(cameraPos.x + " " + cameraPos.y, 30, 30)
        // p5.text(screenWorldBounds.left + " " + screenWorldBounds.up + " " + screenWorldBounds.right + " " + screenWorldBounds.down, 30, 60)


        let to_remove = []
        world.scheduled_spawns.forEach((spawn, i) => {
            if (spawn.time <= time) {
                world.spawnGroupID(spawn.group)
                to_remove.push(i)
            }
        })
        to_remove.forEach(i => world.scheduled_spawns.splice(i, 1))


    };



};

function arrow(p5, x1, y1, x2, y2) {
    const offset = 5;
    p5.line(x1, y1, x2, y2); //draw a line beetween the vertices

    // this code is to make the arrow point
    p5.push() //start new drawing state
    var angle = p5.atan2(y1 - y2, x1 - x2) - Math.PI / 2; //gets the angle of the line
    p5.translate(x2, y2); //translates to the destination vertex
    p5.rotate(angle); //rotates the arrow point
    p5.triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    p5.pop();
}

export default worldSketch




