all: build

build:
	mkdir -p build/
	emcc hello.c -o build/hello.html
	emcc -sSINGLE_FILE hello.c -o build/hello.singlefile.html

clean:
	rm -rf build/*
