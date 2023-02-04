const hueShiftWASM = {
    allocBuffer: Module.cwrap("allocBuffer", "number", ["number"]),
    freeBuffer: Module.cwrap("freeBuffer", "", ["number"]),
    shiftHue: Module.cwrap("shiftHue", "", ["number", "number", "number", "number"]),
    sharedBuffer_p: null,
};

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

// Same as previous function but without the malloc() / free()
function runWASM2(canvas, rotation) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    Module.HEAP8.set(imageData.data, hueShiftWASM.sharedBuffer_p);
    hueShiftWASM.shiftHue(
        hueShiftWASM.sharedBuffer_p, imageData.width, imageData.height, rotation
    );
    imageData.data.set(new Uint8Array(
        Module.HEAP8.buffer, hueShiftWASM.sharedBuffer_p, imageData.data.length
    ));

    ctx.putImageData(imageData, 0, 0);
}

function drawImageToCanvas(image, canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
}

function runBenchmark(image, canvas) {
    let runs = 360;
    const wasmDusrations = [];
    const wasm2Dusrations = [];

    hueShiftWASM.sharedBuffer_p = hueShiftWASM.allocBuffer(
        image.width * image.height * 4
    );

    function _updateTable() {
        document.getElementById("wasm-min").innerText = Math.round(Math.min(...wasmDusrations));
        document.getElementById("wasm-max").innerText = Math.round(Math.max(...wasmDusrations));
        document.getElementById("wasm-avg").innerText = Math.round(
            wasmDusrations.reduce((a, b) => a + b, 0) / wasmDusrations.length
        );

        document.getElementById("wasm2-min").innerText = Math.round(Math.min(...wasm2Dusrations));
        document.getElementById("wasm2-max").innerText = Math.round(Math.max(...wasm2Dusrations));
        document.getElementById("wasm2-avg").innerText = Math.round(
            wasm2Dusrations.reduce((a, b) => a + b, 0) / wasm2Dusrations.length
        );

        document.getElementById("runs-count").innerText = Math.max(
            wasmDusrations.length, wasm2Dusrations.length
        );
    }

    function _updateCsv() {
        const csvTextarea = document.getElementById("raw-results-csv");
        let csv = "Run;WASM;WASM (shared buffer);\n"
        for (let i = 0; i < wasm2Dusrations.length; i += 1) {
            csv += `${i+1};${wasmDusrations[i]};${wasm2Dusrations[i]};\n`;
        }
        csvTextarea.innerHTML = csv;
    }

    function _run() {
        drawImageToCanvas(image, canvas);

        // WebAssembly run
        const wasmStartTime = performance.now();
        runWASM(canvas, runs);
        const wasmEndTime = performance.now();
        wasmDusrations.push(wasmEndTime - wasmStartTime);

        // WebAssembly run
        const wasm2StartTime = performance.now();
        runWASM2(canvas, runs);
        const wasm2EndTime = performance.now();
        wasm2Dusrations.push(wasm2EndTime - wasm2StartTime);

        _updateTable();

        // Loop
        runs -= 1;
        if (runs > 0) {
            setTimeout(_run, 0);
        } else {
            hueShiftWASM.freeBuffer(hueShiftWASM.sharedBuffer_p);
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
