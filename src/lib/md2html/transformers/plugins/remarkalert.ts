import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';
import type { Paragraph } from 'mdast';

const RE = /\[!(Tip|Note|Important|Warning|Caution)\]/i;

function remarkAlert() {
  return (tree: Node) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!parent || index === null) return;
      
      const blockquoteNode = node as Parent;
      const children = blockquoteNode.children as Paragraph[];
      const firstParagraph = children[0];
      if (!firstParagraph) return;

      let firstContent = firstParagraph.children[0];
      if (!firstContent) return;

      // Unwrap nested children to find text content
      while (firstContent && 'children' in firstContent && firstContent.children.length) {
        firstContent = firstContent.children[0];
      }

      if (!firstContent || firstContent.type !== 'text') return;

      const match = firstContent.value.match(RE);
      if (!match) return;

      const alertType = match[1].toLowerCase();

      // remove the matched alert keyword
      firstContent.value = firstContent.value.slice(match[0].length).trimStart();

      const data = (node as any).data || ((node as any).data = {});
      data.hName = 'aside';
      data.hProperties = h('aside', { class: `alert alert-${alertType}` }).properties;
    });
  };
}

export default remarkAlert;
