const images = {
    1024: {image: null, jsDurations: [], wasmDurations: []},
    768:  {image: null, jsDurations: [], wasmDurations: []},
    512:  {image: null, jsDurations: [], wasmDurations: []},
    256:  {image: null, jsDurations: [], wasmDurations: []},
    128:  {image: null, jsDurations: [], wasmDurations: []},
    64:   {image: null, jsDurations: [], wasmDurations: []},
    32:   {image: null, jsDurations: [], wasmDurations: []},
    16:   {image: null, jsDurations: [], wasmDurations: []},
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
    let runs = 360;
    const jsDurations = [];
    const wasmDurations = [];

    function _updateCsv() {
        const csvTextarea = document.getElementById("raw-results-csv");
        let csv = ""

        csv += "Run;";
        for (let size in images) {
            csv += `JS ${size};`;
            csv += `WASM ${size};`;
        }
        csv += "\n";

        for (let i = 0; i < images[1024].jsDurations.length; i += 1) {
            csv += `${i};`;
            for (let size in images) {
                csv += `${images[size].jsDurations[i]};`;
                csv += `${images[size].wasmDurations[i]};`;
            }
            csv += "\n";
        }

        csvTextarea.innerHTML = csv;
    }

    function _run() {
        for (size in images) {
            drawImageToCanvas(images[size].image, canvas);

            // JavaScript run
            const jsStartTime = performance.now();
            runJS(canvas, runs);
            const jsEndTime = performance.now();
            images[size].jsDurations.push(jsEndTime - jsStartTime);

            // WebAssembly run
            const wasmStartTime = performance.now();
            runWASM(canvas, runs);
            const wasmEndTime = performance.now();
            images[size].wasmDurations.push(wasmEndTime - wasmStartTime);
        }

        document.getElementById("runs-count").innerText = images[1024].jsDurations.length;

        // Loop
        runs -= 1;
        if (runs > 0) {
            setTimeout(_run, 0);
        } else {
            _updateCsv();
        }
    }

    _run();
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
