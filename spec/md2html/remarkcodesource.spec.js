import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { remarkCodeSource } from '../../src/lib/md2html/transformers/plugins/remarkcodesource.js';
import fs from "fs/promises";

const cwd = process.cwd();

describe("remarkCodeSource", () => {
  beforeEach(() => {
    const mockFileSystem = new Map();
    mockFileSystem.set(
      `${cwd}/demos/example1.js`,
      '\nfunction x(foo) {\n  console.log(foo);\n}\n'
    );
    mockFileSystem.set(
      `${cwd}/demos/example2.css`,
      `*,
*::before,
*::after {
  box-sizing: inherit
}

img,
video {
  height: auto;
  max-width: 100%
}

iframe {
  border: 0
}
`
    );
    mockFileSystem.set(
      `${cwd}/demos/example3.md`,
      "%mdinclude(demos/include-nested2.md)"
    );
    mockFileSystem.set(
      `${cwd}/demos/example4.md`,
      "I am nested!"
    );
    mockFileSystem.set(
      `${cwd}/demos/example5.md`,
      "%mdinclude( demos/include-circular2.md )"
    );
    mockFileSystem.set(
      `${cwd}/demos/example6.md`,
      "%mdinclude( demos/include-circular1.md )"
    );
    mockFileSystem.set(
      `${cwd}/demos/example7.md`,
      "this is escaped\n\\%mdinclude(demos/include-me1.md)"
    );

    spyOn(fs, "readFile").and.callFake((path, options) => {
      if (mockFileSystem.has(path)) {
        return Promise.resolve(mockFileSystem.get(path));
      } else {
        return Promise.reject(new Error("Mock file not found"));
      }
    });
  });

  it("resolve an included source code reference", async () => {
    const input = '```js (demos/example1.js)\n```\n'
    const result = await unified()
      .use(remarkParse)
      .use(remarkCodeSource)
      .use(remarkStringify)
      .process(input);

    expect(result?.value).toBe('```js (demos/example1.js)\n\nfunction x(foo) {\n  console.log(foo);\n}\n```\n');

  });

  it("resolve an included source code reference with a line specifier with unindented content", async () => {
    const input = '```css (demos/example2.css#9)\n```'
    const result = await unified()
      .use(remarkParse)
      .use(remarkCodeSource)
      .use(remarkStringify)
      .process(input);

    expect(result?.value).toBe('```css (demos/example2.css#9)\nheight: auto;\n```\n');

  });

  it("resolve an included source code reference with a range of lines", async () => {
    const input = '```css (demos/example2.css#1-5)\n```'
    const result = await unified()
      .use(remarkParse)
      .use(remarkCodeSource)
      .use(remarkStringify)
      .process(input);

    expect(result?.value).toBe('```css (demos/example2.css#1-5)\n*,\n*::before,\n*::after {\n  box-sizing: inherit\n}\n```\n');

  });
});