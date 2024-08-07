import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import slugify from '@sindresorhus/slugify';
function rehypeHeadingId() {
    return (tree) => {
        const seen = new Map();
        visit(tree, 'element', (node) => {
            const tagName = node.tagName || '';
            if (!/^h[1-6]$/.test(tagName))
                return;
            node.properties = node.properties || {};
            const text = toString(node);
            let slug = node.properties.id || slugify(text);
            const count = (seen.get(slug) || 0) + 1;
            seen.set(slug, count);
            node.properties.id = count > 1 ? `${slug}-${count}` : slug;
        });
    };
}
export default rehypeHeadingId;
