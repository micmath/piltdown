import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkBraces from '../../src/lib/md2html/transformers/plugins/remarkbraces.js';

describe('remarkBraceholders', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkBraces)
      .use(remarkRehype, { allowDangerousHtml: true }) // Allow HTML in markdown
      .use (rehypeRaw)
      .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true })
      .process(markdown);
    return String(file);
  };

  it('should handle a simple single-line braces', async () => {
    const input =
`Some {{ include "some/file" {arg: value} }} text.`;

    const output = await process(input);
    expect(output).toBe(`<p>Some {{ include "some/file" {arg: value} }} text.</p>`);
  });

  it('should handle a simple block braces', async () => {
    const input =
`# Title

{{ if { v in {v: 1}}}}
*blah* {{ blah }}
{{ /if }}
 
And so forth.`;

    const output = await process(input);
    expect(output).toBe(`<h1>Title</h1>
{{ if { v in {v: 1}}}}

<em>blah</em>
 {{ blah }}
{{ /if }}
<p>And so forth.</p>`
    );
  });
});
  