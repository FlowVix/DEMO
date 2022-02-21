import {QuadTree, Circle, Box} from 'js-quadtree';
import type { BodyIdx, Graph, ReverseGraph } from './sketch';

const IDEAL_DIST = 70;
const RELATION_POWER = 1000;
const SPRING_COEF = 0.05;

export const GROUP_OBJ_SPACING = 25

class Body {
    pos: { x: number, y: number };
    vel: { x: number, y: number };
    pinned: boolean = false;
    objs: number[];
    index: BodyIdx;
    connection_point() {
        return { x: this.pos.x - 13, y: this.pos.y - 13 +  (GROUP_OBJ_SPACING * this.objs.length) * 0.5 }
    }

    output_point(child_idx: number) {
        return { x: this.pos.x + 13, y: this.pos.y + (GROUP_OBJ_SPACING * child_idx) }
    }

    constructor(pos: { x: number, y: number }, objs: number[], index: BodyIdx, pinned: boolean = false) {
        this.pos = pos;
        this.vel = { x: 0, y: 0 };
        this.pinned = pinned;
        this.objs = objs;
        this.index = index;
        
    }

//     type Graph =        Record<BodyIdx, Record<BodyChildIdx, Set<BodyIdx>>>;
//     type ReverseGraph = Record<BodyIdx, Set<[BodyIdx, BodyChildIdx]>>;

    affect(bodies: Body[], qtree: QuadTree, graph: Graph, reverse_graph: ReverseGraph) {
        if (this.pinned) return

        let force = { x: 1, y: 0 };
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

            let dist;
            let to;
            if (point.y < this.pos.y) {
                dist = Math.hypot(this.pos.x - point.x, this.pos.y - point.y);
                to = { x: this.pos.x - point.x, y: this.pos.y - point.y }
            } else if (point.y > end_y) {
                dist = Math.hypot(this.pos.x - point.x, end_y - point.y);
                to = { x: this.pos.x - point.x, y: end_y - point.y }
            } else {
                dist = Math.abs(this.pos.x - point.x)
                to = { x: this.pos.x - point.x, y: 0}
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
                    x: this.pos.x - child_pos.x,
                    y: this.pos.y - child_pos.y
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
        

        force.x /= this.objs.length ** 2;
        force.y /= this.objs.length ** 2;

        this.vel.x += force.x;
        this.vel.y += force.y;

        this.vel.x *= 0.8;
        this.vel.y *= 0.8;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(p5: any) {
        p5.fill(255);
        p5.ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}

export default Body