import opts from '../../src/lib/md2html/opts.js';

describe('opts', () => {
  it('should return a promise.', async () => {
    const returnValue = opts();
    expect(returnValue).toBeInstanceOf(Promise);

    const result = await returnValue;
    expect(typeof result).toEqual('object');
  });

  it('should create an options object with all default values from nothing.', async () => {
    const result = await opts();

    // {
    //   dir: {
    //     data: '/Users/example/piltdown/_data',
    //     pages: '/Users/example/piltdown/_pages',
    //     site: '/Users/example/piltdown/_site'
    //   },
    //   data: { glob: '**/*.json', ignore: ['**/.*'] },
    //   pages: { glob: '**/*.md', ignore: ['**/.*'] }
    // }

    expect(typeof result).toEqual('object');
    expect(typeof result.dir).toEqual('object');
    expect(typeof result.data).toEqual('object');
    expect(typeof result.pages).toEqual('object');
    
    // all default values:
    expect(result.dir.pages.endsWith('_pages')).toBeTrue();
    expect(result.dir.site.endsWith('_site')).toBeTrue();
    expect(result.dir.data.endsWith('_data')).toBeTrue();
    expect(result.data.glob).toBe('**/*.json');
    expect(result.data.ignore).toEqual(['**/.*']);
    expect(result.pages.glob).toBe('**/*.md');
    expect(result.pages.ignore).toEqual(['**/.*']);
  });

  it('should create an options object with all default values from an empty object.', async () => {
    const result = await opts({});

    expect(typeof result).toEqual('object');
    expect(typeof result.dir).toEqual('object');
    expect(typeof result.data).toEqual('object');
    expect(typeof result.pages).toEqual('object');

    // all default values:
    expect(result.dir.pages.endsWith('_pages')).toBeTrue();
    expect(result.dir.site.endsWith('_site')).toBeTrue();
    expect(result.dir.data.endsWith('_data')).toBeTrue();
    expect(result.data.glob).toBe('**/*.json');
    expect(result.data.ignore).toEqual(['**/.*']);
    expect(result.pages.glob).toBe('**/*.md');
    expect(result.pages.ignore).toEqual(['**/.*']);
  });

  it('should create an options object with some default values from an configured object.', async () => {
    const result = await opts({
      extra: [ 'additional top-level stuff gets rejected' ],
      dir: {
        pages: '/tmp/files'
      },
      data: { glob: '**/*.data.json'},
      pages: { ignore: ['**/_*'] }
    });

    expect(typeof result).toEqual('object');
    expect(typeof result.dir).toEqual('object');
    expect(typeof result.data).toEqual('object');
    expect(typeof result.pages).toEqual('object');
    expect(result.extra).toBeUndefined();

    expect(result.dir.pages).toBe('/tmp/files');
    expect(result.dir.site.endsWith('/_site')).toBeTrue();
    expect(result.dir.data.endsWith('/_data')).toBeTrue();
    // some default values:
    expect(result.data).toEqual({ glob: '**/*.data.json', ignore: ['**/.*'] });
    expect(result.pages).toEqual({ glob: '**/*.md', ignore: ['**/_*'] });
  });
});