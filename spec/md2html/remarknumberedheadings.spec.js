import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkNumberedHeadings from '../../src/lib/md2html/transformers/plugins/remarknumberedheadings.js';

describe('remarkNumberedHeadings', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkNumberedHeadings)
      .use(remarkStringify)
      .process(markdown);
    return String(file);
  };

  it('should transform simple text headings', async () => {
    const input = '#h1 My heading\n\nSome text.';
    const output = await process(input);
    expect(output).toBe('# My heading\n\nSome text.\n');
  });

  it('should handle upper case too', async () => {
    const input = '#H2 My heading';
    const output = await process(input);
    expect(output).toBe('## My heading\n');
  });

  it('should handle headings with multiple text nodes', async () => {
    const input = '#h3 Heading with *emphasis*';
    const output = await process(input);
    expect(output.trim()).toBe('### Heading with *emphasis*');
  });

  it('should preserve inline HTML in headings', async () => {
    const input = '#h4 <strong>Heading with bold</strong> text';
    const output = await process(input);
    expect(output.trim()).toBe('#### <strong>Heading with bold</strong> text');
  });

  it('should handle headings with images', async () => {
    const input = '#h5 Heading with ![alt text](image.jpg)';
    const output = await process(input);
    expect(output.trim()).toBe('##### Heading with ![alt text](image.jpg)');
  });

  it('should handle headings with links', async () => {
    const input = '#h6 Heading with [link](https://example.com)';
    const output = await process(input);
    expect(output.trim()).toBe('###### Heading with [link](https://example.com)');
  });

  it('should clamp heading levels to valid range', async () => {
    const input = '#h7 This should be h6\n\n#h0 This should be h1';
    const output = await process(input);
    expect(output.trim()).toBe('###### This should be h6\n\n# This should be h1');
  });

  it('should ignore ordinary headings', async () => {
    const input = '## Ordinary';
    const output = await process(input);
    expect(output.trim()).toBe('## Ordinary');
  });

  it('should ignore ordinary paragraphs', async () => {
    const input = 'Not #h1 a heading.';
    const output = await process(input);
    expect(output.trim()).toBe('Not #h1 a heading.');
  });

  it('should handle empty headings', async () => {
    const input = '#h2 ';
    const output = await process(input);
    expect(output.trim()).toBe('##');
  });

  it('should handle headings with only non-text content', async () => {
    const input = '#h5 ![test image](./test.jpg)';
    const output = await process(input);
    expect(output.trim()).toBe('##### ![test image](./test.jpg)');
  });
});