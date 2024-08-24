import extractor from 'front-matter';
import path from 'node:path';
import type { Content } from '../../../types/content.js';
import type { Opts } from '../../../types/opts.js';

const matter = (typeof extractor == 'function') ? extractor : (str) => { return { attributes: {}, body: '' } };

export default class Page {
  srcpath: string;
  destpath: string;
  route: string;
  toc: any;
  footnotes: any;
  raw: string;
  head: object;
  body: string;

  constructor(srcpath: string, raw: string, opts: Opts) {
    const { pages: srcdir, site: destdir } = opts.dir;
    this.destpath = srcpath2destpath(srcpath, srcdir, destdir)
    this.route = prettyUrl(this.destpath, destdir);
    this.srcpath = srcpath;
    this.raw = raw;
    
    const { attributes, body } = matter(this.raw);
    this.head = attributes || {};
    this.body = body;
  }

  getContent(): Content {
    return {
      head: this.head,
      body: this.body,
    };
  }
}

const srcpath2destpath = (srcpath: string, srcdir: string, destdir: string): string => {
  let outpath = path.join(destdir, srcpath.slice(srcdir.length));
  if (outpath.endsWith('.md')) {
    outpath = outpath.replace(/\.md$/, '.html');
    if (!outpath.endsWith('index.html')) {
      outpath = outpath.replace(/\.html$/, '/index.html');
    }
  }
  return outpath;
};

const prettyUrl = (filepath: string, rootdir: string): string => {
  const resolvedFilePath = path.resolve(rootdir, filepath);
  const resolvedRootDir = path.resolve(rootdir);

  let relativePath = path.relative(resolvedRootDir, resolvedFilePath);
  relativePath = relativePath.replace(/\\/g, '/');

  if (!relativePath.endsWith('.html')) {
    return '/' + relativePath;
  }

  let route = '/' + relativePath.replace(/(^|\/)index\.html$/, '');

  if (route.endsWith('.html')) {
    route = route.slice(0, -5);
  }

  if (route !== '/' && route.endsWith('/')) {
    route = route.slice(0, -1);
  }

  return route;
}