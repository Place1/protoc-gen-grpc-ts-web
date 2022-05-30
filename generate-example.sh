#!/bin/bash
set -e

rm -r ./example/generated || true;
./dist/cjs/main.js ./example/example.proto -o ./example/generated
