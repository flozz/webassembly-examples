# Benchmark 04 - Hue shift - Single function

Same as the first benchmark, but with everythng implemented as a single function.


## Files

Source files:

* `bench.js`: The code to run the benchmark.
* `image.jpg`: An image that will be modified by the JS and the WASM.
* `index.html`: The HTML page that host the benchmark.
* `lib.c`: The C version of the benchmarked functions.
* `lib.js`: The JavaScript version of the benchmarked functions.
* `Makefile`: The makefile to compile the WebAssembly part of the project.

Generated files:

* `build/lib.wasm.js`: The compiled version of the C code (contains both the WASM module and the JS glue code generated by Emscripted).


## Build this project

You will first need to install GNU Make and Emscripten. On Ubuntu this can be done with the following command:

    sudo apt install build-essential emscripten

Then, just run the make command:

    make


## Run the project

Serve files with an HTTP server and open the URI in your browser.

If you have Python installed you can run:

    make serve

Then open http://localhost:8000/


## Online Demo

* https://flozz.github.io/webassembly-examples/bench%2004%20-%20Hue%20shift%20-%20Single%20Function/index.html


## License

The `image.jpg` photo used in this example was taken by Jon Sullivan and is released into the public domain:

* https://commons.wikimedia.org/wiki/File:Limes_kiwis_berry_berries.jpg
