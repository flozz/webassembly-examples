function onSumButtonClicked(event) {
    const numAInput = document.getElementById("num-a");
    const numBInput = document.getElementById("num-b");
    const resultInput = document.getElementById("result");

    const numA = parseInt(numAInput.value, 10);
    const numB = parseInt(numBInput.value, 10);

    const result = Module.ccall(
        "sum",                  // The name of the WebAssembly function to call
        "number",               // Type of the value returned by the function
        ["number", "number"],   // Types of the parameters given to the function
        [numA, numB],           // The parameters passed to the function
    );

    resultInput.value = result;
}

function main() {
    const sumButton = document.getElementById("sum");
    sumButton.addEventListener("click", onSumButtonClicked);
}

window.onload = main;
