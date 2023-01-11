const API = {
    allocBuffer: Module.cwrap("allocBuffer", "number", ["number"]),
    freeBuffer: Module.cwrap("freeBuffer", "", ["number"]),
    threshold: Module.cwrap("threshold", "", ["number", "number", "number", "number"]),
};

function thresholdImageOnCanvas(image, canvas, threshold=127) {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const pixels_p = API.allocBuffer(imageData.data.length);
    Module.HEAP8.set(imageData.data, pixels_p);
    API.threshold(pixels_p, imageData.width, imageData.height, threshold);
    imageData.data.set(new Uint8Array(Module.HEAP8.buffer, pixels_p, imageData.data.length));

    ctx.putImageData(imageData, 0, 0);

    API.freeBuffer(pixels_p);
}

function onThresholdChanged(event) {
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

    thresholdRange.addEventListener("input", onThresholdChanged);

    Module.onRuntimeInitialized = function() {
        thresholdImageOnCanvas(image, canvas);
    };
}

window.onload = main;
