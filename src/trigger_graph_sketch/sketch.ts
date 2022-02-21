
import P5 from 'p5-svelte';
import { FunctionTrigger, SpawnTrigger, Trigger } from '../objects/triggers';
import type World from '../world/world';
import {QuadTree, Box, Point, Circle} from 'js-quadtree';
import Body, { GROUP_OBJ_SPACING } from './graph';

export type BodyIdx = number;
export type BodyChildIdx = number;

export type Graph = Record<BodyIdx, Record<BodyChildIdx, Set<BodyIdx>>>;
export type ReverseGraph = Record<BodyIdx, Set<[BodyIdx, BodyChildIdx]>>;

interface Vector {
    x: number,
    y: number,
}

const CAMERA_SPEED = 10;

const triggerGraphSketch = (
    world: World
) => {

    let zoom = 1;
    let cameraPos = {x: 0, y: 0};
    let cameraMove = {x: 0, y: 0};
    let cameraZoom = 1;
    let bodies: Body[] = [];
    let graph: Graph = {}
    let reverse_graph: ReverseGraph = {}

    function add_to_graph(a, a_child, b) {
        if (!graph[a]) {
            graph[a] = []
        }
        if (!graph[a][a_child]) {
            graph[a][a_child] = new Set()
        }
        graph[a][a_child].add(b)
        
        if (!reverse_graph[b]) {
            reverse_graph[b] = new Set()
        }
        reverse_graph[b].add([a, a_child])
    }
    
    const updateBodies = (new_world: World) => {
        cameraPos = {x: 0, y: 0};
        cameraMove = {x: 0, y: 0};

        world = new_world
        bodies = []
        graph = {}
        reverse_graph = {}
        const l = world.objects.length
        console.log(l)
    
        let obj_to_body_idx: Record<number, BodyIdx> = {}

        let start_obj_y = 0
        let obj_x = 30

        let group_bodies: Record<number, number[]> = {}
        let spawn_groups = new Set<number>()

        // get spawn groups
        world.objects.forEach((obj, idx) => {
            if (obj instanceof Trigger) {
                if (obj instanceof FunctionTrigger) {
                    const targets = world.groupIDs[obj.target];
                    if (targets) {
                        spawn_groups.add(obj.target)
                    }
                }
            }
        })
        // get pinned triggers + spawn groups
        world.objects.forEach((obj, idx) => {
            if (obj instanceof Trigger) {
                if (!obj.spawnTriggered) {
                    const body_idx = bodies.length
                    obj_to_body_idx[idx] = body_idx
                    bodies.push(new Body({x: -100, y: start_obj_y}, [idx], body_idx, true))
                    start_obj_y += 50
                } else {

                    const groups = obj.groups.filter(group => spawn_groups.has(group))
                    if (groups.length != 1) {
                        const body_idx = bodies.length
                        obj_to_body_idx[idx] = body_idx
                        bodies.push(new Body({x: obj_x, y: Math.random() * 100 - 50}, [idx], body_idx))
                        obj_x += 50
                    } else {
                        const g = groups[0]
                        // obj_to_group_body[idx] = g
                        if (!group_bodies[g]) {
                            group_bodies[g] = [idx]
                        } else {
                            group_bodies[g].push(idx)
                        }
                    }
                }
            }
        })

        // add group bodies
        Object.entries(group_bodies).forEach(([g, idxs]) => {
            const body_idx = bodies.length
            idxs.forEach(idx => {
                obj_to_body_idx[idx] = body_idx
            })
            bodies.push(new Body({x: obj_x, y: Math.random() * 100 - 50}, idxs, body_idx))
            obj_x += 50
        })

        // build graph
        bodies.forEach((body, idx) => {
            body.objs.forEach((obj, child_idx) => {
                const object = world.objects[obj]
                if (object instanceof FunctionTrigger) {
                    const targets = world.groupIDs[object.target];
                    if (targets) {
                        targets.objects.forEach(target => {
                            const target_body_idx = obj_to_body_idx[target]
                            add_to_graph(idx, child_idx, target_body_idx)

                        });
                    }
                }
            })
        })

        console.log(graph, reverse_graph)
        
        for (let i = 0; i < 3000; i++) {
            affectBodies(bodies, graph, reverse_graph)
        }
    }

    const qtree_config = {
        capacity: 4,            // Specify the maximum amount of point per node (default: 4)
        //removeEmptyNodes: true,  // Specify if the quadtree has to remove subnodes if they are empty (default: false).
        maximumDepth: 12,         // Specify the maximum depth of the quadtree. -1 for no limit (default: -1).
        // Specify a custom method to compare point for removal (default: (point1, point2) => point1.x === point2.x && point1.y === point2.y).
        //arePointsEqual: (point1, point2) => point1.data.foo === point2.data.foo      
    };

    const affectBodies = (bodies: Body[], graph: Graph, reverse_graph: ReverseGraph) => {
        let qtree = new QuadTree(new Box(-5000, -5000, 10000, 10000), qtree_config);
        bodies.forEach((body, i) => {
            qtree.insert(new Point(body.pos.x, body.pos.y, i));
        })
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].affect(bodies, qtree, graph, reverse_graph)
        }
    }

    const sketch = (p5: any) => {

        zoom = 1;
        cameraPos = {x: 0, y: 0};
        cameraMove = {x: 0, y: 0};
        cameraZoom = 1;
    
        let p5div, cnv;
    
        p5.preload = () => {
            const PUSAB_FONT = p5.loadFont('assets/fonts/pusab.otf');
        }
    
        
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
        p5.mouseWheel = (event) => {
            if (!(p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height))
                cameraZoom -= event.delta * 0.001;
            cameraZoom = Math.max(Math.min(cameraZoom, 10), 0.1);
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
            p5.scale(cameraZoom)
            p5.translate(cameraPos.x, -cameraPos.y)
            p5.scale(2)

            for (let i = 0; i < bodies.length; i++) {
                bodies[i].calc_input_side(bodies, reverse_graph)
                bodies[i].calc_output_side(bodies, graph)
            }
            
            affectBodies(bodies, graph, reverse_graph)

            const d = new Date()
            const time = d.getTime()

            bodies.forEach(body => {
                // if spawn triggered
                if (!body.pinned) {
                    p5.push()
                    p5.translate(body.connection_point().x, body.connection_point().y)
                    p5.fill(255)
                    p5.noStroke()
                    p5.rect(-3, -3, 6, 6)
                    p5.pop()
                }

                body.objs.forEach((obj, idx) => {
                    if (world.objects[obj] instanceof FunctionTrigger) {
                        p5.push()
                        const output_point = body.output_point(idx)
                        p5.translate(output_point.x, output_point.y)
                        p5.fill(255)
                        p5.noStroke()
                        p5.ellipse(-0, -0, 6, 6)
                        p5.pop()
                    }
                })

                p5.push()
                p5.translate(body.pos.x, body.pos.y)
                p5.push()
                
                p5.strokeWeight(2)
                p5.stroke(50, 50, 50)
                p5.fill(30, 30, 30)
                p5.rect(-13, -13, 26, 26 + GROUP_OBJ_SPACING * (body.objs.length - 1), 3, 3, 3, 3)
                body.objs.forEach(obj => {
                    p5.push()
                    p5.scale(0.7)
                    world.objects[obj].draw(p5, world)
                    p5.pop()
                    p5.translate(0, GROUP_OBJ_SPACING)
                })
                
                p5.pop()
                if (body.pinned) {
                    p5.strokeWeight(1)
                    p5.stroke(255, 0, 0, 150)
                    p5.noFill()
                    p5.rect(-13, -13, 26, 26 + GROUP_OBJ_SPACING * (body.objs.length - 1), 3, 3, 3, 3)
                }
                p5.pop()
            })

            for (let body_idx = 0; body_idx < bodies.length; body_idx++) {
                for (let child_idx = 0; child_idx < bodies[body_idx].objs.length; child_idx++) {
                    if (graph[body_idx] && graph[body_idx][child_idx]) {
                        graph[body_idx][child_idx].forEach(other_body => {
                            const body = bodies[body_idx]
                            const body2 = bodies[other_body]
                            
                            p5.strokeWeight(1)
                            
                            const obj = world.objects[body.objs[child_idx]]
                            const flashlen = 700;
                            let time_since_last_spawn = obj instanceof FunctionTrigger ? 
                                (obj instanceof SpawnTrigger ? 
                                    time - (obj.last_spawn + obj.delay * 1000)
                                    : (time - obj.last_spawn))
                                : Infinity;
                            if (time_since_last_spawn < 0) time_since_last_spawn = Infinity;

                            if (time_since_last_spawn < flashlen) {
                                const progress = time_since_last_spawn / flashlen;
                                p5.fill(255 * progress, 255, 255 * progress)
                                p5.stroke(255 * progress, 255, 255 * progress)
                            } else {
                                p5.fill(255)
                                p5.stroke(255)
                            }
                            const output_point = body.output_point(child_idx)
                            const input_point = body2.connection_point()
                            arrow(p5, output_point.x, output_point.y, input_point.x, input_point.y)
            
                            if (obj instanceof SpawnTrigger) {
                                if (time - obj.last_spawn < obj.delay * 1000) {
                                    const progress = (time - obj.last_spawn) / (obj.delay * 1000)
                                    
                                    p5.stroke(0, 255, 255, 200)
                                    p5.strokeWeight(3)
                                    p5.fill(0, 255, 255, 200)
                                    arrow(
                                        p5, 
                                        output_point.x, 
                                        output_point.y, 
                                        input_point.x, 
                                        input_point.y,
                                        progress,
                                    )       
                                }
                            }
                        })
                    }
                }
            }
    
            p5.pop()
        };
    }

    return [sketch, updateBodies]


}





function arrow(p5, x1, y1, x2, y2, progress = 1) {
    const offset = 5;
    let angle = p5.atan2(y1 - y2, x1 - x2); //gets the angle of the line
    x1 -= Math.cos(angle) * offset * 1.5; 
    y1 -= Math.sin(angle) * offset * 1.5;
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
