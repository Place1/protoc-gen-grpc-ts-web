package main

import (
	"flag"
	"io/ioutil"
	"log"
	"os"

	"github.com/place1/protoc-gen-grpc-ts-web/templates"

	"github.com/golang/protobuf/proto"
	plugin "github.com/golang/protobuf/protoc-gen-go/plugin"
	"github.com/pkg/errors"
)

var input = flag.String("code-generator-request", "", "A path to a protobuf encoded CodeGeneratorRequest")

func main() {
	flag.Parse()

	reader := os.Stdin
	if *input != "" {
		f, err := os.OpenFile(*input, os.O_RDONLY, 0)
		if err != nil {
			log.Fatal(errors.Wrap(err, "failed to read code-generator-request file"))
		}
		defer f.Close()
		reader = f
	}

	data, err := ioutil.ReadAll(reader)
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
