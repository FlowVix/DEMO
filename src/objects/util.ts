

export function draw_trigger(p5, color, name, text) {
    p5.strokeWeight(2)
    p5.stroke(color[0] * 0.3, color[1] * 0.3, color[2] * 0.3)
    p5.fill(color[0], color[1], color[2])
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