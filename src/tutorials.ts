

// qrskfjgs



const tutorials = [
    //=========================================================================
    {
        name: "Introduction",
        content: `
This is a short tutorial to get familiar with SPWN and the SPWN playground. <br>
For a more in-depth tutorial, check out the [SPWN documentation](https://spu7nix.net/spwn), also accessible 
using the 'Open Docs' button above.

## What is SPWN?

SPWN is a programming language that compiles to Geometry Dash levels. 
What that means is that you can create levels by using not only the visual 
representation in the GD-editor, but using a "verbal" and abstracted representation 
as well. This is especially useful for using GD triggers, which (if you want to make 
complicated stuff) are not really suited for the graphical workflow of 
the in-game editor.

## Prerequisite knowledge

If you have not worked with any programming language in the past, SPWN might
be a bit difficult to get into. We recommend some basic knowledge of procedural
programming language elements such as variables, control flow, and functions.

## Tutorial structure

As you progress through the tutorial, you will be presented with certain examples of
tasks that are common practice in SPWN. You can attempt to solve these tasks yourself,
or click the 'Show me' button at the bottom of each chapter to see the solution.

**With everything out of the way, let's get to learning SPWN!**

`
    },
    //=========================================================================
    {
        name: "do this thing",
        content: `
make block move!!!!

make it there ad a d group.move XD D

\`\`\`highlight-spwn
$.print("here's some code lol :)")
\`\`\`

`,
        initialCode: `
extract obj_props

$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})
`,
        solution: `
extract obj_props

$.add(obj{
    OBJ_ID: 1,
    X: 15,
    Y: 15,
    GROUPS: 10g,
})

10g.move(10, 0, duration = 1)
`,
    },





]


export {tutorials}

