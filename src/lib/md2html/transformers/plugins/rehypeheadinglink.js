import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
function rehypeHeadingLink() {
    return (tree) => {
        const seen = new Map();
        visit(tree, (node) => {
            const tagName = node.tagName || '';
            if (/^h[2-6]$/.test(tagName) && node.properties?.id) {
                if (node.children?.length && node.children[0].tagName !== 'a') {
                    const anchor = h('a', {
                        class: 'heading-link',
                        tabindex: '-1',
                        href: `#${node.properties.id}`
                    }, node.children);
                    node.children = [anchor];
                }
            }
        });
    };
}
export default rehypeHeadingLink;
