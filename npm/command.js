#!/usr/bin/env node

const program = require('commander');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function spawnAsync(cmd, args) {
  return new Promise((resolve, reject) => {
    console.info(`executing: ${cmd} ${args.join(' ')}`)
    const p = spawn(cmd, args)
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on('exit', (code, signal) => {
      resolve();
    });
  });
}

function platform() {
  switch (process.platform) {
    case 'win32':
      return 'windows';
    default:
      return process.platform;
  }
}

const pluginPath = path.join(__dirname, `bin/protoc-gen-grpc-ts-web-${platform()}-amd64`);

program.arguments('<protos...>')
  .requiredOption('-o, --out <directory>', 'a directory to write the generated code to')
  .action((protos, options) => {
    if (!fs.existsSync(options.out)) {
      fs.mkdirSync(options.out);
    }
    const includes = protos
      .map(p => path.dirname(p))
      .map(p => `--proto_path=${p}`)
      .filter((value, index, self) => self.indexOf(value) === index);
    return spawnAsync('protoc', [
      '--grpc-ts-web_out',
      options.out,
      `--plugin=protoc-gen-grpc-ts-web=${pluginPath}`,
      ...includes,
      ...protos,
    ]);
  });

program.parse(process.argv);
