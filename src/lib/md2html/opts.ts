import path from 'node:path';
import type { Opts } from '../../../types/opts.ts';

const defaultOpts: Opts = {
  dir: {
    data: '_data',
    pages: '_pages',
    site: '_site'
  },
  data: {
    glob: '**/*.json',
    ignore: ['**/.*']
  },
  pages: {
    glob: '**/*.md',
    ignore: ['**/.*']
  },
  filters: {
  }
};

export default async function opts(options: Partial<Opts> = {}): Promise<Opts> {
  const mergedOpts = mergeObjectsRecursive(defaultOpts, options);
  Object.keys(options.filters || {}).forEach(key => {
    mergedOpts.filters[key] = options.filters[key];
  });

  // sanity: resolve all dir paths to absolute paths
  for (const dirKey of ['data', 'pages', 'site']) {
    mergedOpts.dir[dirKey] = path.normalize(mergedOpts.dir[dirKey]);
    if (!path.isAbsolute(mergedOpts.dir[dirKey])) {
      mergedOpts.dir[dirKey] = path.resolve(mergedOpts.dir[dirKey]);
    }
  }

  return Promise.resolve(mergedOpts);
}

function mergeObjectsRecursive(defaults: any, options: any): any {
  function mergeRecursive(defaults: any, options: any): void {
    for (const key in defaults) {
      if (typeof defaults[key] === 'object' && defaults[key] !== null) {
        if (key in options && typeof options[key] === 'object' && options[key] !== null) {
          mergeRecursive(defaults[key], options[key]);
        } else if (key in options) {
          defaults[key] = options[key];
        }
      } else {
        if (key in options) {
          defaults[key] = options[key];
        }
      }
    }
  }

  // create copy of defaults to avoid mutating the original object
  const defaultsCopy = JSON.parse(JSON.stringify(defaults));

  mergeRecursive(defaultsCopy, options);

  return defaultsCopy;
}
