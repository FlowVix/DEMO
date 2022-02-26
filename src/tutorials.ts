

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
We also recommend that you have some basic experience with the Geometry Dash editor.

## Tutorial structure

As you progress through the tutorial, you will be presented with certain examples of
tasks that are common practice in SPWN. You can attempt to solve these tasks yourself,
or click the 'Show me' button at the bottom of each chapter to see the solution.

**With everything out of the way, let's get to learning SPWN!**
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

...

\`\`\`highlight-spwn
$.print("here's some code lol :)")
\`\`\`

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

10g.move(10, 0, duration = 1)
`,
    },





]


export {tutorials}

