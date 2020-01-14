package main

import (
	"io/ioutil"
	"log"
	"os"

	"github.com/place1/protoc-gen-grpc-ts-web/templates"

	"github.com/golang/protobuf/proto"
	plugin "github.com/golang/protobuf/protoc-gen-go/plugin"
	"github.com/pkg/errors"
)

func main() {
	data, err := ioutil.ReadAll(os.Stdin)
	// data, err := ioutil.ReadFile("example-stdin.bin")
	if err != nil {
		log.Fatal(errors.Wrap(err, "reading input"))
	}

	req := &plugin.CodeGeneratorRequest{}
	if err := proto.Unmarshal(data, req); err != nil {
		log.Fatal(errors.Wrap(err, "bad codegen request"))
	}

	depLookupTable := templates.NewDependencyLookupTable(req)

	res := &plugin.CodeGeneratorResponse{}
	for _, f := range req.ProtoFile {
		if err != nil {
			log.Fatal(errors.Wrap(err, "failed to generate output file"))
		}
		res.File = append(res.File, templates.NewFile(f, depLookupTable)...)
	}

	out, err := proto.Marshal(res)
	if err != nil {
		log.Fatal(errors.Wrap(err, "failed to marshal codegen response"))
	}
	os.Stdout.Write(out)
}
