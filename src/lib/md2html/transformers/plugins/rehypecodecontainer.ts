import {visit} from 'unist-util-visit';

export default function rehypeCodeContainer() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Check if the node is <pre> and its child is <code>
      if (
        node.tagName === 'pre' &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].tagName === 'code'
      ) {
        node.tagName = 'div';
        node.properties = {class: 'preformatted'};
        const codeNode = node.children[0];
        const classNames = codeNode.properties.className || [];

        // Find the class that matches the pattern 'language-([a-z]+)'
        const languageClass = classNames.find(className => /^language-[a-z]+$/.test(className));

        // Create the new <div> node
        const divNode = {
          type: 'element',
          tagName: 'div',
          properties: {class: 'code-block'},
          children: [node], // Wrap the <pre> node
        };

        // Check if the <code> element has a language class
        if (languageClass) {
          languageClass.replace(/^language-(.+)/, (matched, lang) => {
            divNode.properties['data-lang'] = lang;
            return 'data-lang'
          });
        }

        // Replace the <pre> node with the new <div> node
        parent.children[index] = divNode;
      }
    });
  };
}
