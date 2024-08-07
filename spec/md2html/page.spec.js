import Page from '../../src/lib/md2html/page.js';

describe('Page', function() {
  const mockFilepath = '/workspace/my_pages/some/file.md';
  const mockRawContent = '---\ntitle: Test Page\n---\nThis is the body content.';
  const mockRawContentNohead = 'Body without frontmatter.';
  const mockParsedData = {
    data: { title: 'Test Page' },
    content: 'This is the body content.'
  };

  const mockOpts = {
    dir: {
      pages: '/workspace/my_pages/',
      site: '/workspace/my_site/'
    }
  };

  describe('constructor', function() {
    it('should initialize with srcpath, destpath, and route', function() {
      const page = new Page(mockFilepath, mockRawContent, mockOpts);
      expect(page.srcpath).toBe('/workspace/my_pages/some/file.md');
      expect(page.destpath).toBe('/workspace/my_site/some/file/index.html');
      expect(page.route).toBe('/some/file');
    });

    it('should parse frontmatter', function() {
      const page = new Page(mockFilepath, mockRawContent, mockOpts);

      expect(page.raw).toBe(mockRawContent);
      expect(page.head).toEqual(mockParsedData.data);
      expect(page.body).toBe(mockParsedData.content);
    });
  });

  describe('getContent', function() {
    it('should return an object with head and body', function() {
      const page = new Page(mockFilepath, mockRawContent, mockOpts);
      const content = page.getContent();
      
      expect(content).toEqual({
        head: mockParsedData.data,
        body: mockParsedData.content
      });
    });
  });
});