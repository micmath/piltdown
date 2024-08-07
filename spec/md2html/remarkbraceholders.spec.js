import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import {default as remarkBraceholders, restore} from '../../src/lib/md2html/transformers/plugins/remarkbraceholders.js';

describe('remarkBraceholders', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkBraceholders)
      .use(remarkRehype, { allowDangerousHtml: true }) // Allow HTML in markdown
      .use (rehypeRaw)
      .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true })
      .process(markdown);
    return String(file);
  };

  it('should handle a simple single-line braceholder', async () => {
    const input =
`Some <!--{{ include "some/file" {arg: value} }}--> text.`;

    const output = await process(input);
    expect(output).toMatch(/Some <!--\:[a-f0-9]+?\:--> text./);
  });

  it('should handle complex braceholder', async () => {
    const input =
`<!--{{ for _number_ of [1, 2, 3].filter((n) <= n%2) }}

    <b>{{ _number_ }}.</b>

{{ /for }}-->`;

    const output = await process(input);
    const restored = restore(output);
    expect(restored).toBe(
`{{ for _number_ of [1, 2, 3].filter((n) <= n%2) }}

    <b>{{ _number_ }}.</b>

{{ /for }}`
    );
  });

  it('should handle multiple braceholders', async () => {
    const input =
'# Stuff <!-- ignore me -->\n\n<!--{{ one }}--><!--{{ two }}-->\n\n*blah*\n\n<!--{{ one }}-->\n<!--{{ three }}-->';

    const output = await process(input);
    const restored = restore(output);
    expect(restored).toBe(
`<h1>Stuff <!-- ignore me --></h1>
{{ one }}{{ two }}
<p><em>blah</em></p>
{{ one }}
{{ three }}`
    );
  });

  it('should handle complex case', async () => {
    const input =
'# Stuff\n\n<!--{{ if { v in {v: 1}} & v < 1 }}\n*blah*\n{{ /if }}-->\n\nAnd such.';

    const output = await process(input);
    const restored = restore(output);
    expect(restored).toBe(
`<h1>Stuff</h1>
{{ if { v in {v: 1}} & v < 1 }}
*blah*
{{ /if }}
<p>And such.</p>`
    );
  });
});
  