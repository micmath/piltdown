import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
function remarkDiv() {
    return (tree) => {
        visit(tree, 'containerDirective', (node) => {
            if (node.name !== 'div')
                return;
            const data = node.data || (node.data = {});
            data.hName = 'div';
            data.hProperties = h('div', node.attributes || {}).properties;
        });
    };
}
export default remarkDiv;
