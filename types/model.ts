export interface Model extends Map<string, any> {
  get(key: 'pages'): Page;
}

export interface Page {
  [filepath: string]: {
    head: string;
    body: string;
  };
}