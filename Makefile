OUT="bin"
BINARY="protoc-gen-grpc-ts-web"
PLATFORMS=darwin linux windows
ARCHITECTURES=amd64

build:
	go build -o $(OUT)/$(BINARY) .

release: clean
	mkdir -p $(OUT)
	$(foreach GOOS, $(PLATFORMS),\
	$(foreach GOARCH, $(ARCHITECTURES), $(shell export GOOS=$(GOOS); export GOARCH=$(GOARCH); go build -o $(OUT)/$(BINARY)-$(GOOS)-$(GOARCH))))
	rm -r npm/bin/ || true
	cp -r $(OUT)/ npm/$(OUT)/

test: build
	mkdir -p $(OUT)
	protoc --grpc-ts-web_out=$(OUT) --plugin=protoc-gen-grpc-ts-web ./e2e/example.proto

clean:
	rm -r $(OUT) || true
	rm -rf npm/$(OUT)

publish:
	cd npm && npm publish
