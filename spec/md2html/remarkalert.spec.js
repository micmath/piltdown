import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkAlert from '../../src/lib/md2html/transformers/plugins/remarkalert.js';

describe('remarkAlert', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkAlert)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true })
      .process(markdown);
    return String(file);
  };

  it('should handle a caution alert', async () => {
    const input =
`Some paragraph.

> [!CAUTION]
> This is caution text.

Some other paragraph.
`;

    const output = await process(input);
    expect(output).toBe(
`<p>Some paragraph.</p>
<div class="alert alert-caution" role="note" data-kind="Caution">
<p>This is caution text.</p>
</div>
<p>Some other paragraph.</p>`
    );
  });

  it('should handle complex content', async () => {
    const input =
`> [!note]
> _This_ \`is note\` ![](test.jpg) <span>text</span>.
`;

    const output = await process(input);
    expect(output).toBe(
`<div class="alert alert-note" role="note" data-kind="Note">
<p><em>This</em> <code>is note</code> <img src="test.jpg" alt=""> <span>text</span>.</p>
</div>`
    );
  });

  it('should ignore ordinary blockquote', async () => {
    const input =
`Some paragraph.

> Ordinary
> block quote.

Some other paragraph.
`;

    const output = await process(input);
    expect(output).toBe(
`<p>Some paragraph.</p>
<blockquote>
<p>Ordinary
block quote.</p>
</blockquote>
<p>Some other paragraph.</p>`
    );
  });
  
});
  