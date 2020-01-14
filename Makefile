build:
	go build .

test: build
	mkdir -p out
	protoc --grpc-ts-web_out=out --plugin=protoc-gen-grpc-ts-web ./e2e/example.proto

tmp:
	mkdir -p out_other
	protoc --js_out=import_style=commonjs:out_other ./e2e/example.proto

clean:
	rm -r out || true
	rm -r out_other || true
