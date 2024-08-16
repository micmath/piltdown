import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeExtractFn from '../../src/lib/md2html/transformers/plugins/rehypeextractfn.js';

describe('remarkExtractFn', () => {
  const process = async (markdown) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use (rehypeRaw)
      .use(rehypeExtractFn)
      .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true })
      .process(markdown);
    return file;
  };


  it('should handle a simple footnote.', async () => {
    const input =
`
Some text. [^my-note]

[^my-note]: A note.
`;
    const result = await process(input);
    
    expect(result.value).toBe(
      `<p>Some text. <sup class="fn-ref"><a id="fn-ref-my-note" href="#fn-def-my-note" aria-label="Footnote 1." title="Footnote 1.">1</a></sup></p>\n`
    );
    expect(result.data.footnotes).toEqual([{ key: 1, id: 'my-note', value: 'A note.' }]);
  });


  it('should handle a multiple footnotes.', async () => {
    const input =
`
Some text. [^my-note][^my-other-note]

[^my-other-note]: Other note.
[^my-note]: A note.
`;
    const result = await process(input);
    
    expect(result.value).toBe(
      `<p>Some text. <sup class="fn-ref"><a id="fn-ref-my-note" href="#fn-def-my-note" aria-label="Footnote 1." title="Footnote 1.">1</a></sup><sup class="fn-ref"><a id="fn-ref-my-other-note" href="#fn-def-my-other-note" aria-label="Footnote 2." title="Footnote 2.">2</a></sup></p>\n`
    );
    
    expect(result.data.footnotes).toEqual([
      { key: 1, id: 'my-note', value: 'A note.' },
      { key: 2, id: 'my-other-note', value: 'Other note.' }
    ]);
  });


  it('should handle a multiple footnotes refs for the same definition.', async () => {
    const input =
`
Some text. [^my-note][^my-other-note] More text. [^my-note]

[^my-other-note]: Other note.
[^my-note]: A note.
`;
    const result = await process(input);
    //console.log(result.data.footnotes);
    expect(result.value).toBe(
      `<p>Some text. <sup class="fn-ref"><a id="fn-ref-my-note" href="#fn-def-my-note" aria-label="Footnote 1." title="Footnote 1.">1</a></sup><sup class="fn-ref"><a id="fn-ref-my-other-note" href="#fn-def-my-other-note" aria-label="Footnote 2." title="Footnote 2.">2</a></sup> More text. <sup class="fn-ref"><a id="fn-ref-my-note--2" href="#fn-def-my-note" aria-label="Footnote 1." title="Footnote 1.">1</a></sup></p>\n`
    );
    expect(result.data.footnotes).toEqual([
      { key: 1, id: 'my-note', value: 'A note.' },
      { key: 2, id: 'my-other-note', value: 'Other note.' }
    ]);
  });


  it('should handle a footnote ref without a definition.', async () => {
    const input =
`
Some text. [^my-note][^orphaned][^another]

[^my-note]: A note.
[^another]: Another note.
`;
    const result = await process(input);
    
    expect(result.value).toBe(
      `<p>Some text. <sup class="fn-ref"><a id="fn-ref-my-note" href="#fn-def-my-note" aria-label="Footnote 1." title="Footnote 1.">1</a></sup><sup class="fn-ref"><a id="fn-ref-orphaned" href="#fn-def-orphaned" aria-label="Footnote 2." title="Footnote 2.">2</a></sup><sup class="fn-ref"><a id="fn-ref-another" href="#fn-def-another" aria-label="Footnote 3." title="Footnote 3.">3</a></sup></p>\n`
    );
    
    expect(result.data.footnotes).toEqual([
      { key: 1, id: 'my-note', value: 'A note.' },
      { key: 2, id: 'orphaned', value: '' },
      { key: 3, id: 'another', value: 'Another note.' }
    ]);
  });


  it('should discard a footnote definition without a ref.', async () => {
    const input =
`
Some text. [^my-note]

[^orphaned]: An orphaned note.
[^my-note]: My note.
`;
    const result = await process(input);
    
    expect(result.value).toBe(
      `<p>Some text. <sup class="fn-ref"><a id="fn-ref-my-note" href="#fn-def-my-note" aria-label="Footnote 1." title="Footnote 1.">1</a></sup></p>\n`
    );
    //console.log(result.data.footnotes);
    expect(result.data.footnotes).toEqual([
      { key: 1, id: 'my-note', value: 'My note.' }
    ]);
  });


  it('should handle a footnote ref with a malformed definition.', async () => {
    const input =
`
Some text. [^1][^weird]

[^1]: A _note_.
[^weird]: Hey [whats [up]:1](#stuff)?
`;
    const result = await process(input);
    
    expect(result.value).toBe(
      `<p>Some text. <sup class="fn-ref"><a id="fn-ref-1" href="#fn-def-1" aria-label="Footnote 1." title="Footnote 1.">1</a></sup><sup class="fn-ref"><a id="fn-ref-weird" href="#fn-def-weird" aria-label="Footnote 2." title="Footnote 2.">2</a></sup></p>\n`
    );
    expect(result.data.footnotes).toEqual([
      { key: 1, id: '1', value: 'A <em>note</em>.' },
      {
        key: 2,
        id: 'weird',
        value: 'Hey <a href="#stuff">whats [up]:1</a>?'
      }
    ]);
  });


  it('should handle a footnote ref in footnote definition.', async () => {
    const input =
`
Some text. [^note]

[^note]: I have an [^embedded] note.
[^embedded]: My embedded note.
`;
    const result = await process(input);
    
    expect(result.value).toBe(
      `<p>Some text. <sup class="fn-ref"><a id="fn-ref-note" href="#fn-def-note" aria-label="Footnote 1." title="Footnote 1.">1</a></sup></p>\n`
    );
    //console.log(result.data.footnotes);
    expect(result.data.footnotes).toEqual([
      {
        key: 1,
        id: 'note',
        value: 'I have an <sup class="fn-ref"><a id="fn-ref-embedded" href="#fn-def-embedded" aria-label="Footnote 2." title="Footnote 2.">2</a></sup> note.'
      },
      { key: 2, id: 'embedded', value: 'My embedded note.' }
    ]);
  });
});