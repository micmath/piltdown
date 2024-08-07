import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeHeadingLink from '../../src/lib/md2html/transformers/plugins/rehypeheadinglink.js';

describe('remarkHeadingLink', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use (rehypeRaw)
      .use(rehypeHeadingLink)
      .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true })
      .process(markdown);
    return String(file);
  };

  it('should not add a link to an <H1>', async () => {
    const input =
`
# About Us

This is our about page.
`;

    const output = await process(input);
    expect(output).toBe(
`<h1>About Us</h1>
<p>This is our about page.</p>`
    );
  });

  it('should add a link to an <H2>', async () => {
    const input =
`
<h2 id="contact">Contact</h2>

This is some contact info.
`;

    const output = await process(input);
    expect(output).toBe(
`<h2 id="contact"><a class="heading-link" tabindex="-1" href="#contact">Contact</a></h2>
<p>This is some contact info.</p>`
    );
  });

  it('should handle strange content when generating an id', async () => {
    const input =
`
<h2 id="strange">Strange</h2>

This is some contact info.
`;

    const output = await process(input);
    expect(output).toBe(
`<h2 id="strange"><a class="heading-link" tabindex="-1" href="#strange">Strange</a></h2>
<p>This is some contact info.</p>`
    );
  });

  it('should ignore a link if one exists already.', async () => {
    const input =
`
<h2 id="linked-title"><a href="#a-link">Linked Title</a></h2>

This is some text.
`;

    const output = await process(input);
    expect(output).toBe(
`<h2 id="linked-title"><a href="#a-link">Linked Title</a></h2>
<p>This is some text.</p>`
    );
  });
});