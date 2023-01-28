const hueShiftJS = {

    rgb2hsv(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;

        let h = 0;
        let s = 0;
        let v = 0;

        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);

        // Hue
        if (max == min) {
            h = 0;
        } else if (max == r) {
            h = ((60 * (g - b) / (max - min) + 360) % 360) | 0;
        } else if (max == g) {
            h = (60 * (b - r) / (max - min) + 120) | 0;
        } else if (max == b) {
            h = (60 * (r - g) / (max - min) + 240) | 0;
        }

        // Saturation
        if (max === 0) {
            s = 0;
        } else {
            s = ((1 - min / max) * 100) | 0;
        }

        // Brightness
        v = (max * 100) | 0;

        return [h, s, v];
    },

    hsv2rgb(h, s ,v) {
        h = h % 360;
        s = s / 100;
        v = v / 100;

        let r = 0;
        let g = 0;
        let b = 0;

        var ti = ((h / 60) | 0) % 6;
        var f = h / 60 - ti;
        var l = v * (1 - s);
        var m = v * (1 - f * s);
        var n = v * (1 - (1 - f) * s);

        switch (ti) {
            case 0:
                r = (v * 255) | 0;
                g = (n * 255) | 0;
                b = (l * 255) | 0;
                break;
            case 1:
                r = (m * 255) | 0;
                g = (v * 255) | 0;
                b = (l * 255) | 0;
                break;
            case 2:
                r = (l * 255) | 0;
                g = (v * 255) | 0;
                b = (n * 255) | 0;
                break;
            case 3:
                r = (l * 255) | 0;
                g = (m * 255) | 0;
                b = (v * 255) | 0;
                break;
            case 4:
                r = (n * 255) | 0;
                g = (l * 255) | 0;
                b = (v * 255) | 0;
                break;
            case 5:
                r = (v * 255) | 0;
                g = (l * 255) | 0;
                b = (m * 255) | 0;
                break;
        }

        return [r, g, b];
    },

    shiftHue(imageData, rotation) {
        for (let i = 0 ; i < imageData.data.length ; i += 4) {
            let [h, s, v] = this.rgb2hsv(
                imageData.data[i+0],
                imageData.data[i+1],
                imageData.data[i+2],
            );
            h = (h + rotation) % 360;
            let [r, g, b] = this.hsv2rgb(h, s, v);
            imageData.data[i+0] = r;
            imageData.data[i+1] = g;
            imageData.data[i+2] = b;
        }
    },

};
