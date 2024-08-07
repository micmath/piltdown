import { visit } from 'unist-util-visit';
const remarkBraces = () => {
    return (tree) => {
        visit(tree, 'paragraph', (node, index, parent) => {
            if (node.children.length >= 1 &&
                node.children[0].type === 'text' &&
                node.children[0].value.startsWith('{{') &&
                node.children[node.children.length - 1].type === 'text' &&
                node.children[node.children.length - 1].value.endsWith('}}')) {
                if (typeof index !== 'number')
                    return;
                parent.children.splice(index, 1, ...node.children);
            }
        });
    };
};
export default remarkBraces;
