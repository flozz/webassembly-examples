#include <stdlib.h>
#include <stdint.h>
#include <emscripten.h>

#define DEPTH 4

#define max(a, b, c) ((a > b)? (a > c ? a : c) : (b > c ? b : c))
#define min(a, b, c) ((a < b)? (a < c ? a : c) : (b < c ? b : c))

EMSCRIPTEN_KEEPALIVE uint8_t* allocBuffer(int size) {
    return malloc(size * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE void freeBuffer(uint8_t* buffer) {
    free(buffer);
}

EMSCRIPTEN_KEEPALIVE void shiftHue(uint8_t* pixels, int width, int height, int rotation) {
    for (int i = 0 ; i < width * height * DEPTH ; i += DEPTH) {
        int r = pixels[i+0];
        int g = pixels[i+1];
        int b = pixels[i+2];

        int h, s, v;

        // =============================
        // rgb -> hsv
        // =============================

        float rf = (float) r / 255;
        float gf = (float) g / 255;
        float bf = (float) b / 255;

        float cmin = min(rf, gf, bf);
        float cmax = max(rf, gf, bf);

        // Hue
        if (cmax == cmin) {
            h = 0;
        } else if (cmax == rf) {
            h = (int) (60 * (gf - bf) / (cmax - cmin) + 360) % 360;
        } else if (cmax == gf) {
            h = (int) (60 * (bf - rf) / (cmax - cmin) + 120);
        } else if (cmax == bf) {
            h = (int) (60 * (rf - gf) / (cmax - cmin) + 240);
        }

        // Saturation
        if (cmax == 0) {
            s = 0;
        } else {
            s = (1 - cmin / cmax) * 100;
        }

        // Brightness
        v = cmax * 100;

        // =============================
        // Hue shift
        // =============================

        h = (h + rotation) % 360;

        // =============================
        // hsv -> rgb
        // =============================

        h = h % 360;
        float sf = (float) s / 100;
        float vf = (float) v / 100;

        int ti = (h / 60) % 6;
        float f = (float) h / 60 - ti;
        float l = vf * (1 - sf);
        float m = vf * (1 - f * sf);
        float n = vf * (1 - (1 - f) * sf);

        switch (ti) {
            case 0:
                r = vf * 255;
                g = n * 255;
                b = l * 255;
                break;
            case 1:
                r = m * 255;
                g = vf * 255;
                b = l * 255;
                break;
            case 2:
                r = l * 255;
                g = vf * 255;
                b = n * 255;
                break;
            case 3:
                r = l * 255;
                g = m * 255;
                b = vf * 255;
                break;
            case 4:
                r = n * 255;
                g = l * 255;
                b = vf * 255;
                break;
            case 5:
                r = vf * 255;
                g = l * 255;
                b = m * 255;
                break;
        }

        // =============================
        // put back pixels
        // =============================

        pixels[i+0] = r;
        pixels[i+1] = g;
        pixels[i+2] = b;
    }
}
