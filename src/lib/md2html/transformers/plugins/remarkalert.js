import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
const RE = /\[!(Tip|Note|Important|Warning|Caution)\]/i;
function remarkAlert() {
    return (tree) => {
        visit(tree, 'blockquote', (node, index, parent) => {
            if (!parent || index === null)
                return;
            const blockquoteNode = node;
            const children = blockquoteNode.children;
            const firstParagraph = children[0];
            if (!firstParagraph)
                return;
            let firstContent = firstParagraph.children[0];
            if (!firstContent)
                return;
            while (firstContent && 'children' in firstContent && firstContent.children.length) {
                firstContent = firstContent.children[0];
            }
            if (!firstContent || firstContent.type !== 'text')
                return;
            const match = firstContent.value.match(RE);
            if (!match)
                return;
            const alertType = match[1].toLowerCase();
            firstContent.value = firstContent.value.slice(match[0].length).trimStart();
            const data = node.data || (node.data = {});
            data.hName = 'aside';
            data.hProperties = h('aside', { class: `alert alert-${alertType}` }).properties;
        });
    };
}
export default remarkAlert;
