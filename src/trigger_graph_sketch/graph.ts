import {QuadTree, Circle, Box} from 'js-quadtree';
import type { BodyIdx, Graph, ReverseGraph } from './sketch';

const IDEAL_DIST = 100;
const RELATION_POWER = 3000;
const SPRING_COEF = 0.05;
const MAX_VEL = 300;

export const GROUP_OBJ_SPACING = 25

class Body {
    pos: { x: number, y: number };
    vel: { x: number, y: number };
    pinned: boolean = false;
    objs: number[];
    index: BodyIdx;

    input_side: number;
    output_side: number;

    connection_point() {
        return { x: this.pos.x + 13 * this.input_side, y: this.pos.y - 13 +  (GROUP_OBJ_SPACING * this.objs.length) * 0.5 }
    }

    output_point(child_idx: number) {
        return { x: this.pos.x + 13 * this.output_side, y: this.pos.y + (GROUP_OBJ_SPACING * child_idx) + 5 }
    }

    constructor(pos: { x: number, y: number }, objs: number[], index: BodyIdx, pinned: boolean = false) {
        this.pos = pos;
        this.vel = { x: 0, y: 0 };
        this.pinned = pinned;
        this.objs = objs;
        this.index = index;
        this.input_side = -1;
        this.output_side = 1;
    }

    calc_input_side(bodies: Body[], reverse_graph: ReverseGraph) {
        let sum = 0
        if (reverse_graph[this.index])
            reverse_graph[this.index].forEach(([body_idx, _]) => {
                const child_pos = bodies[body_idx].pos.x
                sum += child_pos - this.pos.x
            })

        if (sum > 0)
            this.input_side = 1
        else
            this.input_side = -1
    }

    calc_output_side(bodies: Body[], graph: Graph) {
        let sum = 0

        if (graph[this.index]) {
            Object.values(graph[this.index]).forEach((set) => {
                set.forEach(body_idx => {
                    const body_pos = bodies[body_idx].pos.x
                    sum += body_pos - this.pos.x
                })
            })
        }
        if (sum > 0)
            this.output_side = 1
        else
            this.output_side = -1
    }

//     type Graph =        Record<BodyIdx, Record<BodyChildIdx, Set<BodyIdx>>>;
//     type ReverseGraph = Record<BodyIdx, Set<[BodyIdx, BodyChildIdx]>>;

    affect(bodies: Body[], qtree: QuadTree, graph: Graph, reverse_graph: ReverseGraph) {
        if (this.pinned) return

        let force = { x: 0.5, y: 0 };
        const end_y = (this.pos.y + GROUP_OBJ_SPACING * this.objs.length)

        const connected_to = (other: BodyIdx) => {
            if (graph[this.index])
                return Object.values(graph[this.index]).some(set => set.has(other))
                || (!!reverse_graph[other] && [...reverse_graph[other]].some(([i, _]) => i === this.index))
            else return false
        }
        // repel close objects
        const close_points = qtree.query(new Box(this.pos.x - 300, this.pos.y - 300, 600, this.objs.length * GROUP_OBJ_SPACING + 600))
        let bodies_done = Array(bodies.length).fill(false)

        close_points.forEach((point, i) => {
            if (point.data === this.index) return
            if (bodies_done[point.data]) return
            bodies_done[point.data] = true

            const body2 = bodies[point.data]
            const body2_end_y = (body2.pos.y + GROUP_OBJ_SPACING * body2.objs.length)

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
        let connected_bodies = []

        for (let child_idx = 0; child_idx < this.objs.length; child_idx++) {
            if (!graph[this.index] || !graph[this.index][child_idx]) continue
            const child_pos = this.output_point(child_idx)
            graph[this.index][child_idx].forEach(body_idx => {
                const body_pos = bodies[body_idx].connection_point()
                const to = {
                    x: child_pos.x - body_pos.x,
                    y: child_pos.y - body_pos.y
                }
                connected_bodies.push(to)
            })
        }
        if (reverse_graph[this.index])
            reverse_graph[this.index].forEach(([body_idx, child_idx]) => {
                const child_pos = bodies[body_idx].output_point(child_idx)
                const to = {
                    x: this.connection_point().x - child_pos.x,
                    y: this.connection_point().y - child_pos.y
                }
                connected_bodies.push(to)
            })

        
        connected_bodies.forEach(to => { 
            
            let dist = Math.hypot(to.x, to.y);

            if (dist > 0.01) {
                const factor = SPRING_COEF * (IDEAL_DIST - dist);
                force.x += (to.x / dist) * factor
                force.y += (to.y / dist) * factor
            }
        })
        

        // force.x /= this.objs.length ** 2;
        // force.y /= this.objs.length ** 2;

        this.vel.x += force.x;
        this.vel.y += force.y;

        this.vel.x *= 0.7;
        this.vel.y *= 0.7;

        this.vel.x = Math.min(Math.max(this.vel.x, -MAX_VEL), MAX_VEL);
        this.vel.y = Math.min(Math.max(this.vel.y, -MAX_VEL), MAX_VEL);

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(p5: any) {
        p5.fill(255);
        p5.ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}

export default Body