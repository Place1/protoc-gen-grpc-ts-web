#!/usr/bin/env node

import { Command } from 'commander';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function main() {
  const pluginPath = path.resolve(__dirname, 'plugin.js');

  const program = new Command();

  program
    .arguments('<protos...>')
    .requiredOption('-o, --out <directory>', 'a directory to write the generated code to')
    .action((protos: string[], options: any) => {
      if (!fs.existsSync(options.out)) {
        fs.mkdirSync(options.out);
      }
      const includes = protos
        .map((p) => path.dirname(p))
        .map((p) => `--proto_path=${p}`)
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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function spawnAsync(cmd: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    console.info(`executing: ${cmd} ${args.join(' ')}`);
    const p = spawn(cmd, args);
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on('exit', (code, signal) => {
      resolve();
    });
  });
}
