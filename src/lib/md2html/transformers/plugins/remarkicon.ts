import { h } from "hastscript";
import { visit } from "unist-util-visit";

function remarkIcon() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.name === "icon" && node.type === "textDirective") {
        const iconName = (node.children[0].value || '');
        node.data = {
          hName: "span",
          hProperties: {
            "aria-hidden": "true",
            className: [`icon-${iconName.toLowerCase().trim()}`],
          },
          hChildren: [{ type: "text", value: '' }],
        };
      }
    });
  };
}

export default remarkIcon;