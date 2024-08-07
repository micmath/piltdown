import opts from '../../src/lib/md2html/opts.js';
import Model from '../../src/lib/mvc/model.js';
import loadData from '../../src/lib/md2html/data.js';

describe('loadData', () => {
  it('should create a Map of objects from reading a _data dir.', async () => {
    const options = await opts({
      dir: {
        data: './spec/fixtures/_data',
      },
      data: {
        glob: '**/*.json',
        ignore: ['**/ignoreme/*']
      }
    });
    
    const model = new Model(['data']);
    
    const returnValue = loadData(model, options);
    expect(returnValue).toBeInstanceOf(Promise);

    await returnValue;

    expect(typeof model.get('data')).toEqual('object');
    expect(Object.entries(model.get('data')).length).toEqual(3);
    
    const data = model.get('data');
    
    expect(typeof data['not/found']).toEqual('undefined');
    expect(typeof data['site']).toEqual('object');
    expect(typeof data['authors/alice']).toEqual('object');
    expect(typeof data['authors/bob']).toEqual('object');
    
    expect(data['site'].title).toEqual('My Awesome Site');
    expect(data['authors/alice'].name).toEqual('Alice Fakington');
    expect(data['authors/bob'].name).toEqual('Robert Fakington');
  });
});