import path from 'node:path';
const defaultOpts = {
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
        glob: '**/*.{md,xml,json}',
        ignore: ['**/.*']
    },
    filters: {}
};
export default async function opts(options = {}) {
    const mergedOpts = mergeObjectsRecursive(defaultOpts, options);
    Object.keys(options.filters || {}).forEach(key => {
        mergedOpts.filters[key] = options.filters[key];
    });
    for (const dirKey of ['data', 'pages', 'site']) {
        mergedOpts.dir[dirKey] = path.normalize(mergedOpts.dir[dirKey]);
        if (!path.isAbsolute(mergedOpts.dir[dirKey])) {
            mergedOpts.dir[dirKey] = path.resolve(mergedOpts.dir[dirKey]);
        }
    }
    return Promise.resolve(mergedOpts);
}
function mergeObjectsRecursive(defaults, options) {
    function mergeRecursive(defaults, options) {
        for (const key in defaults) {
            if (typeof defaults[key] === 'object' && defaults[key] !== null) {
                if (key in options && typeof options[key] === 'object' && options[key] !== null) {
                    mergeRecursive(defaults[key], options[key]);
                }
                else if (key in options) {
                    defaults[key] = options[key];
                }
            }
            else {
                if (key in options) {
                    defaults[key] = options[key];
                }
            }
        }
    }
    const defaultsCopy = JSON.parse(JSON.stringify(defaults));
    mergeRecursive(defaultsCopy, options);
    return defaultsCopy;
}
