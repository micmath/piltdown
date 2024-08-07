import extractor from 'front-matter';
import path from 'node:path';
const matter = (typeof extractor == 'function') ? extractor : (str) => { return { attributes: {}, body: '' }; };
export default class Page {
    srcpath;
    destpath;
    route;
    toc;
    footnotes;
    raw;
    head;
    body;
    constructor(srcpath, raw, opts) {
        const { pages: srcdir, site: destdir } = opts.dir;
        this.destpath = srcpath2destpath(srcpath, srcdir, destdir);
        this.route = prettyUrl(this.destpath, destdir);
        this.srcpath = srcpath;
        this.raw = raw;
        const { attributes, body } = matter(this.raw);
        this.head = attributes || {};
        this.body = body;
    }
    getContent() {
        return {
            head: this.head,
            body: this.body,
        };
    }
}
const srcpath2destpath = (srcpath, srcdir, destdir) => {
    let outpath = path.join(destdir, srcpath.slice(srcdir.length));
    outpath = outpath.replace(/\.md$/, '.html');
    if (!outpath.endsWith('index.html')) {
        outpath = outpath.replace(/\.html$/, '/index.html');
    }
    return outpath;
};
const prettyUrl = (filepath, rootdir) => {
    const resolvedFilePath = path.resolve(rootdir, filepath);
    const resolvedRootDir = path.resolve(rootdir);
    let relativePath = path.relative(resolvedRootDir, resolvedFilePath);
    relativePath = relativePath.replace(/\\/g, '/');
    let route = '/' + relativePath.replace(/(^|\/)index\.html$/, '');
    if (route.endsWith('.html')) {
        route = route.slice(0, -5);
    }
    if (route !== '/' && route.endsWith('/')) {
        route = route.slice(0, -1);
    }
    return route;
};
