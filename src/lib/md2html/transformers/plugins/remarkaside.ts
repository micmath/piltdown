import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

function remarkAside() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'aside') {
        const data = node.data || (node.data = {});
        data.hName = 'aside';
        data.hProperties = h('aside', node.attributes || {}).properties;
      }
    });
  };
}

export default remarkAside;