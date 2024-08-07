import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHeadingId from '../../src/lib/md2html/transformers/plugins/rehypeheadingid.js';

describe('remarkHeadingLink', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHeadingId)
      .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true })
      .process(markdown);
    return String(file);
  };

  it('should add an id to an <H1>', async () => {
    const input =
`
# About Us

This is our about page.
`;

    const output = await process(input);
    expect(output).toBe(
`<h1 id="about-us">About Us</h1>
<p>This is our about page.</p>`
    );
  });

  it('should add an id to an <H2>', async () => {
    const input =
`
## Contact

This is some contact info.
`;

    const output = await process(input);
    expect(output).toBe(
`<h2 id="contact">Contact</h2>
<p>This is some contact info.</p>`
    );
  });

  it('should handle strange content when generating an id', async () => {
    const input =
`
## **Strange**-![content](./test.jpg) 🤡?
`;

    const output = await process(input);
    expect(output).toBe(
`<h2 id="strange"><strong>Strange</strong>-<img src="./test.jpg" alt="content"> 🤡?</h2>`
    );
  });

  it('should leave an id but if one exists already.', async () => {
    const input =
`
<h2 id="blinky-bloo">Linked Title</h2>

This is some text.
`;

    const output = await process(input);
    expect(output).toBe(
`<h2 id="blinky-bloo">Linked Title</h2>
<p>This is some text.</p>`
    );
  });

  it('should keep generated ids unique.', async () => {
    const input =
`
## Section 1

## Section 2

## Section 1
`;

    const output = await process(input);
    expect(output).toBe(
`<h2 id="section-1">Section 1</h2>
<h2 id="section-2">Section 2</h2>
<h2 id="section-1-2">Section 1</h2>`
    );
  });
});