export default class Model extends Map {
    #fields;
    constructor(fields) {
        super();
        if (!Array.isArray(fields) || fields.some(field => typeof field !== 'string')) {
            throw new Error('Fields must be an array of strings');
        }
        this.#fields = fields;
    }
    get fields() {
        return this.#fields.slice();
    }
    set(key, value) {
        if (!this.#fields.includes(key)) {
            throw new TypeError(`Field "${key}" is not allowed`);
        }
        return super.set(key, value);
    }
}
