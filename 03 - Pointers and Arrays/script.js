// Bindings of the WASM exported functions
const API = {
    allocBuffer: Module.cwrap("allocBuffer", "number", ["number"]),
    freeBuffer: Module.cwrap("freeBuffer", "", ["number"]),
    threshold: Module.cwrap("threshold", "", ["number", "number", "number", "number"]),
};

function thresholdImageOnCanvas(image, canvas, threshold=127) {
    // Get the 2D context of the canvas.
    const ctx = canvas.getContext("2d");

    // Draw the original image on the canvas.
    ctx.drawImage(image, 0, 0);

    // Get the pixels that compose the canvas.
    //
    // The imageData object contains:
    //
    // {
    //     width: ...,
    //     height: ...,
    //     data: [red1, green1, blue1, alpha1, red2, green2, blue2, alpha2, …]
    //     //     ---------------------------  ---------------------------
    //     //         PIXEL 1 (top-left)                 PIXEL 2
    // }
    //
    // NOTE: `imageData.data` is an Uint8ClampedArray.
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Allocate a buffer that will contain our pixels in the WASM Module.
    //
    // `pixel_p` is a pointer to that buffer (in the JavaScript world, it is
    // simply a number).
    const pixels_p = API.allocBuffer(imageData.data.length);

    // Copy the pixels into the allocated buffer.
    //
    // `Module.HEAP8` is an Uint8Array that represents the "RAM" (heap) of the
    // WASM Module. The pixel_p pointer is simply an offset on this array.
    Module.HEAP8.set(imageData.data, pixels_p);

    // Call the WASM function that performs the operations on the pixels
    API.threshold(pixels_p, imageData.width, imageData.height, threshold);

    // Copy-back the modified pixels in the imageData.
    imageData.data.set(new Uint8Array(
        Module.HEAP8.buffer, pixels_p, imageData.data.length
    ));

    // Put-back the pixels in the canvas.
    ctx.putImageData(imageData, 0, 0);

    // Free the allocated buffer.
    API.freeBuffer(pixels_p);
}

function onThresholdInput(event) {
    const image = document.getElementById("image");
    const canvas = document.getElementById("canvas");
    const thresholdRange = this;

    thresholdImageOnCanvas(image, canvas, parseInt(thresholdRange.value, 10));
}

function main() {
    const image = document.getElementById("image");
    const canvas = document.getElementById("canvas");
    const thresholdRange = document.getElementById("threshold");

    canvas.width = image.width;
    canvas.height = image.height;

    thresholdRange.addEventListener("input", onThresholdInput);

    // Run the function once when the WASM module is initialized
    Module.onRuntimeInitialized = function() {
        thresholdImageOnCanvas(image, canvas);
    };
}

window.onload = main;
