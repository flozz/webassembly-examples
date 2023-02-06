const images = {
    1024: {image: null},
    768:  {image: null},
    512:  {image: null},
    256:  {image: null},
    128:  {image: null},
    64:   {image: null},
    32:   {image: null},
    16:   {image: null},
};

const hueShiftWASM = {
    allocBuffer: Module.cwrap("allocBuffer", "number", ["number"]),
    freeBuffer: Module.cwrap("freeBuffer", "", ["number"]),
    shiftHue: Module.cwrap("shiftHue", "", ["number", "number", "number", "number"]),
};

function runJS(canvas, rotation) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    hueShiftJS.shiftHue(imageData, rotation);
    ctx.putImageData(imageData, 0, 0);

}

function runWASM(canvas, rotation) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const buffer_p = hueShiftWASM.allocBuffer(imageData.data.length)
    Module.HEAP8.set(imageData.data, buffer_p);
    hueShiftWASM.shiftHue(buffer_p, imageData.width, imageData.height, rotation);
    imageData.data.set(new Uint8Array(
        Module.HEAP8.buffer, buffer_p, imageData.data.length
    ));

    ctx.putImageData(imageData, 0, 0);
    hueShiftWASM.freeBuffer(buffer_p);
}

function loadImage(uri) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve.bind(null, image);
        image.onerror = reject;
        image.src = uri;
    });
}

function loadBenchImages() {
    const promises = [];
    for (const size in images) {
        promises.push(
            loadImage(`./images/image_${size}.jpg`)
                .then(((size, image) => { images[size].image = image}).bind(null, size))
        );
    }
    return Promise.all(promises);
}

function drawImageToCanvas(image, canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
}

function runBenchmark(canvas) {
    const RUNS = 200;
    const csvTextarea = document.getElementById("raw-results-csv");
    csvTextarea.innerHTML = "Image size;JS;WASM;\n"

    // Warmup
    for (let i = 0 ; i < 10 ; i++) {
        runJS(canvas, i);
        runWASM(canvas, i);
    }

    function _run(imageSize) {
        return new Promise((resolve, reject) => {
            drawImageToCanvas(images[imageSize].image, canvas);

            // JS runs
            const jsStartTime = performance.now();
            for (let i = 0 ; i < RUNS ; i += 1) {
                runJS(canvas, i * 10 % 360);
            }
            const jsEndTime = performance.now();

            // WASM runs
            const wasmStartTime = performance.now();
            for (let i = 0 ; i < RUNS ; i += 1) {
                runWASM(canvas, i * 10 % 360);
            }
            const wasmEndTime = performance.now();

            const jsAvgDuration = (jsEndTime - jsStartTime) / RUNS
            const wasmAvgDuration = (wasmEndTime - wasmStartTime) / RUNS
            csvTextarea.innerHTML += `${imageSize};${jsAvgDuration};${wasmAvgDuration};\n`;

            // Let the event loop run to avoid blocking the thread
            setTimeout(resolve, 0);
        });
    }

    let promise = Promise.resolve();

    for (let imageSize in images) {
        promise = promise.then(_run.bind(null, imageSize));
    }
}

function main() {
    const canvas = document.getElementById("canvas");
    const runButton = document.getElementById("run");

    loadBenchImages()
        .then(() => runButton.disabled = false)
        .then(() => drawImageToCanvas(images[1024].image, canvas))
        .catch(alert);

    runButton.onclick = function() {
    runButton.disabled = true;
        runBenchmark(canvas);
    }
}

window.onload = main;
