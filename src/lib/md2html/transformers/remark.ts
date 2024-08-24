import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkNumberedHeadings from './plugins/remarknumberedheadings.js';
import remarkDirective from 'remark-directive';
import remarkBraces from './plugins/remarkbraces.js';
import { default as remarkBraceholders, restore } from './plugins/remarkbraceholders.js';
import remarkIcon from './plugins/remarkicon.js';
import remarkAlert from './plugins/remarkalert.js';
import remarkFigure from './plugins/remarkfigure.js';
import remarkCodeSource from './plugins/remarkcodesource.js';
import remarkDiv from './plugins/remarkdiv.js';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightLines from "rehype-highlight-code-lines";
import rehypeCodeContainer from './plugins/rehypecodecontainer.js';
import rehypeHeadingId from './plugins/rehypeheadingid.js';
import rehypeHeadingLink from './plugins/rehypeheadinglink.js';
import rehypeExtractToc from './plugins/rehypeextracttoc.js';
import rehypeExtractFn from './plugins/rehypeextractfn.js';
import rehypeStringify from 'rehype-stringify';
import type Page from '../page.js';
import type Model from '../../mvc/model.ts';
import type { Opts } from '../../../../types/opts.ts';

interface RenderResult {
  data?: {
    toc?: Array<unknown>;
    footnotes?: Record<string, unknown>;
  };
  value: string | Uint8Array;
}

export default async function template(model: Model, opts: Opts): Promise<void> {
  const pages: Array<Page> = model.get('pages');
  const l = pages.length;
  
  for (let i = 0; i < l; i++) {
    if (!pages[i].destpath.endsWith('.html')) {
      continue;
    }
    const result = await render(
      pages[i].body,
      { page: pages[i].head, data: model.get('data') }
    );
    
    pages[i].toc = (result.data?.toc ?? []);
    pages[i].footnotes = (result.data?.footnotes ?? {});
    pages[i].body = String(result.value);
  }
}

const engine = unified()
  .use(remarkParse)
  .use(remarkBraces)
  .use(remarkBraceholders)
  .use(remarkNumberedHeadings)
  .use(remarkDirective)
  .use(remarkIcon)
  .use(remarkDiv)
  .use(remarkAlert)
  .use(remarkFigure)
  .use(remarkCodeSource)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHighlight)
  .use(rehypeHighlightLines, { showLineNumbers: true, lineContainerTagName: "span" })
  .use(rehypeCodeContainer)
  .use(rehypeExtractFn)
  .use(rehypeHeadingId)
  .use(rehypeExtractToc)
  .use(rehypeHeadingLink)
  .use(rehypeStringify, { allowDangerousCharacters: true, allowDangerousHtml: true });

async function render(input: string = '', _data: Record<string, unknown> = {}): Promise<RenderResult> {
  const rendered = await engine.process(input);
  const value = restore(rendered.value);
  
  return {
    data: rendered.data as RenderResult['data'],
    value: value
  };
}