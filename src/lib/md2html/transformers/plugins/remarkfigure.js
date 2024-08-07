import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
const captionPattern = /^\s*--\s*/i;
function remarkFigure() {
    return (tree) => {
        visit(tree, 'containerDirective', (node) => {
            if (node.name !== 'figure')
                return;
            const data = node.data || (node.data = {});
            data.hName = 'figure';
            data.hProperties = h('figure', node.attributes || {}).properties;
            if (!node.children?.length)
                return;
            node.children = node.children.map((child) => {
                if (child.type !== 'paragraph')
                    return child;
                const firstChild = child.children?.[0];
                if (!firstChild || typeof firstChild.value !== 'string')
                    return child;
                const match = firstChild.value.match(captionPattern);
                if (!match)
                    return child;
                firstChild.value = firstChild.value.slice(match[0].length);
                return {
                    type: 'paragraph',
                    data: { hName: 'figcaption' },
                    children: child.children
                };
            });
        });
    };
}
export default remarkFigure;
