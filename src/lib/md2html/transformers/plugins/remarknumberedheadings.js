import { SKIP, visit } from 'unist-util-visit';
const numberedHeadingPattern = /^#h(\d+)(\s+|$)/i;
export default function remarkNumberedHeadings() {
    return (tree) => {
        visit(tree, 'paragraph', (node, index, parent) => {
            const { children } = node;
            if (children.length && children[0].type === 'text') {
                const match = children[0].value.match(numberedHeadingPattern);
                if (match) {
                    let level = parseInt(match[1], 10);
                    const clampedLevel = Math.min(Math.max(level, 1), 6);
                    children[0].value = children[0].value.slice(match[0].length);
                    if (children[0].value === '') {
                        children.shift();
                    }
                    const headingNode = {
                        type: 'heading',
                        depth: clampedLevel,
                        children: children
                    };
                    parent.children.splice(index, 1, headingNode);
                    return [SKIP, index];
                }
            }
        });
    };
}
