import remark from './transformers/remark.js';
import template from './transformers/template.js';
import typography from './transformers/typography.js';
export default async function transformPages(model, opts) {
    const transformers = [remark, template, typography];
    for (let transformer of transformers) {
        await transformer(model, opts);
    }
    return Promise.resolve();
}
