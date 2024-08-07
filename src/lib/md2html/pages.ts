import fg from 'fast-glob';
import path from 'node:path';
import fs from 'fs/promises';
import type Model from '../mvc/model.ts';
import Page from './page.js';
import type { Opts } from '../../../types/opts.ts';

export default async function loadPages(model: Model, opts: Opts): Promise<void> {
  const { dir, pages } = opts;
  const pagesPattern = path.join(dir.pages, pages.glob);
  
  try {
    const filepaths = await fg(pagesPattern, { ignore: pages.ignore });
    const pagePromises = filepaths.map(async (filepath): Promise<Page> => {
      const raw = await fs.readFile(filepath, 'utf-8');
      return new Page(filepath, raw, opts);
    });
    
    const loadedPages = await Promise.all(pagePromises);
    model.set('pages', loadedPages);
  } catch (error) {
    console.error('Error: loadPages', error);
    throw error;
  }
}
