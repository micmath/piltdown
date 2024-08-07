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



// import transformPages from '../../src/lib/md2html/transform.js';
// import Model from '../../src/lib/mvc/model.js';
// import Page from '../../src/lib/md2html/page.js';

// describe('the figure directive', () => {
//   let model;
//   const cwd = process.cwd(['pages']);

//   beforeEach(() => {
//     model = new Model(['pages']);
//   });

//   afterEach(() => {
//     model = undefined;
//   });

//   it('should render an figure element with a class and HTML when ther is no caption.', async () => {
//     model.set(
//       'pages', 
//       [
//         new Page(
//           `${cwd}/test/example/some-page.md`,
//           `---
// title: My Page Title
// description: This is a test page.
// ---

// Some paragraph.

// :::figure{.figure-graphic}
//   This is **figure** text.

//   <img src="https://placehold.co/600x400" alt="a placeholder">
// :::

// Some other paragraph.
// `
//         )
//       ]
//     );

//     await transformPages(model, {});

//     const testPage = model.get('pages').filter(page => page.filepath == `${cwd}/test/example/some-page.md`)[0];

//     expect(testPage.body).toEqual('<p>Some paragraph.</p>\n<figure class="figure-graphic"><p>This is <strong>figure</strong> text.</p>  <img src="https://placehold.co/600x400" alt="a placeholder"></figure>\n<p>Some other paragraph.</p>');
//   });

//   it('should render a figure element with a figcaption when it contains a paragraph marked as a caption.', async () => {
//     model.set(
//       'pages', 
//       [
//         new Page(
//           `${cwd}/test/example/some-page.md`,
//           `---
// title: My Page Title
// description: This is a test page.
// ---

// Some paragraph.

// :::figure
//   This is **figure** text.

//   <img src="https://placehold.co/600x400" alt="a placeholder">

//   -- This is **caption** text.
// :::

// Some other paragraph.
// `
//         )
//       ]
//     );

//     await transformPages(model, {});

//     const testPage = model.get('pages').filter(page => page.filepath == `${cwd}/test/example/some-page.md`)[0];

//     expect(testPage.body).toEqual('<p>Some paragraph.</p>\n<figure><p>This is <strong>figure</strong> text.</p>  <img src="https://placehold.co/600x400" alt="a placeholder"><figcaption>This is <strong>caption</strong> text.</figcaption></figure>\n<p>Some other paragraph.</p>');
//   });

//   it('should render an figure directive with many captions when any paragraph is marked as a caption.', async () => {
//     model.set(
//       'pages', 
//       [
//         new Page(
//           `${cwd}/test/example/some-page.md`,
//           `---
// title: My Page Title
// description: This is a test page.
// ---

// Some paragraph.

// :::figure
//   -- This is **caption** text.

//   <img src="https://placehold.co/600x400" alt="a placeholder">

//   -- This is _also_ caption text.
// :::

// Some other paragraph.
// `
//         )
//       ]
//     );

//     await transformPages(model, {});

//     const testPage = model.get('pages').filter(page => page.filepath == `${cwd}/test/example/some-page.md`)[0];

//     expect(testPage.body).toEqual('<p>Some paragraph.</p>\n<figure><figcaption>This is <strong>caption</strong> text.</figcaption>  <img src="https://placehold.co/600x400" alt="a placeholder"><figcaption>This is <em>also</em> caption text.</figcaption></figure>\n<p>Some other paragraph.</p>');
//   });

//   it('should render an figure element with blockquote and figcaption.', async () => {
//     model.set(
//       'pages', 
//       [
//         new Page(
//           `${cwd}/test/example/some-page.md`,
//           `---
// title: My Page Title
// description: This is a test page.
// ---

// Some paragraph.

// :::figure
// > Bid me discourse, I will enchant thine ear,
// > Or like a fairy trip upon the green,
// > Or, like a nymph, with long dishevelled hair…

// -- — <cite>Venus and Adonis</cite>, by [William Shakespeare](https://en.wikipedia.org/wiki/William_Shakespeare)
// :::

// Some other paragraph.
// `
//         )
//       ]
//     );

//     await transformPages(model, {});

//     const testPage = model.get('pages').filter(page => page.filepath == `${cwd}/test/example/some-page.md`)[0];

//     expect(testPage.body).toEqual('<p>Some paragraph.</p>\n<figure><blockquote>\n<p>Bid me discourse, I will enchant thine ear,\nOr like a fairy trip upon the green,\nOr, like a nymph, with long dishevelled hair…</p>\n</blockquote><figcaption>— <cite>Venus and Adonis</cite>, by <a href="https://en.wikipedia.org/wiki/William_Shakespeare">William Shakespeare</a></figcaption></figure>\n<p>Some other paragraph.</p>');
//   });

//   it('should render an figure element with a code block and figcaption.', async () => {
//     model.set(
//       'pages', 
//       [
//         new Page(
//           `${cwd}/test/example/some-page.md`,
//           `---
// title: My Page Title
// description: This is a test page.
// ---

// Some paragraph.

// :::figure
// \`\`\`js
// function foo(bar) {
//   return baz;
// }
// \`\`\`

// -- This shows the correct use of \`foo\`
// :::

// Some other paragraph.
// `
//         )
//       ]
//     );

//     await transformPages(model, {});

//     const testPage = model.get('pages').filter(page => page.filepath == `${cwd}/test/example/some-page.md`)[0];

//     expect(testPage.body).toContain('<figure><div class="code-block" data-js><pre><code class="hljs language-js">');
//     expect(testPage.body).toContain('</code></pre></div><figcaption>This shows the correct use of <code>foo</code></figcaption></figure>');
  
//   });
// });


