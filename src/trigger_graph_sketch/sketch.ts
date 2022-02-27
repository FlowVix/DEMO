
import P5 from 'p5-svelte';
import { FunctionTrigger, SpawnTrigger, StopTrigger, ToggleTrigger, Trigger } from '../objects/triggers';
import type {World} from '../world/world';
import {QuadTree, Box, Point, Circle} from 'js-quadtree';
import Body, { COLLAPSE_LEN, GROUP_OBJ_SPACING } from './graph';
import Col from 'detect-collisions'

export type BodyIdx = number;
export type BodyChildIdx = number;

export type Graph = Record<BodyIdx, Record<BodyChildIdx, Set<BodyIdx>>>;
export type ReverseGraph = Record<BodyIdx, Set<[BodyIdx, BodyChildIdx]>>;

interface Vector {
    x: number,
    y: number,
}

const CAMERA_SPEED = 10;
export let PUSAB_FONT;

const MIN_TEMP = 3;
const START_TEMP = 40000;
const TEMP_DELTA = START_TEMP / 300;
const TEMP_FAC = 0.99
const TEMP_LINEAR_END = 300

export const qtree_limits = new Box(-5000, -5000, 10000, 10000)

const triggerGraphSketch = (
    world: World
) => {

    let zoom = 1;
    let cameraPos = {x: 0, y: 0};
    let cameraMove = {x: 0, y: 0};
    let cameraZoom = 1;
    let bodies: Body[] = [];
    let additional_bodies: Body[] = []
    const CONNECTION_CAP = Infinity
    let graph: Graph = {}
    let reverse_graph: ReverseGraph = {}
    let temperature = START_TEMP;

    function add_to_graph(a: BodyIdx, a_child: BodyChildIdx, b: BodyIdx, force = false, d = 0) {
        if (!reverse_graph[b]) {
            reverse_graph[b] = new Set()
        }
        if (!graph[a]) {
            graph[a] = [new Set()]
            let body = a >= bodies.length ? additional_bodies[a - bodies.length] : bodies[a]
            for (let i = 1; i < body.objs.length; i++) {
                graph[a][i] = new Set()
            }
        }
        
        if (graph[a][a_child].has(b)) return
        
        if (force || d > 100 || reverse_graph[b].size < CONNECTION_CAP) {
            graph[a][a_child].add(b)
            reverse_graph[b].add([a, a_child])
        } else {
            let new_idx;
            let body = b >= bodies.length ? additional_bodies[b - bodies.length] : bodies[b]
            if (body.extra_node == null) {
                new_idx = bodies.length + additional_bodies.length
                additional_bodies.push(new Body(
                    {
                        x: body.pos.x + Math.random() * 100 - 50, 
                        y: body.pos.y + Math.random() * 100 - 50,
                    }, 
                    [], 
                    new_idx
                ))
                add_to_graph(new_idx, 0, b, true)
                if (b >= bodies.length) additional_bodies[b - bodies.length].extra_node = new_idx
                else bodies[b].extra_node = new_idx
            } else {
                new_idx = body.extra_node
            }
            add_to_graph(a, a_child, new_idx, false, d + 1)
        }
    }

    let obj_to_body_idx: Record<number, [BodyIdx, BodyChildIdx]> = {}

    let bodies_per_group: Record<number, number[]> = {}
    
    const updateBodies = (new_world: World) => {
        temperature = START_TEMP
        cameraPos = {x: 0, y: 0};
        cameraMove = {x: 0, y: 0};

        world = new_world
        bodies = []
        graph = {}
        reverse_graph = {}
        const l = world.objects.length
    
        obj_to_body_idx = {}

        let start_obj_y = 0
        let obj_x = 30

        let group_bodies: Record<string, number[]> = {}
        bodies_per_group = {}
        let spawn_groups = new Set<number>()

        // get spawn groups
        world.objects.forEach((obj, idx) => {
            if (obj instanceof Trigger) {
                if (obj.kind instanceof FunctionTrigger) {
                    const targets = world.groupIDs[obj.kind.target];
                    if (targets) {
                        spawn_groups.add(obj.kind.target)
                    }
                }
            }
        })
        // get pinned triggers + spawn groups
        world.objects.forEach((obj, idx) => {
            if (obj instanceof Trigger) {
                if (!obj.spawnTriggered) {
                    const body_idx = bodies.length
                    obj_to_body_idx[idx] = [body_idx, 0]
                    bodies.push(new Body({x: -100, y: start_obj_y}, [idx], body_idx, true))
                    start_obj_y += 50
                } else {

                    const groups = obj.groups.filter(group => spawn_groups.has(group))
                    // if (groups.length != 1) {
                    //     const body_idx = bodies.length
                    //     obj_to_body_idx[idx] = [body_idx, 0]
                    //     bodies.push(new Body({x: obj_x, y: Math.random() * 100 - 50}, [idx], body_idx))
                    //     obj_x += 50
                    // } else {
                    groups.sort()
                    const g = groups.map(g => g.toString()).join(".")
                    // obj_to_group_body[idx] = g
                    if (!group_bodies[g]) {
                        group_bodies[g] = [idx]
                    } else {
                        group_bodies[g].push(idx)
                    }
                    
                    // }
                }
            }
        })

        // add group bodies
        Object.entries(group_bodies).forEach(([g, idxs]) => {
            const body_idx = bodies.length

            const groups = g.split(".").map(parseInt)
            groups.forEach(g => {
                if (!bodies_per_group[g]) {
                    bodies_per_group[g] = [body_idx]
                } else {
                    bodies_per_group[g].push(body_idx)
                }
            })

            idxs.forEach((idx, i) => {
                obj_to_body_idx[idx] = [body_idx, i]
            })
            bodies.push(new Body({x: obj_x, y: Math.random() * 100 - 50}, idxs, body_idx))
            obj_x += 10
        }) // this file is acting weird for me

        // bodies used to ensure that not too many bodies
        // are connected to a single other body
        additional_bodies = []
        // build graph
        bodies.forEach((body, idx) => {
            body.objs.forEach((obj, child_idx) => {
                const object = world.objects[obj]
                if (object instanceof Trigger && object.kind instanceof FunctionTrigger) {
                    const targets = world.groupIDs[object.kind.target];
                    if (targets) {
                        targets.objects.forEach(target => {
                            if (obj_to_body_idx[target]) {
                                const target_body_idx = obj_to_body_idx[target][0]
                                add_to_graph(idx, child_idx, target_body_idx)
                            }
                        });
                    }
                }
            })
        })
        //console.log(graph)

        bodies = bodies.concat(additional_bodies)
        
        for (let i = 0; i < 600; i++) {
            const qtree = create_qtree(bodies)
            affectBodies(bodies, graph, reverse_graph, {x: 0, y: 0}, qtree)
        }
    }

    const create_qtree = (bodies: Body[]): QuadTree => {
        let qtree = new QuadTree(qtree_limits, qtree_config);
        bodies.forEach((body, i) => {
            const points = body.objs.length == 0 ? 1 : body.child_num()
            for (let y = 0; y < points; y++) {
                qtree.insert(new Point(body.pos.x, body.pos.y + y * GROUP_OBJ_SPACING, i));
            }
        })
        return qtree
    }


    const qtree_config = {
        capacity: 4,            // Specify the maximum amount of point per node (default: 4)
        //removeEmptyNodes: true,  // Specify if the quadtree has to remove subnodes if they are empty (default: false).
        maximumDepth: 12,         // Specify the maximum depth of the quadtree. -1 for no limit (default: -1).
        // Specify a custom method to compare point for removal (default: (point1, point2) => point1.x === point2.x && point1.y === point2.y).
        //arePointsEqual: (point1, point2) => point1.data.foo === point2.data.foo      
    };
    
    // touch triggers? collision? color triggers?? pulse?
    const affectBodies = (bodies: Body[], graph: Graph, reverse_graph: ReverseGraph, tmouse, qtree: QuadTree) => {
        //console.log(temperature)
        let bodies_clone = []
        bodies.forEach(body => {
            bodies_clone.push(body.clone())
        })
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].affect(bodies_clone, qtree, graph, reverse_graph, tmouse, temperature)
        }
        if (temperature > MIN_TEMP) {
            if (temperature > TEMP_LINEAR_END) temperature -= TEMP_DELTA
            else temperature *= TEMP_FAC
            if (temperature < MIN_TEMP) temperature = MIN_TEMP
        }
    }

    zoom = 1;
    cameraPos = {x: 0, y: 0};
    cameraMove = {x: 0, y: 0};
    cameraZoom = 2;


    let dragging = false;
    let prevCameraPos = {x: 0, y: 0};
    let prevMousePos = {x: 0, y: 0};


    let tmouse = {x:0, y:0};
    let camera_offset = {x: 0, y: 0};

    const sketch = (p5: any) => {

        
    
        let p5div, cnv;

        let is_selecting = false;

        let system: Col.System;
    
        p5.preload = () => {
            PUSAB_FONT = p5.loadFont('assets/fonts/pusab.otf');
            system = new Col.System();
        }

        const get_translated_mouse = () => {
            return {
                x: ((p5.mouseX - p5.width/2) / cameraZoom - cameraPos.x), 
                y: ((p5.mouseY - p5.height/2) / cameraZoom + cameraPos.y)
            }
        }

        
        p5.setup = () => {
            cnv = p5.createCanvas(400, 400);
            p5.frameRate(240)
            p5div = document.getElementById("trigger-graph-sketch")
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
    
    
        p5.mousePressed = () => {
            if (p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height) return

            for (let i = 0; i < bodies.length; i++) {
                if (bodies[i].objs.length == 0) continue
                const y_offset = bodies[i].collapsible ? -8 : 0
                const height_offset = ((bodies[i].collapsible && bodies[i].collapsed) ? 34 : 26) - y_offset
                const height = GROUP_OBJ_SPACING * (bodies[i].child_num() - 1)
                const trigger_button_h = height + height_offset + y_offset
                
                if (bodies[i].contains(tmouse)) {
                    bodies[i].selected = true;
                    is_selecting = true;
                } else if (tmouse.y > bodies[i].pos.y + trigger_button_h - 5 && tmouse.y < bodies[i].pos.y + trigger_button_h + 5 && Math.abs(tmouse.x - bodies[i].pos.x) < 10) {
                    world.spawnObjects(bodies[i].objs)
                } else if (bodies[i].collapsible && tmouse.y < bodies[i].pos.y && tmouse.y > bodies[i].pos.y - 20 && Math.abs(tmouse.x - bodies[i].pos.x) < 4) {
                    bodies[i].collapsed = !bodies[i].collapsed;
                }
            }

            if (!is_selecting) {
                dragging = true;
                [prevCameraPos.x, prevCameraPos.y] = [cameraPos.x, cameraPos.y];
                prevMousePos.x = p5.mouseX / cameraZoom;
                prevMousePos.y = p5.mouseY / cameraZoom;
            }
        }
        p5.mouseReleased = () => {
            dragging = false;
            for (let i = 0; i < bodies.length; i++) {
                bodies[i].selected = false
            }
            is_selecting = false
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
                cameraPos.x = prevCameraPos.x + (p5.mouseX / cameraZoom - prevMousePos.x);
                cameraPos.y = prevCameraPos.y - (p5.mouseY / cameraZoom - prevMousePos.y);
            }
            tmouse = get_translated_mouse()
            
            p5.push()
            p5.background(10, 10, 15)
    
            p5.translate(p5.width/2, p5.height/2)
            p5.scale(cameraZoom)
            p5.translate(cameraPos.x, -cameraPos.y)

            // for (let i = 0; i < bodies.length; i++) {
            //     bodies[i].calc_input_side(bodies, reverse_graph)
            //     bodies[i].calc_output_side(bodies, graph)
            // }

            const qtree = create_qtree(bodies)
            affectBodies(bodies, graph, reverse_graph, tmouse, qtree)

            // let screenWorldBounds = {
            //     left: cameraPos.x - p5.width/2/cameraZoom,
            //     right: cameraPos.x + p5.width/2/cameraZoom,
            //     up: cameraPos.y + p5.height/2/cameraZoom,
            //     down: cameraPos.y - p5.height/2/cameraZoom,
            // }

            let screenBox = new Box(
                -cameraPos.x - p5.width / cameraZoom / 2 - GROUP_OBJ_SPACING,
                cameraPos.y - p5.height / cameraZoom / 2 - GROUP_OBJ_SPACING,
                p5.width / cameraZoom + GROUP_OBJ_SPACING * 2,
                p5.height / cameraZoom + GROUP_OBJ_SPACING * 2,
            )
            
            p5.noFill()
            p5.stroke(255, 0, 0)
            p5.strokeWeight(1)
            p5.rect(screenBox.x, screenBox.y, screenBox.w, screenBox.h)

            const d = new Date()
            const time = d.getTime()

            let bodies_done = Array(bodies.length).fill(false)
            const close_points = qtree.query(screenBox)

            close_points.forEach(({data: i}) => {
                if (bodies_done[i]) return
                bodies_done[i] = true
                const body = bodies[i]
                // if spawn triggered
                if (body.objs.length == 0) {
                    p5.strokeWeight(5)
                    p5.stroke(255)
                    p5.point(body.pos.x, body.pos.y)
                } else {
                    const y_offset = body.collapsible ? -8 : 0
                    const height_offset = ((body.collapsible && body.collapsed) ? 34 : 26) - y_offset
                    body.get_input_points(bodies, reverse_graph).forEach((point) => {
                        p5.push()
                        p5.translate(point.x, point.y)
                        p5.fill(255)
                        p5.noStroke()
                        p5.rect(-3, -3, 6, 6)
                        p5.pop()
                    })

                    body.get_output_points(bodies, graph).forEach((point) => {
                        p5.push()
                        const output_point = point
                        p5.translate(output_point.x, output_point.y)
                        p5.fill(255)
                        p5.noStroke()
                        p5.ellipse(-0, -0, 6, 6)
                        p5.pop()
                        // only draw bottom output once 
                    })


                    p5.push()
                    p5.translate(body.pos.x, body.pos.y)
                    p5.push()
                    
                    p5.strokeWeight(2)
                    p5.stroke(50, 50, 50)
                    p5.fill(30, 30, 30)
                    const height = GROUP_OBJ_SPACING * (body.child_num() - 1)

                    p5.rect(-13, -13 + y_offset, 26, height_offset + height, 3, 3, 3, 3)
                    p5.fill(50, 50, 50)
                    p5.noStroke()
                    p5.textAlign(p5.CENTER, p5.CENTER)
                    // console.log(body, body.collapsible)
                    if (body.collapsed && body.collapsible) {
                        p5.textSize(7)
                        p5.fill(100, 100, 100)
                        p5.text(`...${body.objs.length - COLLAPSE_LEN}`, 0, 15 + height)

                        p5.fill(50, 50, 50)
                        p5.triangle(-3, -16, 3, -16, 0, -13)
                    } else if (body.collapsible) {
                        p5.triangle(-3, -13, 3, -13, 0, -16)
                    }

                    const trigger_button_h = height + height_offset + y_offset
                    const hover = tmouse.y > body.pos.y + trigger_button_h - 5 && tmouse.y < body.pos.y + trigger_button_h + 5 && Math.abs(tmouse.x - body.pos.x) < 10

                    p5.fill(50, 150, 50, hover ? 255 : 50)
                    p5.stroke(100, 255, 100, hover ? 255 : 50)
                    p5.strokeWeight(1)
                    
                    p5.triangle(-3, trigger_button_h - 5, -3, trigger_button_h + 1, 3, trigger_button_h - 2)
                    // poggers momentus
                    // time to make mastergame example
                    for (let i = 0; i < body.child_num(); i++) {
                        const obj = body.objs[i]
                        p5.push()
                        p5.scale(0.7)
                        world.objects[obj].draw(p5, world)
                        p5.pop()
                        p5.translate(0, GROUP_OBJ_SPACING)
                    }
                    
                    p5.pop()
                    if (body.pinned) {
                        p5.strokeWeight(1)
                        p5.stroke(255, 0, 0, 150)
                        p5.noFill()
                        p5.rect(-13, -13 + y_offset, 26, height_offset + height, 3, 3, 3, 3)
                    }
                    if (body.selected) {
                        p5.strokeWeight(1)
                        p5.stroke(0, 100, 255, 200)
                        p5.noFill()
                        p5.rect(-15, -15 + y_offset, 30, height_offset + height + 4, 5, 5, 5, 5)
                    }
                    p5.pop()
                }
            })
            // hot sex
            const MAX_ARROWS = 3000
            let arrow_count = 0;

            const make_line = (a, b) => new Col.Polygon({x:0, y:0}, [a, b]);
            /*
                a = !{
                    10g.move(10, 0)
                }

                for i in 0..10 {
                    call_with_delay(i, a)
                }
            */
             
            const screen_rect = new Col.Box({x: screenBox.x, y: screenBox.y}, screenBox.w, screenBox.h);
            (() => {
                for (let body_idx = 0; body_idx < bodies.length; body_idx++) {
                    let bottom_done = new Set()

                    if (bodies[body_idx].objs.length == 0) {
                        const body = bodies[body_idx]
                        const body2 = bodies[[...graph[body_idx][0].values()][0]]
                        p5.stroke(100, 100, 255, 250)
                        p5.strokeWeight(1)
                        p5.fill(100, 100, 255, 250)

                        const output_point = body.output_point(0, body2.pos.x)
                        const input_point = body2.connection_point(body.pos.x)

                        if (system.checkCollision(screen_rect, make_line(output_point, input_point))) {
                            arrow(p5, output_point.x, output_point.y, input_point.x, input_point.y)
                            arrow_count++
                            if (arrow_count > MAX_ARROWS) return
                        }

                    } else {
                        for (let child_idx = 0; child_idx < bodies[body_idx].objs.length; child_idx++) {

                            const body = bodies[body_idx]
                            const obj = world.objects[body.objs[child_idx]]
                            const bottom: boolean = child_idx >= body.child_num()

                            if (graph[body_idx] && graph[body_idx][child_idx]) {
                                graph[body_idx][child_idx].forEach(other_body => {
                                    if (!(bottom && bottom_done.has(other_body))) {
                                        if (bottom)
                                            bottom_done.add(other_body)

                                        const body2 = bodies[other_body]
                                        
                                        p5.strokeWeight(1)
                                        
                                        const flashlen = 700;
                                        let time_since_last_spawn = obj instanceof Trigger && obj.kind instanceof FunctionTrigger ? 
                                            (obj instanceof SpawnTrigger ? 
                                                time - (obj.kind.last_spawn + obj.delay * 1000)
                                                : (time - obj.kind.last_spawn))
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
                                        
                                        const output_point = body.output_point(child_idx, body2.pos.x)
                                        const input_point = body2.connection_point(body.pos.x)

                                        if (system.checkCollision(screen_rect, make_line(output_point, input_point))) {
                                            arrow(p5, output_point.x, output_point.y, input_point.x, input_point.y)
                                            arrow_count++
                                            if (arrow_count > MAX_ARROWS) return
                                        
                        
                                            if (obj instanceof SpawnTrigger) {
                                                if (time - obj.kind.last_spawn < obj.delay * 1000) {
                                                    const progress = (time - obj.kind.last_spawn) / (obj.delay * 1000)
                                                    
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
                                        }
                                    }
                                })
                                if (arrow_count > MAX_ARROWS) return
                            }

                            // toggle trigger arrows
                            if (child_idx < body.child_num() && (obj instanceof ToggleTrigger || obj instanceof StopTrigger)) {
                                p5.strokeWeight(1)
                                p5.noFill()
                                const p1 = {
                                    x: body.pos.x,
                                    y: body.pos.y + GROUP_OBJ_SPACING * child_idx
                                }
                                let prog = 1 - Math.max(0.5 - (time - obj.lastTrigger) / 1000, 0);;
                                if (obj instanceof ToggleTrigger && obj.activate) {
                                    p5.stroke(255 * prog, 255, 255 * prog, 20)
                                } else {
                                    p5.stroke(255, 255 * prog, 255 * prog, 20)
                                }
                                
                                if (bodies_per_group[obj.target]) {
                                    bodies_per_group[obj.target].forEach(body2idx => {
                                        const body2 = bodies[body2idx]
                                        const p2 = bodies[body2idx].connection_point(body.pos.x)
                                        if (system.checkCollision(screen_rect, make_line(p1, p2))) {
                                            arrow(p5, p1.x, p1.y, p2.x, p2.y)
                                            arrow_count++
                                            if (arrow_count > MAX_ARROWS) return
                                        }
                                    })
                                    if (arrow_count > MAX_ARROWS) return
                                } else if (world.groupIDs[obj.target]) {
                                    world.groupIDs[obj.target].objects.forEach(obj2idx => {
                                        if (obj_to_body_idx[obj2idx]) { 
                                            // i
                                            // yea i need to install sveltemarkdown
                                            // but npm i did nothing
                                            const [bodyidx, child_idx] = obj_to_body_idx[obj2idx]
                                            const body2 = bodies[bodyidx]
                                            if (child_idx < body2.child_num()) {
                                                const p2 = {
                                                    x: body2.pos.x,
                                                    y: body2.pos.y + GROUP_OBJ_SPACING * child_idx
                                                }
                                                if (system.checkCollision(screen_rect, make_line(p1, p2))) {
                                                    arrow(p5, p1.x, p1.y, p2.x, p2.y)
                                                    arrow_count++
                                                    if (arrow_count > MAX_ARROWS) return
                                                }
                                            }
                                        }
                                    })
                                    if (arrow_count > MAX_ARROWS) return
                                } // ok wait but what does dual mode actually do cuz so far it just seems to be limiting touch input to 1 player
                            } // yea thats what it does
                            // its kinda stupid but dual off means both dual and non dual work
                            // but i dont rly get what it is supposed to do
                            
                            // mouse click activates both dual touch triggers and normal ones | this is actually not  | ok nerd
                            // mouse click acts like a tap and it does different things depending on the half of the screen
                            // space bar only activates dual touch triggers :sunglaseerdnmvhjfghfjgh jh
                            
                            
                            // wait you mean like touch triggers linked to other touch triggers?

                            // oh yeah i rember now thanke np
                        }
                    }
                }
            })()
    
            p5.pop()

            // dropped in to give your sketch rounded corners
            p5.noFill()
            p5.strokeWeight(12)
            p5.stroke(59, 59, 59)
            p5.rect(-4, -4, p5.width+8, p5.height+8, 18)
            p5.stroke(20, 20, 26)
            p5.rect(-6, -6, p5.width+12, p5.height+12, 18)
            p5.stroke(17, 17, 22)
            p5.rect(-38, -38, p5.width+44, p5.height+44, 18)
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
