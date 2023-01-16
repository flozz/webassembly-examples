all: build

.PHONY: build
build:
	mkdir -p build/
	emcc \
		-sSINGLE_FILE \
		-s"EXPORTED_RUNTIME_METHODS=['ccall']" \
		example.c \
		-o build/example.wasm.js

clean:
	rm -rf build/*
