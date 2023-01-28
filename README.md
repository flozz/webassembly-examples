# WebAssembly Examples

This repository contains WebAssembly examples for an article I published on my blog (French):

* https://blog.flozz.fr/2023/01/21/petite-introduction-a-webassembly/


## Examples

| Name                                                            | Description                                                          | Online Demo                                                                                      |
|-----------------------------------------------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| [01 - Hello World](./01%20-%20Hello%20World/)                   | A simple "hello world" WebAssembly program                           | [Demo](https://flozz.github.io/webassembly-examples/01%20-%20Hello%20World/build/hello.html)     |
| [02 - Function Call](./02%20-%20Function%20Call/)               | How to call WebAssembly functions from JavaScript                    | [Demo](https://flozz.github.io/webassembly-examples/02%20-%20Function%20Call/index.html)         |
| [03 - Pointers and Arrays](./03%20-%20Pointers%20and%20Arrays/) | how to use pointers and how to pass arrays to a WebAssembly function | [Demo](https://flozz.github.io/webassembly-examples/03%20-%20Pointers%20and%20Arrays/index.html) |


## Benchmarks

| Name                                                                                          | Description                                                                                                 | Online Version                                                                                                       |
|-----------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| [bench 01 - Hue shift](./bench%2001%20-%20Hue%20shift/)                                       | Mesure the speed difference between a pure JavaScrupt and a WebAssembly versions of a hue shift on a canvas | [Online](https://flozz.github.io/webassembly-examples/bench%2001%20-%20Hue%20shift/index.html)                       |
| [bench 02 - Hue shift - Shared buffer](./bench%2002%20-%20Hue%20shift%20-%20Shared%20buffer/) | Mesure the impact on the speed of the memory allocation calls                                               | [Online](https://flozz.github.io/webassembly-examples/bench%2002%20-%20Hue%20shift%20-%20Shared%20buffer/index.html) |
| [bench 03 - Hue shift - Image size](./bench%2003%20-%20Hue%20shift%20-%20Image%20size/)       | Mesure the impact on the speed gain of the quantity of data passed to WASM                                  | [Online](https://flozz.github.io/webassembly-examples/bench%2003%20-%20Hue%20shift%20-%20Image%20size/index.html)    |

## License

The examples in this repository are licensed under WTFPL unless otherwise stated:

```
        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```
