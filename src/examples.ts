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
-> 2g.rotate(1g, -180, duration = 5)`
}
