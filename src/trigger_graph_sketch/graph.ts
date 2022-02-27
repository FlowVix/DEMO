import {QuadTree, Circle, Box} from 'js-quadtree';
import { BodyIdx, Graph, qtree_limits, ReverseGraph } from './sketch';

const IDEAL_DIST = 60;
const RELATION_POWER = 10000;
const SPRING_COEF = 0.05;
const MAX_VEL = 300;

export const COLLAPSE_LEN = 8;

export const GROUP_OBJ_SPACING = 25

class Body {
    pos: { x: number, y: number };
    vel: { x: number, y: number };
    pinned: boolean = false;
    selected: boolean = false;
    objs: number[];
    index: BodyIdx;
    collapsed: boolean;
    collapsible: boolean;
    extra_node: number = null;

    // input_side: number;
    // output_side: number;

    connection_point(source_x): { x: number, y: number } {
        if (this.objs.length == 0) return this.pos
        return { x: this.pos.x + 13 * (source_x < this.pos.x ? -1 : 1), y: this.pos.y - 13 +  (GROUP_OBJ_SPACING * this.child_num()) * 0.5 }
    }

    output_point(child_idx: number, source_x): { x: number, y: number } {
        if (this.objs.length == 0) return this.pos
        if (child_idx >= this.child_num()) {
            return { x: this.pos.x, y: this.pos.y + (GROUP_OBJ_SPACING * (this.child_num() - 1)) + 23 }
        } 
        return { x: this.pos.x + 13 * (source_x < this.pos.x ? -1 : 1), y: this.pos.y + (GROUP_OBJ_SPACING * child_idx) + 5 }
    }

    child_num(): number {
        if (this.objs.length == 0) return 1
        if (this.collapsed) {
            return Math.min(this.objs.length, COLLAPSE_LEN)
        }
        return this.objs.length
        
    }

    contains(pos): boolean {
        return (
            pos.x > this.pos.x - 13 &&
            pos.x < this.pos.x + 13 &&
            pos.y > this.pos.y - 13 &&
            pos.y < this.pos.y + GROUP_OBJ_SPACING * (this.child_num() - 1) + 13
        )
    }

    constructor(pos: { x: number, y: number }, objs: number[], index: BodyIdx, pinned: boolean = false) {
        this.pos = pos;
        this.vel = { x: 0, y: 0 };
        this.pinned = pinned;
        this.objs = objs;
        this.index = index;
        // this.input_side = -1;
        // this.output_side = 1;
        this.collapsed = true;
        this.collapsible = this.objs.length > COLLAPSE_LEN;
        this.extra_node = null;
    }

    get_output_points(bodies: Body[], graph: Graph): { x: number, y: number }[] {
        let points = []
        let bottom_done = false
        if (graph[this.index]) {
            Object.entries(graph[this.index]).forEach(([child_idx, set]) => {
                if (parseInt(child_idx) >= this.child_num()) {
                    if (bottom_done) return
                    else bottom_done = true
                }

                const arr = [...set.values()]
                if (arr.some(i => bodies[i].pos.x > this.pos.x)) {
                    points.push(this.output_point(parseInt(child_idx), this.pos.x + 1))
                }
                if (arr.some(i => bodies[i].pos.x < this.pos.x)) {
                    points.push(this.output_point(parseInt(child_idx), this.pos.x - 1))
                }
            })
        }
        return points
    }

    get_input_points(bodies: Body[], reverse_graph: ReverseGraph): { x: number, y: number }[] {
        let points = []
        if (reverse_graph[this.index]) {
            const arr = [...reverse_graph[this.index]]
            if (arr.some(([i, _]) => bodies[i].pos.x > this.pos.x)) {
                points.push(this.connection_point(this.pos.x + 1))
            }
            if (arr.some(([i, _]) => bodies[i].pos.x < this.pos.x)) {
                points.push(this.connection_point(this.pos.x - 1))
            }
        }
        return points
    }

    clone(): Body {
        return new Body({...this.pos}, this.objs, this.index, this.pinned)
    }

    // calc_input_side(bodies: Body[], reverse_graph: ReverseGraph) {
    //     let sum = 0
    //     if (reverse_graph[this.index])
    //         reverse_graph[this.index].forEach(([body_idx, _]) => {
    //             const child_pos = bodies[body_idx].pos.x
    //             sum += child_pos - this.pos.x
    //         })

    //     if (sum > 0)
    //         this.input_side = 1
    //     else
    //         this.input_side = -1
    // }

    // calc_output_side(bodies: Body[], graph: Graph) {
    //     let sum = 0

    //     if (graph[this.index]) {
    //         Object.values(graph[this.index]).forEach((set) => {
    //             set.forEach(body_idx => {
    //                 const body_pos = bodies[body_idx].pos.x
    //                 sum += body_pos - this.pos.x
    //             })
    //         })
    //     }
    //     if (sum > 0)
    //         this.output_side = 1
    //     else
    //         this.output_side = -1
    // }

//     type Graph =        Record<BodyIdx, Record<BodyChildIdx, Set<BodyIdx>>>;
//     type ReverseGraph = Record<BodyIdx, Set<[BodyIdx, BodyChildIdx]>>;

    affect(bodies: Body[], qtree: QuadTree, graph: Graph, reverse_graph: ReverseGraph, mousepos, temperature) {
        if (this.pinned) return

        let force = { x: this.pos.x < 300 ? 0.2 : this.pos.x > 600 ? -0.5 : (450 - this.pos.x) * 0.001, y: -this.pos.y * 0.002 };

        if (this.selected) {
            force.x += (mousepos.x - this.pos.x) * 0.2;
            force.y += (mousepos.y - this.pos.y) * 0.2;
        }

// hello, sorry ive been away for a bit, whats been happenin
        const end_y = (this.pos.y + GROUP_OBJ_SPACING * this.child_num())

        // const connected_to = (other: BodyIdx) => {
        //     if (graph[this.index])
        //         return Object.values(graph[this.index]).some(set => set.has(other))
        //         || (!!reverse_graph[other] && [...reverse_graph[other]].some(([i, _]) => i === this.index))
        //     else return false
        // }
        // repel close objects
        const close_points = qtree.query(new Box(this.pos.x - 300, this.pos.y - 300, 600, this.child_num() * GROUP_OBJ_SPACING + 600))
        let bodies_done = Array(bodies.length).fill(false)

        //if (this.objs.length > 0)
            close_points.forEach((point, i) => {
                if (point.data === this.index) return
                if (bodies_done[point.data]) return
                bodies_done[point.data] = true

                const body2 = bodies[point.data]
                //if (bodies[point.data].objs.length == 0) return
                const body2_end_y = (body2.pos.y + GROUP_OBJ_SPACING * body2.child_num())

                let dist;
                let to;
                if (body2_end_y < this.pos.y) {
                    dist = Math.hypot(this.pos.x - body2.pos.x, this.pos.y - body2_end_y);
                    to = { x: this.pos.x - body2.pos.x, y: this.pos.y - body2_end_y }
                } else if (body2.pos.y > end_y) {
                    dist = Math.hypot(this.pos.x - body2.pos.x, end_y - body2.pos.y);
                    to = { x: this.pos.x - body2.pos.x, y: end_y - body2.pos.y }
                } else {
                    dist = Math.abs(this.pos.x - body2.pos.x)
                    to = { x: this.pos.x - body2.pos.x, y: 0}
                }


                if (dist > 0.01) {
                    to.x /= dist;
                    to.y /= dist;
                    
                    const factor = RELATION_POWER/(dist**2);
                    force.x += to.x * factor
                    force.y += to.y * factor
                    
                }
            })

        // attract connected bodies
        bodies_done = Array(bodies.length).fill(false)         
        let connected_bodies = []
        
        for (let child_idx = 0; child_idx < this.child_num(); child_idx++) {
            if (!graph[this.index] || !graph[this.index][child_idx]) continue
            graph[this.index][child_idx].forEach(body_idx => {
                if (!bodies_done[body_idx]) {
                    bodies_done[body_idx] = true
                    const child_pos = this.output_point(child_idx, bodies[body_idx].pos.x)
                    const body_pos = bodies[body_idx].connection_point(this.pos.x)
                    
                    const to = {
                        x: child_pos.x - body_pos.x,
                        y: child_pos.y - body_pos.y,
                    }
                    connected_bodies.push(to)
                }
            })
        }
        if (reverse_graph[this.index])
            reverse_graph[this.index].forEach(([body_idx, child_idx]) => {
                if (!bodies_done[body_idx]) {
                    bodies_done[body_idx] = true
                    const child_pos = bodies[body_idx].output_point(child_idx, this.pos.x)
                    const to = {
                        x: this.connection_point(bodies[body_idx].pos.x).x - child_pos.x,
                        y: this.connection_point(bodies[body_idx].pos.x).y - child_pos.y,
                    }
                    connected_bodies.push(to)
                }
            })

        
        connected_bodies.forEach(to => { 
            
            let dist = Math.hypot(to.x, to.y);

            let s = SPRING_COEF

            if (dist > 0.01) {
                const factor = s * (IDEAL_DIST - dist);
                force.x += (to.x / dist) * factor
                force.y += (to.y / dist) * factor
            }
        })
        

        // force.x /= this.child_num() ** 2;
        // force.y /= this.child_num() ** 2;

        this.vel.x += force.x;
        this.vel.y += force.y;

        this.vel.x *= 0.7;
        this.vel.y *= 0.7;

        if (!this.selected) {
            this.vel.x = Math.min(Math.max(this.vel.x, -temperature), temperature);
            this.vel.y = Math.min(Math.max(this.vel.y, -temperature), temperature);
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.pos.x = Math.min(Math.max(this.pos.x, qtree_limits.x), qtree_limits.x + qtree_limits.w);
        this.pos.y = Math.min(Math.max(this.pos.y, qtree_limits.y), qtree_limits.y + qtree_limits.h);
    }

    draw(p5: any) {
        p5.fill(255);
        p5.ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}

export default Body