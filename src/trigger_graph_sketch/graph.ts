

const IDEAL_DIST = 30;
const RELATION_POWER = 1000;
const SPRING_COEF = 0.05;

class Body {
    pos: { x: number, y: number };
    vel: { x: number, y: number };
    pinned: boolean = false;
    obj: number;

    constructor(pos: { x: number, y: number }, obj: number, pinned: boolean = false) {
        this.pos = pos;
        this.vel = { x: 0, y: 0 };
        this.pinned = pinned;
        this.obj = obj;
    }

    affect(bodies: Body[], graph: boolean[][]) {
        if (this.pinned) return
        let force = { x: 0.3, y: 0 };
        bodies.forEach((body, i) => {
            let dist = Math.sqrt((body.pos.x - this.pos.x) ** 2 + (body.pos.y - this.pos.y) ** 2);

            if (dist > 0.01) {
                let to = { x: (this.pos.x - body.pos.x) / dist, y: (this.pos.y - body.pos.y) / dist };


                if (!graph[this.obj][body.obj]) {
                    const factor = RELATION_POWER/(dist**2);
                    force.x += to.x * factor
                    force.y += to.y * factor
                } else {
                    // repel
                    const factor = SPRING_COEF * (IDEAL_DIST - dist);
                    force.x += to.x * factor
                    force.y += to.y * factor
                }
            }
        })

        this.vel.x += force.x;
        this.vel.y += force.y;

        this.vel.x *= 0.3;
        this.vel.y *= 0.3;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(p5: any) {
        p5.fill(255);
        p5.ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}

export default Body