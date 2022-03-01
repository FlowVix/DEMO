export default {
    "hello world": 
`extract obj_props

$.print("Hello SPWN!")
$.add("Hello SPWN!".to_obj().with(X, 90).with(Y, 150))

// create an object with group 10
$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})

// loop counter
i = counter()
i.display(45, 45)
    
while_loop(() => i < 10, () {
    i += 1
    // move the object
    10g.move(0, 20, 0.5)
    10g.move(20, 0, 0.5)
    10g.move(0, -20, 0.5)
    10g.move(-20, 0, 0.5)
})`,

    "counter multiplication": 
`c1 = counter(13, bits = 8)
c2 = counter(7, bits = 8)
result = counter(0, bits = 8)

c1.display(45, 45)
c2.display(90, 45)
result.display(150, 45)

wait(1)
// 13 * 7 = 91
result = c1 * c2`,
    "trail": 
`extract obj_props

$.add(obj{
    OBJ_ID: 1,
    X: 0,
    Y: 0,
    GROUPS: 1g,
})
trail = 100
let groups = []

for i in 0..trail {
    new_group = ?g
    groups.push(new_group)
    $.add(obj{
        OBJ_ID: 1,
        X: -1000,
        Y: 0,
        GROUPS: new_group,
        SCALING: 0.1,
    })
}

wait(1)
-> 1g.move(30, 0, duration = 0.05*trail)
-> 1g.move(0, 30, duration = 0.05*trail, easing = EASE_IN_OUT)

for i in 0..trail {
    -> groups[i].move_to(1g)
    wait()
}

`,
    "controls": 
`// build w/o optimization
extract obj_props
player = ?g
arrow = ?g

$.add(obj{ OBJ_ID: 1, X: 45, Y: 45, GROUPS: player })
$.add(obj{ OBJ_ID: 1603, X: 75, Y: 45, GROUPS: arrow })

dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]
let move_funcs = [!{
    -> player.move(dirs[i][0] * 600, dirs[i][1] * 600, 10)
    -> arrow.move(dirs[i][0] * 600, dirs[i][1] * 600, 10)
} for i in 0..4 ]

touching_nondual = counter(false)
dir = counter(0)

on(touch(), !{
    touching_nondual = true
    move_funcs[dir.to_const(0..4)]!
})

on(touch_end(), !{
    touching_nondual = false
    for m in move_funcs {
        m.start_group.stop()
    }
})

on(touch(dual_side = true), !{
    if !@bool(touching_nondual) {
        dir += 1
        if dir == 4 {
            dir -= 4
        }
        arrow.rotate(player, 90)
    }
})`,
    "rotation-quirk": 
`extract obj_props

$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 1g,
    SCALING: 0.5;
})
$.add(obj{
    OBJ_ID: 1,
    X: 45,
    Y: 15,
    GROUPS: 2g,
    SCALING: 0.5;
})

$.add(obj{
    OBJ_ID: 1,
    X: -15,
    Y: 15+30*3.141592,
    SCALING: 0.5;
})

$.print("They will move ~PI blocks up!")

wait(0.5)
-> 1g.rotate(2g, 180, duration = 5)
-> 2g.rotate(1g, -180, duration = 5)`,
    "orbit": `extract obj_props

$.add(obj{
    OBJ_ID: 1764,
    X: 45,
    Y: 45,
    GROUPS: 1g,
    SCALING: 2.0,
})
$.add(obj{
    OBJ_ID: 1764,
    X: 45+4*30,
    Y: 45,
    GROUPS: 2g,
})
$.add(obj{
    OBJ_ID: 1764,
    X: 45+5*30,
    Y: 45,
    GROUPS: 3g,
})

3g.follow(2g)

-> 3g.rotate(2g, 4*360, duration = 10)
wait(1)
-> 2g.rotate(1g, 2*360, duration = 10)
`,
    "cube": 
`extract obj_props

add_point = (x, y, group, scaling = 1) {
    $.add(obj{
        OBJ_ID: 1764,
        X: x * 30,
        Y: y * 30,
        GROUPS: group,
        SCALING: scaling,
    })
}

LINE_POINTS = 10
Y_FAC = 0.3
REF_OFFSET = [3, 30]
CUBE_OFFSET = [3, 3]
HEIGHT = 2

create_line = (x1, y1, x2, y2, group_a, group_b) {
    for i in 1..LINE_POINTS {
        posx = x1 + (x2 - x1) * i / LINE_POINTS
        posy = y1 + (y2 - y1) * i / LINE_POINTS
        group = ?g
        add_point(posx + CUBE_OFFSET[0], posy * Y_FAC + CUBE_OFFSET[1], group, 0.5)
        add_point(posx + CUBE_OFFSET[0], posy * Y_FAC - HEIGHT + CUBE_OFFSET[1], group, 0.5)
        group.follow_lerp(group_a, group_b, i / LINE_POINTS)
    }
}


center = ?g
ref = ?g

add_point(REF_OFFSET[0], REF_OFFSET[1], center)

add_vertex = (x, y) {
    ref_group = ?g
    follow_group = ?g
    top_group = ?g

    add_point(REF_OFFSET[0] + x, REF_OFFSET[1] + y, [ref, ref_group])
    // top face
    add_point(CUBE_OFFSET[0] + x, CUBE_OFFSET[1] + y * Y_FAC, [follow_group, top_group])

    for i in 1..LINE_POINTS {
        add_point(CUBE_OFFSET[0] + x, CUBE_OFFSET[1] + y * Y_FAC - (HEIGHT / LINE_POINTS) * i, follow_group, 0.5)
    }
    // bottom face
    add_point(CUBE_OFFSET[0] + x, CUBE_OFFSET[1] + y * Y_FAC - HEIGHT, follow_group)
    follow_group.follow(ref_group, y_mod = Y_FAC)
    return top_group
}

t1 = add_vertex(-1, 1)
t2 = add_vertex(1, 1)
t3 = add_vertex(-1, -1)
t4 = add_vertex(1, -1)

create_line(-1, 1, 1, 1, t1, t2)
create_line(1, 1, 1, -1, t2, t4)
create_line(1, -1, -1, -1, t4, t3)
create_line(-1, -1, -1, 1, t3, t1)

ref.rotate(center, 360 * 10, 30)`,

    "bouncing ball": `extract obj_props

// setup
[ball_id, wall_id, floor_id] = [?b, ?b, ?b]
ball_group = ?g
$.add(obj{
    OBJ_ID: obj_ids.special.COLLISION_BLOCK,
    X: 100, Y: 120, SCALING: 0.5,
    BLOCK_A: ball_id,
    GROUPS: ball_group,
    DYNAMIC_BLOCK: true,
})

for i in 0..15 {
    $.add(obj{
        OBJ_ID: obj_ids.special.COLLISION_BLOCK,
        X: 15+30*i, Y: -15,
        BLOCK_A: floor_id,
    })
}
for i in 0..5 {
    $.add(obj{
        OBJ_ID: obj_ids.special.COLLISION_BLOCK,
        X: -15, Y: 15+30*i,
        BLOCK_A: wall_id,
    })
    $.add(obj{
        OBJ_ID: obj_ids.special.COLLISION_BLOCK,
        X: 15+15*30, Y: 15+30*i,
        BLOCK_A: wall_id,
    })
}

//physics setup
[pos, vel, hflip, vflip] = [?g, ?g, ?g, ?g]
$.add(obj{
    OBJ_ID: 1764, X: 0, Y: 30*30, GROUPS: pos,
})
$.add(obj{
    OBJ_ID: 1764, X: 0, Y: 30*30, GROUPS: hflip, SCALING: 0.25
})
$.add(obj{
    OBJ_ID: 1764, X: 30, Y: 30*30, GROUPS: vel, SCALING: 0.5,
})
$.add(obj{
    OBJ_ID: 1764, X: 30, Y: 30*30, GROUPS: vflip, SCALING: 0.25,
})

// physics
ball_group.follow(pos)

vel.follow(pos)
hflip.follow(pos, y_mod = 0); hflip.follow(vel, x_mod = 0); 
vflip.follow(pos, x_mod = 0); vflip.follow(vel, y_mod = 0); 
velocity = !{ pos.move_to(vel, duration = 0.3) }
while_loop(() => true, (){
    velocity.start_group.stop()
    velocity!
}, delay = 0.05)
-> vel.move(0, -20000, duration = 999)


// collision checking
on(collision(ball_id, wall_id), !{
    vel.rotate(hflip, 180)
})
on(collision(ball_id, floor_id), !{
    vel.rotate(vflip, 180)
})
`,
    "brainfuck": 
`RIGHT = 1b
LEFT = 2b
INCR = 3b
DECR = 4b
DOT = 5b
OPEN = 6b //opening bracket
CLOSE = 7b //closing bracket

spacing = 10

insert_bf_script = (str: @string, offset: [@number]) {
    let index = 0
    for ch in str {
        blockid = match ch {
            ==">": RIGHT,//increment the data pointer (to point to the next cell to the right).
            =="<": LEFT,	//decrement the data pointer (to point to the next cell to the left).
            =="+": INCR,	//increment (increase by one) the byte at the data pointer.
            =="-": DECR,	//decrement (decrease by one) the byte at the data pointer.
            ==".": DOT,	//output the byte at the data pointer.
            //case ",": 	//accept one byte of input, storing its value in the byte at the data pointer.
            =="[": OPEN,	
            =="]": CLOSE,
            else: null 
        }
        if blockid != null {
            extract obj_props
            $.add(obj {
                OBJ_ID: 1816,
                X: offset[0] + index * spacing * 3,
                Y: offset[1],
                BLOCK_A: blockid,
                SCALING: 0.2,
            })
            $.add(obj {
                OBJ_ID: 914,
                X: offset[0] + index * spacing * 3,
                Y: offset[1] - 30,
                TEXT: $.b64encode(ch),
                COLOR: 1c,
            })
            index++
        }
    }
}

type @bytedisplay 

impl @bytedisplay {
    new: (offset: [@number]) {
        1c.set(rgb8(255, 255, 255))
        //order = "!\\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[ ]^_\`abcdefghijklmnopqrstuvwxyz{|}~"
        order = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let list = []
        for ch in order {
            color = ?c
            extract obj_props
            $.add(obj {
                OBJ_ID: 914,
                X: offset[0],
                Y: offset[1],
                TEXT: $.b64encode(ch),
                COLOR: color,
            })
            color.set(rgb8(0,0,0), blending = true)
            list.push(color)
        }
        return @bytedisplay::{list: list, chars: order.length}
    },
    display: (self, index: @number) {
        for i in 0..self.list.length {
            if i == index {
                -> self.list[index].pulse(rgb8(0,255,0), fade_out = 0.5)
                -> self.list[index].set(rgb8(255,255,255), 0.5)
            } else {
                self.list[i].set(rgb8(0,0,0), blending = true)
            }
        }
    }
}

type @bfreader
layers = counter(0)
//layers.display(150, 300)

impl @bfreader {
    new: (script_offset: [@number], cell_count: @number) {
        
        extract obj_props
        block = ?b
        group = ?g
        $.add(obj {
            OBJ_ID: 1816,
            X: script_offset[0] - spacing * 6,
            Y: script_offset[1],
            GROUPS: group,
            BLOCK_A: block,
            SCALING: 0.5,
            DYNAMIC_BLOCK: true,
        })
        for b in [RIGHT,LEFT,INCR,DECR,DOT,OPEN,CLOSE] {
            $.add(obj {
                OBJ_ID: 1816,
                X: script_offset[0] - spacing * 3,
                Y: script_offset[1],
                SCALING: 0.5,
                BLOCK_A: b,
            })
        }
        

        // CREATE CELLS
        let cells = []
        for i in 0..cell_count {
            c = counter()
            cells.push(c)
            c.display(script_offset[0] + i * 45, script_offset[1] + 90)
        }
        ptr = counter(0)
        ptr.display(script_offset[0], script_offset[1] + 60)
        

        std_out = @bytedisplay::new([script_offset[0], script_offset[1] + 120])
        out = @bfreader::{
            group: group,
            right: counter(block.create_tracker_item(RIGHT)),
            left:  counter(block.create_tracker_item(LEFT)),
            incr:  counter(block.create_tracker_item(INCR)),
            dot:  counter(block.create_tracker_item(DOT)),
            decr:  counter(block.create_tracker_item(DECR)),
            open:  counter(block.create_tracker_item(OPEN)),
            close: counter(block.create_tracker_item(CLOSE)),
            std_out: std_out,
            ptr: ptr,
            cells: cells,
        }
        group.move(spacing * 2, 0, 0.3)

        return out
    },
    currently_on: (self) {
        if self.right == 1 {
            return RIGHT
        } else if self.left == 1 {
            return LEFT
        } else if self.incr == 1 {
            return INCR
        } else if self.decr == 1 {
            return DECR
        } else if self.dot == 1 {
            return DOT
        } else if self.open == 1 {
            return OPEN
        } else if self.close == 1 {
            return CLOSE
        }
    },
    current_cell: (self) => self.cells[self.ptr.to_const(0..self.cells.length)],
    interpret: (self) {
        
        ret = !{
            self.group.move(spacing, 0, 0)
            -> return
        }
        current = self.currently_on()
        
        if current == RIGHT {
            self.ptr += 1
            ret!
        }
        else if current == LEFT {
            self.ptr -= 1
            ret!
        }
        else if current == INCR {
            -> self.current_cell() += 1
            ret!
        }
        else if current == DECR {
            -> self.current_cell() -= 1
            ret!
        }
        else if current == DOT {
            std_out = counter(0)
            () {
                std_out.reset()
                cell = self.current_cell()
                wait()
                cell.copy_to([std_out])
            } ()

            self.std_out.display(std_out.to_const(0..self.std_out.chars))
            ret!
        }
        else if current == OPEN {
            move_to = !{
                condition = () => !(layers == 0 && self.close == 1)
                
                while_loop(condition, delay = 0.03, (){
                    
                    wait(0.02)
                    -> if self.open == 1{
                        layers += 1
                    }
                    
                    -> if self.close == 1 {
                        layers -= 1
                    }

                    wait(0.01)
                    self.group.move(spacing, 0) 
                })
                ret!
            }
            if self.current_cell() == 0 {
                layers -= 1
                call_with_delay(0.05, move_to)
            } else {
                ret!
            }
        }
        else if current == CLOSE {
            move_back = !{
                condition = ()=> !(layers == 0 && self.open == 1)
                while_loop(condition, delay = 0.03, (){
                    wait(0.02)
                    -> if self.close == 1 {
                        layers += 1
                    }
                    
                    -> if self.open == 1 {
                        layers -= 1
                    }
                    
                    wait(0.01)
                    self.group.move(-spacing, 0)
                        
                })
                
                ret!
            }
            if self.current_cell() != 0 {
                layers -= 1
                call_with_delay(0.05, move_back)
            } else {
                ret!
            }
        }
        
        
    }
}

offset = [300, 300]
insert_bf_script("><+-[].", offset)

reader = @bfreader::new(offset, 20)
while_loop(()=>true, (){
    reader.interpret()
})`

}
