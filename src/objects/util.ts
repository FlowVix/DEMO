

export function draw_trigger(p5, color, name, text, last_trigger = 0) {
    const d = new Date();
    const time = d.getTime();
    const flash = 1 + Math.max(0.5 - (time - last_trigger) / 1000, 0);

    p5.strokeWeight(2)
    p5.stroke(color[0] * 0.3 * flash, color[1] * 0.3 * flash, color[2] * 0.3 * flash)
    p5.fill(color[0] * flash, color[1] * flash, color[2] * flash)
    p5.rect(-13, -3, 26, 16, 3, 3, 3, 3)

    p5.textAlign(p5.CENTER, p5.CENTER)

    p5.textSize(8)
    p5.stroke(0)
    p5.strokeWeight(1)
    p5.fill(255)
    p5.text(name, 0, -10)

    p5.textSize(14 / (text.length ** 0.4))
    p5.noStroke()
    p5.text(text, 0, 7)
}