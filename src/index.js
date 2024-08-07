import runTasks from './lib/md2html/index.js';

export default function run(options) {
  console.dir({options}, {depth: null});
  return runTasks(options);
};