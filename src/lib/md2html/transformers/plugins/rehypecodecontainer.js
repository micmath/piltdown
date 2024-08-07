import { visit } from 'unist-util-visit';
export default function rehypeCodeContainer() {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            if (node.tagName === 'pre' &&
                node.children &&
                node.children.length === 1 &&
                node.children[0].tagName === 'code') {
                node.tagName = 'div';
                node.properties = { class: 'preformatted' };
                const codeNode = node.children[0];
                const classNames = codeNode.properties.className || [];
                const languageClass = classNames.find(className => /^language-[a-z]+$/.test(className));
                const divNode = {
                    type: 'element',
                    tagName: 'div',
                    properties: { class: 'code-block' },
                    children: [node],
                };
                if (languageClass) {
                    languageClass.replace(/^language-(.+)/, (matched, lang) => {
                        divNode.properties['data-lang'] = lang;
                        return 'data-lang';
                    });
                }
                parent.children[index] = divNode;
            }
        });
    };
}
