import { createHash } from "crypto";
import { visit } from "unist-util-visit";
const placeholderMap = new Map();
const generatePlaceholder = content => {
    const hash = createHash("sha256")
        .update(content)
        .digest("hex")
        .slice(0, 16);
    return `:${hash}:`;
};
const remarkBraceholders = () => {
    return tree => {
        visit(tree, "html", node => {
            const regex = /<!--(\{\{[\s\S]*?\}\})-->/g;
            let match;
            while ((match = regex.exec(node.value)) !== null) {
                const originalComment = match[0];
                const content = match[1].trim();
                const placeholder = generatePlaceholder(content);
                placeholderMap.set(placeholder, content);
                node.value = node.value.replace(originalComment, `<!--${placeholder}-->`);
            }
        });
    };
};
export default remarkBraceholders;
export const restore = htmlString => {
    return htmlString.replace(/<!--(\:[a-f0-9]+?\:)-->/g, (match, placeholder) => {
        const originalContent = placeholderMap.get(placeholder) || "";
        return originalContent ? originalContent : match;
    });
};
