import { h } from "hastscript";
import { visit } from "unist-util-visit";
const RE = /\[!(Tip|Note|Important|Warning|Caution)\]/i;
function remarkAlert() {
    return (tree) => {
        visit(tree, "blockquote", (node, index, parent) => {
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
            while (firstContent &&
                "children" in firstContent &&
                firstContent.children.length) {
                firstContent = firstContent.children[0];
            }
            if (!firstContent || firstContent.type !== "text")
                return;
            const match = firstContent.value.match(RE);
            if (!match)
                return;
            const alertKind = match[1].toLowerCase();
            firstContent.value = firstContent.value
                .slice(match[0].length)
                .trimStart();
            const data = node.data || (node.data = {});
            data.hName = "div";
            data.hProperties = h("div", {
                class: `alert alert-${alertKind}`,
                role: "note",
                dataKind: alertKind.charAt(0).toUpperCase() + alertKind.slice(1),
            }).properties;
        });
    };
}
export default remarkAlert;
