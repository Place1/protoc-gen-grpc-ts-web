OUT="bin"
BINARY="protoc-gen-grpc-ts-web"
PLATFORMS=darwin linux windows
ARCHITECTURES=amd64

build:
	echo "running build"
	go build -o $(OUT)/$(BINARY) .

release: clean
	echo "running release"
	mkdir -p $(OUT)
	$(foreach GOOS, $(PLATFORMS),\
	$(foreach GOARCH, $(ARCHITECTURES), $(shell export GOOS=$(GOOS); export GOARCH=$(GOARCH); go build -o $(OUT)/$(BINARY)-$(GOOS)-$(GOARCH))))
	rm -r npm/bin/ || true
	cp -r $(OUT)/ npm/$(OUT)/

test: build
	echo "running test"
	mkdir -p $(OUT)
	protoc --grpc-ts-web_out=$(OUT) --plugin=protoc-gen-grpc-ts-web ./e2e/example.proto

clean:
	echo "running clean"
	rm -r $(OUT) || true
	rm -rf npm/$(OUT) || true

publish:
	echo "running publish"
	cd npm && npm publish
