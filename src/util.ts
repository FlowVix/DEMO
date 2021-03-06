function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [ h, s, v ];
}

function hsvToRgb(h, s, v) {
    let r, g, b;

    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [ r * 255, g * 255, b * 255 ];
}
const clamp = (x, min, max) => Math.min(max, Math.max(min, x));

const modulo = (n, m) => ((n % m) + m) % m

const gdHvsConvert = (col, hue, sat, br, s_c, v_c) => {
    let [h, s, v] = rgbToHsv(col.r, col.g, col.b)
    h *= 360;
    h += hue;
    h = modulo(h, 360)
    s = s_c ? s + sat : s * sat;
    v = v_c ? v + br : v * br;
    s = clamp(s, 0, 1)
    v = clamp(v, 0, 1)
    let [r, g, b] = hsvToRgb(h/360, s, v)
    return {
        r: r,
        g: g,
        b: b,
        a: col.a,
        blending: col.blending,
    }
}

const map = (value, istart, istop, ostart, ostop) => ostart + (ostop - ostart) * ((value - istart) / (istop - istart));



export {
    rgbToHsv,
    hsvToRgb,
    clamp,
    gdHvsConvert,
    map,
    modulo
}