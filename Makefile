build:
	go build .

test: build
	mkdir -p out
	protoc --ts-web_out=out --plugin=protoc-gen-ts-web --js_out=import_style=commonjs:out ./e2e/example.proto

tmp:
	mkdir -p out_other
	protoc --js_out=import_style=commonjs:out_other --grpc-web_out=import_style=typescript,mode=grpcwebtext:out_other --plugin=protoc-gen-grpc-web ./e2e/example.proto

clean:
	rm -r out || true
	rm -r out_other || true
