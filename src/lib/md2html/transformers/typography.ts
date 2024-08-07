import { parse, HTMLElement, TextNode } from 'node-html-parser';
import { smartypantsu } from 'smartypants';
import Page from '../page.js';
import type Model from '../../mvc/model.ts';
import type { Opts } from '../../../../types/opts.ts';

function quotes(html: string): string {
  const root = parse(html);

  const unsafeElements: Set<string> = new Set([
    'PRE', 'CODE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'HEAD',
    'KBD', 'SAMP', 'VAR', 'TT', 'PLAINTEXT'
  ]);

  function walk(node: HTMLElement | TextNode): void {
    if (node instanceof HTMLElement && unsafeElements.has(node.tagName)) {
      return;
    }

    node.childNodes.forEach(child => {
      if (child.nodeType === 3 && child instanceof TextNode) { // text node
        child.rawText = smartypantsu(child.rawText);
      } else if (child.nodeType === 1 && child instanceof HTMLElement) { // element node
        walk(child);
      }
    });
  }

  walk(root as HTMLElement);

  return root.toString();
}

export default async function(model: Model, opts: Opts): Promise<void> {
  const pages: Array<Page> = model.get('pages');
  
  await Promise.all(pages.map(async (page) => {
    page.body = quotes(page.body);
  }));
}
