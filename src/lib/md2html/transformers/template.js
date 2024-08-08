import vento from 'ventojs';
const env = vento();
env.cache.clear();
const cwd = process.cwd();
export default async function template(model, opts) {
    env.filters = opts.filters;
    const pages = model.get('pages');
    const l = pages.length;
    for (let i = 0; i < l; i++) {
        if (pages[i].head && pages[i].head.hasOwnProperty('layout')) {
            pages[i].body = `{{ layout "${pages[i].head['layout']}" }}${pages[i].body}{{ /layout }}`;
        }
        try {
            const result = await env.runString(pages[i].body, { cwd, pages, page: pages[i].head, data: model.get('data'), toc: pages[i].toc, footnotes: pages[i].footnotes, route: pages[i].route });
            pages[i].body = result.content;
        }
        catch (e) {
            console.error(pages[i], e);
        }
    }
    Promise.resolve();
}
