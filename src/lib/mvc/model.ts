export default class Model extends Map<string, any> {
  #fields: string[];

  constructor(fields: string[]) {
    super();
    if (!Array.isArray(fields) || fields.some(field => typeof field !== 'string')) {
      throw new Error('Fields must be an array of strings');
    }
    this.#fields = fields;
  }

  get fields(): string[] {
    return this.#fields.slice(); // return copy to prevent modifying the original
  }

  set(key: string, value: any): this {
    if (!this.#fields.includes(key)) {
      throw new TypeError(`Field "${key}" is not allowed`);
    }
    return super.set(key, value);
  }
}