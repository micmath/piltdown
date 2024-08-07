import Model from '../../src/lib/mvc/model.js';

describe('Model', () => {
  let user;

  beforeEach(() => {
    user = new Model(['name', 'email']);
  });

  it('should initialize with specified fields', () => {
    expect(user.fields).toEqual(['name', 'email']);
  });

  it('should allow setting allowed fields', () => {
    user.set('name', {first: 'John', last: 'Doe'});
    user.set('email', 'john.doe@example.com');
    expect(user.get('name').first).toBe('John');
    expect(user.get('name').last).toBe('Doe');
    expect(user.get('email')).toBe('john.doe@example.com');
  });

  it('should throw Error when setting disallowed fields', () => {
    expect(() => user.set('age', 30)).toThrowError(Error, 'Field "age" is not allowed');
  });

  it('should not allow modifying the fields property directly', () => {
    const fields = user.fields;
    fields.push('age');
    expect(user.fields).toEqual(['name', 'email']);
  });

  it('should throw Error if fields parameter is not an array of strings', () => {
    expect(() => new Model('name')).toThrowError(Error, 'Fields must be an array of strings');
    expect(() => new Model([1, 2, 3])).toThrowError(Error, 'Fields must be an array of strings');
  });
});

