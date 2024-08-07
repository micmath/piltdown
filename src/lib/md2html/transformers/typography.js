import { parse, HTMLElement, TextNode } from 'node-html-parser';
import { smartypantsu } from 'smartypants';
function quotes(html) {
    const root = parse(html);
    const unsafeElements = new Set([
        'PRE', 'CODE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'HEAD',
        'KBD', 'SAMP', 'VAR', 'TT', 'PLAINTEXT'
    ]);
    function walk(node) {
        if (node instanceof HTMLElement && unsafeElements.has(node.tagName)) {
            return;
        }
        node.childNodes.forEach(child => {
            if (child.nodeType === 3 && child instanceof TextNode) {
                child.rawText = smartypantsu(child.rawText);
            }
            else if (child.nodeType === 1 && child instanceof HTMLElement) {
                walk(child);
            }
        });
    }
    walk(root);
    return root.toString();
}
export default async function (model, opts) {
    const pages = model.get('pages');
    await Promise.all(pages.map(async (page) => {
        page.body = quotes(page.body);
    }));
}
