all: build

.PHONY: build
build:
	mkdir -p build/
	emcc \
		-O3 \
		-sSINGLE_FILE lib.c \
		-s"EXPORTED_RUNTIME_METHODS=['cwrap','ccall']" \
		-o build/lib.wasm.js

serve:
	python3 -m http.server

clean:
	rm -rf build/*
