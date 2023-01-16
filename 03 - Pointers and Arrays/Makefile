all: build

.PHONY: build
build:
	mkdir -p build/
	emcc \
		-sSINGLE_FILE \
		-s"EXPORTED_RUNTIME_METHODS=['cwrap']" \
		example.c \
		-o build/example.wasm.js

serve:
	python3 -m http.server

clean:
	rm -rf build/*
