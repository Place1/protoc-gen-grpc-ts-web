#!/usr/bin/env node

import { CodeGeneratorRequest, CodeGeneratorResponse } from 'google-protobuf/google/protobuf/compiler/plugin_pb';
import { Stream } from 'stream';
import { createContext } from './codegen/context';
import { codegen } from './codegen/file';

async function main() {
  if (process.stdin.isTTY) {
    throw new Error('stdin is a TTY: this is the protoc plugin not the CLI program');
  }

  const bytes = bufferToBytes(await readAll(process.stdin));
  const codeGenRequest = CodeGeneratorRequest.deserializeBinary(bytes);
  const codeGenResponse = new CodeGeneratorResponse();

  const context = createContext(codeGenRequest.getProtoFileList());

  for (const protofile of codeGenRequest.getProtoFileList()) {
    codeGenResponse.addFile(codegen(context, protofile));
  }

  process.stdout.write(Buffer.from(codeGenResponse.serializeBinary().buffer));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function readAll(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const buffer = Array<any>();
    stream.on('data', (chunk) => buffer.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buffer)));
    stream.on('error', (err) => reject(err));
  });
}

function bufferToBytes(buffer: Buffer): Uint8Array {
  const bytes = new Uint8Array(buffer.length);
  bytes.set(buffer);
  return bytes;
}
