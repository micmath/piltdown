import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'node:path';
export default async function loadData(model, opts) {
    const dirData = opts.dir.data;
    const relativePattern = opts.data.glob;
    const ignore = opts.data.ignore;
    const fullPattern = path.join(dirData, relativePattern);
    const found = await fg(fullPattern, { 'ignore': ignore });
    const result = {};
    for (const file of found) {
        const key = path.relative(dirData, file).replace(path.extname(file), '');
        const content = await fs.readFile(file, 'utf-8');
        const parsedJson = JSON.parse(content);
        result[key] = parsedJson;
    }
    model.set('data', result);
}
