interface FilterFunction {
  (...args: any[]): string;
}

export interface Opts {
  dir: {
    data: string;
    pages: string;
    site: string;
  };
  data: {
    glob: string; // no string[]
    ignore: string[];
  };
  pages: {
    glob: string;  // no string[]
    ignore: string[];
  };
  filters: {
    [name: string]: FilterFunction;
  };
}
