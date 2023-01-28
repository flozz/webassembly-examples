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

function drawImageToCanvas(image, canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
}

function runBenchmark(image, canvas) {
    let runs = 360;
    const jsDusrations = [];
    const wasmDusrations = [];

    function _updateTable() {
        document.getElementById("js-min").innerText = Math.round(Math.min(...jsDusrations));
        document.getElementById("js-max").innerText = Math.round(Math.max(...jsDusrations));
        document.getElementById("js-avg").innerText = Math.round(
            jsDusrations.reduce((a, b) => a + b, 0) / jsDusrations.length
        );

        document.getElementById("wasm-min").innerText = Math.round(Math.min(...wasmDusrations));
        document.getElementById("wasm-max").innerText = Math.round(Math.max(...wasmDusrations));
        document.getElementById("wasm-avg").innerText = Math.round(
            wasmDusrations.reduce((a, b) => a + b, 0) / wasmDusrations.length
        );

        document.getElementById("runs-count").innerText = Math.max(
            jsDusrations.length, wasmDusrations.length
        );
    }

    function _updateCsv() {
        const csvTextarea = document.getElementById("raw-results-csv");
        let csv = "Run;JS;WASM;\n"
        for (let i = 0; i < jsDusrations.length; i += 1) {
            csv += `${i+1};${jsDusrations[i]};${wasmDusrations[i]};\n`;
        }
        csvTextarea.innerHTML = csv;
    }

    function _run() {
        drawImageToCanvas(image, canvas);

        // JavaScript run
        const jsStartTime = performance.now();
        runJS(canvas, runs);
        const jsEndTime = performance.now();
        jsDusrations.push(jsEndTime - jsStartTime);

        // WebAssembly run
        const wasmStartTime = performance.now();
        runWASM(canvas, runs);
        const wasmEndTime = performance.now();
        wasmDusrations.push(wasmEndTime - wasmStartTime);

        _updateTable();

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
    const image = document.getElementById("image");
    const canvas = document.getElementById("canvas");
    const runButton = document.getElementById("run");

    drawImageToCanvas(image, canvas);

    runButton.onclick = function() {
        runBenchmark(image, canvas);
    }
}

window.onload = main;
