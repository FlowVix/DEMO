export default {
    "hello world": `extract obj_props

$.print("Hello SPWN!")
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
    // move the object
    10g.move(0, 20, 0.5)
    10g.move(20, 0, 0.5)
    10g.move(0, -20, 0.5)
    10g.move(-20, 0, 0.5)
    i += 1
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
`extract obj_props

$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})

move = !{
    10g.move(300, 0, 10)
}

on(touch(), move)
on(touch_end(), !{ move.start_group.stop() })`,
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

add_point = (x, y, group) {
    $.add(obj{
        OBJ_ID: 1764,
        X: x * 30,
        Y: y * 30,
        GROUPS: group,
    })
}

Y_FAC = 0.3
REF_OFFSET = [3, 30]
CUBE_OFFSET = [3, 3]

center = ?g
ref = ?g

add_point(REF_OFFSET[0], REF_OFFSET[1], center)

add_vertex = (x, y) {
    ref_group = ?g
    follow_group = ?g
    add_point(REF_OFFSET[0] + x, REF_OFFSET[1] + y, [ref, ref_group])
    // top face
    add_point(CUBE_OFFSET[0] + x, CUBE_OFFSET[1] + y * Y_FAC, follow_group)
    // bottom face
    add_point(CUBE_OFFSET[0] + x, CUBE_OFFSET[1] + y * Y_FAC - $.cos(Y_FAC * 3.14 / 2) * 2, follow_group)
    follow_group.follow(ref_group, y_mod = Y_FAC)
}

add_vertex(-1, 1)
add_vertex(1, 1)
add_vertex(-1, -1)
add_vertex(1, -1)

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

}
