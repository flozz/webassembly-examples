#include <stdlib.h>
#include <stdint.h>
#include <emscripten.h>

#define DEPTH 4

float max(float a, float b, float c) {
   return ((a > b)? (a > c ? a : c) : (b > c ? b : c));
}

float min(float a, float b, float c) {
   return ((a < b)? (a < c ? a : c) : (b < c ? b : c));
}

void rgb2hsv(uint8_t r, uint8_t g, uint8_t b, int* h, int* s, int* v) {
    float rf = (float) r / 255;
    float gf = (float) g / 255;
    float bf = (float) b / 255;

    float cmin = min(rf, gf, bf);
    float cmax = max(rf, gf, bf);

    // Hue
    if (cmax == cmin) {
        *h = 0;
    } else if (cmax == rf) {
        *h = (int) (60 * (gf - bf) / (cmax - cmin) + 360) % 360;
    } else if (cmax == gf) {
        *h = (int) (60 * (bf - rf) / (cmax - cmin) + 120);
    } else if (cmax == bf) {
        *h = (int) (60 * (rf - gf) / (cmax - cmin) + 240);
    }

    // Saturation
    if (cmax == 0) {
        *s = 0;
    } else {
        *s = (1 - cmin / cmax) * 100;
    }

    // Brightness
    *v = cmax * 100;
}

void hsv2rgb(int h, int s, int v, uint8_t* r, uint8_t* g, uint8_t* b) {
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
            *r = vf * 255;
            *g = n * 255;
            *b = l * 255;
            break;
        case 1:
            *r = m * 255;
            *g = vf * 255;
            *b = l * 255;
            break;
        case 2:
            *r = l * 255;
            *g = vf * 255;
            *b = n * 255;
            break;
        case 3:
            *r = l * 255;
            *g = m * 255;
            *b = vf * 255;
            break;
        case 4:
            *r = n * 255;
            *g = l * 255;
            *b = vf * 255;
            break;
        case 5:
            *r = vf * 255;
            *g = l * 255;
            *b = m * 255;
            break;
        }
}

EMSCRIPTEN_KEEPALIVE uint8_t* allocBuffer(int size) {
    return malloc(size * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE void freeBuffer(uint8_t* buffer) {
    free(buffer);
}

EMSCRIPTEN_KEEPALIVE void shiftHue(uint8_t* pixels, int width, int height, int rotation) {
    int h, s, v;
    for (int i = 0 ; i < width * height * DEPTH ; i += DEPTH) {
        rgb2hsv(pixels[i+0], pixels[i+1], pixels[i+2], &h, &s, &v);
        h = (h + rotation) % 360;
        hsv2rgb(h, s, v, &pixels[i+0], &pixels[i+1], &pixels[i+2]);
    }
}
