import type Model from '../mvc/model.ts';
import type { Opts } from '../../../types/opts.ts';
import remark from './transformers/remark.js';
import template from './transformers/template.js';
import typography from './transformers/typography.js';

export default async function transformPages(model: Model, opts: Opts): Promise<void> {
  const transformers = [remark, template, typography];
  for (let transformer of transformers) {
    await transformer(model, opts);
  }
  return Promise.resolve();
}