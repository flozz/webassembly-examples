#include <stdlib.h>
#include <emscripten.h>

#define uint8_t unsigned char

EMSCRIPTEN_KEEPALIVE uint8_t* allocBuffer(int size) {
    return malloc(size * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE void freeBuffer(uint8_t* buffer) {
    free(buffer);
}

EMSCRIPTEN_KEEPALIVE void threshold(uint8_t* pixels, int width, int height, int threshold) {
    // There is 4 canals in canvas image data (Red, Green, Blue, Alpha), so its
    // length is: width × height × 4
    int array_length = width * height * 4;

    // i = i + 4 as we loop over pixels, not over channels.
    for (int i = 0 ; i < array_length ; i += 4) {
        int red = pixels[i+0];
        int green = pixels[i+1];
        int blue = pixels[i+2];
        int brightness = 0.299 * red + 0.587 * green + 0.114 * blue;

        // If the computed brightness is under our threshold, the pixel is
        // black else, it is white.
        if (brightness < threshold) {
            pixels[i+0] = 0;
            pixels[i+1] = 0;
            pixels[i+2] = 0;
        } else {
            pixels[i+0] = 255;
            pixels[i+1] = 255;
            pixels[i+2] = 255;
        }
    }
}
