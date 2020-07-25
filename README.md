# GRPC TS Web

A protoc plugin for generating browser compatible GRPC clients in Typescript.

Why use this plugin instead of [protoc-gen-grpc-web](https://github.com/grpc/grpc-web)? This plugin improves on ergonomics in a number of ways:

- emits typescript files only (no .js or .d.ts files)
- unary methods based on Promises and JSON objects rather than callbacks and message classes
- uses the same `google-protobuf` runtime library and is compatible with it's well-known types

## Installation

```bash
npm install --save grpc-ts-web
```

## Usage

If you've installed the npm package you can run the following command to generate
a Typescript GRPC client from a set of proto files.

```bash
# using the npm command
./node_modules/.bin/grpc-ts-web -o ./out ./path/to/protos/**/*.proto
```

If you'd like to invoke protoc yourself using this plugin then you can use the following command
instead where `<platform>` is one of linux, darwin or windows.

```bash
# using protoc directly
protoc --plugin=protoc-gen-grpc-ts-web=./node_modules/.bin/protoc-gen-grpc-ts-web-<platform>-amd64 --grpc-ts-web_out ./sdk
```

## Example Output

You can see an example of the emitted code here in the [example directory](https://github.com/Place1/protoc-gen-grpc-ts-web/tree/master/example).

```typescript
import { Metadata } from 'grpc-web';
import { UserService } from './example_pb';

// hostname of the grpc-web server
const hostname = window.location.origin;

// a callback to add default metadata
// on each grpc request
function metadata(): Metadata {
  return {};
}

async function main() {
  // create an instance of the generated
  // UserService client
  const client = new UserService(hostname, metadata)

  // unary calls return promises so that
  // you can use async/await
  // calls also take simple json objects
  // no more `new Message()` and `message.setField()`
  // everywhere!
  const user = await client.addUser({
    name: 'hello world',
  });

  // response messages are json objects
  console.log(user.id);
  console.log(user.name);
  console.log(user.createDate);
}
```
