import vento from 'ventojs';
import Page from '../page.js';
import type Model from '../../mvc/model.ts';
import type { Opts } from '../../../../types/opts.ts';

const env = vento();
env.cache.clear();
const cwd = process.cwd();
export default async function template(model: Model, opts: Opts): Promise<void> {
  console.log(opts.filters);
  env.filters = opts.filters;
  console.log(env.filters);
  const pages: Array<Page> = model.get('pages');
  const l = pages.length;

  for (let i = 0; i < l; i++) {
    // wrap the page body in the layout template
    if (pages[i].head && pages[i].head.hasOwnProperty('layout')) {
      pages[i].body = `{{ layout "${pages[i].head['layout']}" }}${pages[i].body}{{ /layout }}`;
    }
    try {
      const result = await env.runString(
        pages[i].body,
        { cwd, pages, page: pages[i].head, data: model.get('data'), toc: pages[i].toc, footnotes: pages[i].footnotes, route: pages[i].route }
      );
      pages[i].body = result.content;
    } catch (e) {
      console.error(pages[i], e)
    }
  }
  Promise.resolve();
}