import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'node:path';
import type Model from '../mvc/model.ts';
import type { Opts } from '../../../types/opts.ts';

export default async function loadData(model: Model, opts: Opts): Promise<void> {
  const dirData:string = opts.dir.data;
  const relativePattern:string = opts.data.glob;
  const ignore:string[] = opts.data.ignore;

  const fullPattern = path.join(dirData, relativePattern);
  const found = await fg(fullPattern, { 'ignore': ignore });
  const result: { [key: string]: any } = {};

  for (const file of found) {
    const key = path.relative(dirData, file).replace(path.extname(file), '');
    const content = await fs.readFile(file, 'utf-8');
    const parsedJson = JSON.parse(content);
    result[key] = parsedJson;
  }

  model.set('data', result);
}
