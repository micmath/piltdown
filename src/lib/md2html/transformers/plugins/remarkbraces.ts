
import { Plugin, Transformer } from 'unified';
import type { Node, Parent } from 'unist';
import { Paragraph, Text } from 'mdast';
import { visit } from 'unist-util-visit';

interface ParagraphParent extends Parent {
  children: (Paragraph | Node)[];
}

const remarkBraces: Plugin = (): Transformer => {
  return (tree: Node) => {
    visit(tree, 'paragraph', (node: Paragraph, index: number, parent: ParagraphParent) => {
      if (
        node.children.length >= 1 &&
        node.children[0].type === 'text' &&
        (node.children[0] as Text).value.startsWith('{{') &&
        node.children[node.children.length - 1].type === 'text' &&
        (node.children[node.children.length - 1] as Text).value.endsWith('}}')
      ) {
        if (typeof index !== 'number') return;
        // unwrap the paragraph
        parent.children.splice(index, 1, ...node.children);
      }
    });
  };
};

export default remarkBraces;
