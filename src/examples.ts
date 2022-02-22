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

    "test": `
c = counter(11)
c.display(45, 45)
wait(1)
if c > 10 {
    c -= 5
} else {
    c += 3
}
    `,
}