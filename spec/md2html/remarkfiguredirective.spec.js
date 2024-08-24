import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkFigureDirective from '../../src/lib/md2html/transformers/plugins/remarkfigure.js';

describe('remarkFigureDirective', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkFigureDirective)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true })
      .process(markdown);
    return String(file);
  };

  it('should handle a figure with content but no caption', async () => {
    const input =
`
:::figure
This is **figure** text.

<img src="example.jpg" alt="a placeholder">
:::
`;

    const output = await process(input);
    expect(output).toBe(
`<figure><p>This is <strong>figure</strong> text.</p><img src="example.jpg" alt="a placeholder"></figure>`
    );
  });

  it('should handle a figure with content and a caption', async () => {
    const input =
`
:::figure
  This is **figure** text.

  <img src="example.jpg" alt="a placeholder">

  -- This is **caption** text.
:::
`;

    const output = await process(input);
    expect(output).toBe(
`<figure><p>This is <strong>figure</strong> text.</p>  <img src="example.jpg" alt="a placeholder"><figcaption>This is <strong>caption</strong> text.</figcaption></figure>`
    );
  });

  it('should handle a figure no content and a caption', async () => {
    const input =
`
:::figure
-- This is **caption** text.
:::
`;

    const output = await process(input);
    expect(output).toBe(
`<figure><figcaption>This is <strong>caption</strong> text.</figcaption></figure>`
    );
  });

  it('should handle an empty figure', async () => {
    const input = `
:::figure
:::`;
    const output = await process(input);
    expect(output).toBe('<figure></figure>');
  });

  it('should handle a figure with content and no caption', async () => {
    const input = `
:::figure
<img src="example.jpg" alt="a placeholder">
:::`;
    const output = await process(input);
    expect(output).toBe('<figure><img src="example.jpg" alt="a placeholder"></figure>');
  });

  it('should handle a figure with content and multiple captions', async () => {
    const input = `
:::figure
This is some content.

-- This is the first caption.

-- This is the second caption.
:::`;
    const output = await process(input);
    expect(output).toContain('<figcaption>This is the first caption.</figcaption>');
    expect(output).toContain('<figcaption>This is the second caption.</figcaption>');
  });

  it('should handle a figure with block content', async () => {
    const input =
`
:::figure
\`\`\`js
console.log('test');
\`\`\`

-- This is **caption** text.
:::
`;

    const output = await process(input);
    expect(output).toBe(
`<figure><pre><code class="language-js">console.log('test');
</code></pre><figcaption>This is <strong>caption</strong> text.</figcaption></figure>`
    );
  });

  it('should handle a figure with attributes', async () => {
    const input = `
:::figure{class="my-figure" data-id="123"}
<img src="example.jpg" alt="a placeholder">
:::`;
    const output = await process(input);
    expect(output).toContain('<figure class="my-figure" data-id="123">');
  });
});
