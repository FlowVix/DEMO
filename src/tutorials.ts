

// qrskfjgs



const tutorials = [
    //=========================================================================
    {
        name: "Introduction",
        content: `
This is a short tutorial to get familiar with SPWN and the SPWN playground. <br>
For a more in-depth tutorial, check out the [SPWN documentation](https://spu7nix.net/spwn), also accessible 
using the 'Documentation' button above.

## What is SPWN?

SPWN is a programming language that compiles to Geometry Dash levels. 
What that means is that you can create levels by using not only the visual 
representation in the GD-editor, but using a "verbal" and abstracted representation 
as well. This is especially useful for using GD triggers, which (if you want to make 
complicated stuff) are not really suited for the graphical workflow of 
the in-game editor.

## Prerequisite knowledge

If you have not worked with any programming language in the past, SPWN might
be a bit difficult to get into. We recommend some basic knowledge of common
programming language elements such as variables, control flow, and functions. 
We also recommend that you have some basic experience with the Geometry Dash editor.

## Tutorial structure

As you progress through the tutorial, you will be presented small tasks/challenges related to the contents of the page. 
You can attempt to solve these tasks yourself, or click the 'Show me' button at the bottom of each chapter to see a solution.

**With that out of the way, let's learn SPWN!**
---
*(navigate to the next page with the arrows on the top)*

`

    },
    //=========================================================================
    {
        name: "Basic Triggers",
        content: `
# Basic Triggers

In SPWN, all triggers are made with *macros*. SPWN macros look a lot like what functions look like
in other languages, and they work in pretty much the same way. You can read more about macros in the [documentation](https://spu7nix.net/spwn/#/triggerlanguage/3functions).

## IDs

Most triggers use some kind of *ID* to choose what objects, colors, etc. of the level they affect. In SPWN, these IDs are denoted like this:

| ID    | Description                                 | SPWN Notation   | Example                |
| ----- | ------------------------------------------- | --------------- | ---------------------- |
| group | used to target one or more objects/triggers | \`[group ID]g\` | \`1g\`, \`2g\`, \`3g\` |
| color | used to target a color channel              | \`[color ID]c\` | \`1c\`, \`2c\`, \`3c\` |
| block | used to target one or more collision blocks | \`[block ID]b\` | \`1b\`, \`2b\`, \`3b\` |
| item  | used to target an item ID                   | \`[item ID]i\`  | \`1i\`, \`2i\`, \`3i\` |

Often, you don't really care exactly what ID youre using, since youre just going to use it within your SPWN script. If so, you
can replace the number with a \`?\`, which lets SPWN choose an unused ID for you (for example, if you want an arbitrary group, you can use \`?g\`).

## Trigger Macros

To use a trigger, you call a macro on the ID you want to affect. For example, to change the color of a color channel (let's say channel 10),
you would do something like this:
\`\`\`highlight-spwn
10c.set(color)
\`\`\`
Likewise, you can move a group ID using this macro:
\`\`\`highlight-spwn
10g.move(x, y, duration)
\`\`\`
(you can find macros for all triggers in the [standard library documentation](https://spu7nix.net/spwn/#/std-docs/std-docs))

---
In the editor to the right, there is some code that adds an object with group ID 10. Try to
move the object around by adding a move trigger! You can also make multiple macro calls to chain 
move triggers together. Aftter you've made your code, click the 'Build' button to compile SPWN into triggers,
and click the 'Simulate' button to see the result in the simulator.
---
*(click 'Show me' if you get stuck)*
`,
        initialCode: `
extract obj_props

// adding an object with group 10
$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})
`,
        solution: `
extract obj_props

// adding an object with group 10
$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})

10g.move(30, 0, 1)
10g.move(0, 30, 1)
10g.move(-30, 0, 1)
10g.move(0, -30, 1)
`,
    },

    //=========================================================================
    {
        name: "Control Flow",
        content: `
# Control Flow

In SPWN there is always two ways to do control flow: at compiletime, or with triggers.
At compiletime you have full freedom to do complicated calculations, but the result might
use a lot of objects and IDs. Going with a trigger solution gives you a better result, but
the features avaliable to you are quite limited.
---
# Loops

In SPWN, there are 2 compile time loops: for loops and while loops.
For loops are used to iterate over specific ranges or lists of values:
\`\`\`highlight-spwn
// i is the index of the loop
// 1..10 is a range the loop iterates through	
for i in 1..10 {
    // do something
}
\`\`\`
While loops run over and over until a condition is met:
\`\`\`highlight-spwn
// \`condition\` can be any expression that returns
// a boolean (true/false)
while condition {
    // do something
}
\`\`\`

These same loops can also be made using triggers. To do this we use the macros \`for_loop\` and \`while_loop\`:
\`\`\`highlight-spwn
for_loop(1..10, (i) {
    // do something
})

while_loop(() => condition, () {
    // do something
})
\`\`\`

(You can use \`break\` and \`continue\` to break out of loops, but this only works for compile time loops.)

# If statements

A SPWN if statement looks like this:
\`\`\`highlight-spwn
// \`condition\` can be any expression that returns
// a boolean (true/false)
if condition {
    // do something
}
\`\`\`
There is techically [a trigger version of this](https://spu7nix.net/spwn/#/std-docs/item?id=if_is), but it's not really useful in the vast majority of situations.

---
In the editor to the right, there is some code that moves an object 30 times using a compile-time for loop. 
If you build this code and look in the graph viewer in the top right, you will see that this generates a long
winding chain of triggers. Try changing this to a trigger-based loop, and see the difference!
<br>
*(Notice that the trigger for-loop will attach a lot of triggers at the end to reset the loop counter. 
You can remove these by adding a \`reset = false\` argument to the macro call)*
`,
        initialCode: `
extract obj_props

// adding an object with group 10
$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})

// move the object 30 times
for i in 0..30 {
    10g.move(10, 0, 0.3, easing = EASE_IN_OUT)
}
`,
        solution: `
extract obj_props

// adding an object with group 10
$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})

// move the object 30 times
for_loop(0..30, (i) {
    10g.move(10, 0, 0.3, easing = EASE_IN_OUT)
}, reset = false)
`,
    },





]


export {tutorials}

