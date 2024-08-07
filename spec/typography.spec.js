import typography from '../src/lib/typography.js';

describe('typography', () => {
  describe('quotes', () => {
    it('should convert straight quotes in regular text correctly', () => {
        const html = `<p>This is "smart" quotes. We'll 'test it well.'</p>`;
        const expected = `<p>This is \u201Csmart\u201D quotes. We\u2019ll \u2018test it well.\u2019</p>`;
        const result = typography.quotes(html);
        expect(result).toEqual(expected);
    });

    it('should convert straight quotes surrounded by punctuation', () => {
      const html = `<p>This is ("smart" I think) "quotes".</p>`;
      const expected = `<p>This is (\u201Csmart\u201D I think) \u201Cquotes\u201D.</p>`;
      const result = typography.quotes(html);
      expect(result).toEqual(expected);
    });

    it('should convert straight quotes containing tagged text', () => {
      const html = `<p>This is "<i>very</i> smart" text.</p>`;
      const expected = `<p>This is \u201C<i>very</i> smart\u201D text.</p>`;
      const result = typography.quotes(html);
      expect(result).toEqual(expected);
    });

    it('should not change quotes inside <script> tags', () => {
      const html = `<p>Change "here" but <script>alert("Don't \"change\" here");</script></p>`;
      const expected = `<p>Change \u201Chere\u201D but <script>alert("Don't \"change\" here");</script></p>`;
      const result = typography.quotes(html);
      expect(result).toEqual(expected);
    });

    it('should not change quotes inside <pre> and <code> tags', () => {
        const html = `<pre class="hljs">This "should not" change.</pre><code>This 'should' stay the same.</code>`;
        const expected = `<pre class="hljs">This "should not" change.</pre><code>This 'should' stay the same.</code>`;
        const result = typography.quotes(html);
        expect(result).toEqual(expected);
    });

    it('should preserve quotes inside <kbd> tags', () => {
        const html = `<kbd>Keyboard 'input' should remain.</kbd>`;
        const expected = `<kbd>Keyboard 'input' should remain.</kbd>`;
        const result = typography.quotes(html);
        expect(result).toEqual(expected);
    });

    it('should handle nested elements correctly', () => {
        const html = `<p>This is "nested 'quotes'" test.</p><pre>Single 'quote' inside pre.</pre>`;
        const expected = `<p>This is \u201Cnested \u2018quotes\u2019\u201D test.</p><pre>Single 'quote' inside pre.</pre>`;
        const result = typography.quotes(html);
        expect(result).toEqual(expected);
    });

    it('should not change quotes used for html attributes', () => {
        const html = `<a href="https://example.com" title='This "should not" change'></a>`;
        const expected = `<a href="https://example.com" title='This "should not" change'></a>`;
        const result = typography.quotes(html);
        expect(result).toEqual(expected);
    });
  });
});