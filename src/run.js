#!/usr/bin/env node

// example: node src/run.js -d ./spec/fixtures/_data -p ./spec/fixtures/_pages -s ./spec/fixtures/_site && echo 'OK'

import { program as cmd } from 'commander';
import runTasks from './lib/md2html/index.js';
import { performance } from 'node:perf_hooks';

const startTime = performance.now();

cmd
  .option('-d, --data <path>', 'path to data directory', './_data')
  .option('-p, --pages <path>', 'path to pages directory', './_pages')
  .option('-s, --site <path>', 'path to site directory', './_site')
  .option('-dg, --dataGlob <pattern>', 'glob pattern to match data files', '**/*.json')
  .option('-di, --dataIgnore <pattern>', 'glob pattern to ignore data files', '**/.*')
  .option('-pg, --pagesGlob <path>', 'glob pattern to match pages files', '**/*.md')
  .option('-pi, --pagesIgnore <pattern>', 'glob pattern to ignore pages files', '**/.*');

cmd.parse(process.argv);

const options = cmd.opts(); // from CLI arguments

console.log(`> running with options: ${JSON.stringify(options, null, 2)}`);

const progress = runTasks({
  pages: {
    glob: options.pagesGlob,
    ignore: options.pagesIgnore
  },
  data: {
    glob: options.dataGlob,
    ignore: options.dataIgnore
  },
  dir: {
    data: options.data,
    pages: options.pages,
    site: options.site
  }
});

//for example:
// progress.on('pages:written', () => {
//   console.log(`> all pages written`);
// });

progress.on('done', () => {
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  console.log(`> done (elapsed time ${totalTime.toFixed(2)}ms)`);
  process.exit(0);
});

progress.on('error', (error) => {
  console.error('> error', error);
  process.exit(1);
});
