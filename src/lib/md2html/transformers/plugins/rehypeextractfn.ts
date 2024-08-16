import type { Node, Parent } from "unist";
import { Element, Text } from "hast";
import { VFile } from "vfile";
import { visit, SKIP } from "unist-util-visit";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";

function rehypeExtractFn() {
  return transformer;

  function transformer(tree: Node, vfile: VFile) {
    let keyCounter = 0;
    const footnoteRefs: Map<string, number> = new Map(); // id => key
    const footnoteRefCount: Map<string, number> = new Map(); // id => count
    const footnoteDefs: Map<string, string> = new Map(); // id => value

    function getFootnoteRefCounter(footnoteId) {
      const count = footnoteRefCount.get(footnoteId);
      if (count > 1) {
        return `--${count}`;
      }
      return "";
    }

    function processFnRefs(node: any): any {
      if (node.tagName === "code") {
        return node;
      }

      const newChildren: any[] = [];
      node.children?.forEach((child: any) => {
        if (child.type === "text") {
          const textContent = child.value;
          const regex = /\[\^([a-zA-Z0-9-]+?)\](?!:)/g;
          let lastIndex = 0;
          let match;

          while ((match = regex.exec(textContent)) !== null) {
            const footnoteId = match[1];
            const beforeText = textContent.slice(lastIndex, match.index);

            if (beforeText) {
              newChildren.push({ type: "text", value: beforeText });
            }

            if (!footnoteRefs.has(footnoteId)) {
              keyCounter++;
              footnoteRefs.set(footnoteId, keyCounter);
            }

            if (!footnoteRefCount.has(footnoteId)) {
              footnoteRefCount.set(footnoteId, 1);
            }
            else {
              footnoteRefCount.set(footnoteId, footnoteRefCount.get(footnoteId)! + 1);
            }

            const footnoteNumber = footnoteRefs.get(footnoteId)!;

            newChildren.push(
              h(
                "sup",
                {
                  className: "fn-ref"
                },
                [
                  h(
                    "a",
                    {
                      id: `fn-ref-${footnoteId}` + getFootnoteRefCounter(footnoteId),
                      href: `#fn-def-${footnoteId}`,
                      ariaLabel: `Footnote ${footnoteNumber.toString()}.`,
                      title: `Footnote ${footnoteNumber.toString()}.`
                    },
                    footnoteNumber.toString()
                  )
                ]
              )
            );

            lastIndex = regex.lastIndex;
          }

          const afterText = textContent.slice(lastIndex);
          if (afterText) {
            newChildren.push({ type: "text", value: afterText });
          }
        } else {
          newChildren.push(processFnRefs(child));
        }
      });
      node.children = newChildren;

      return node;
    }

    visit(tree, "root", node => {
      processFnRefs(node);
    });

    visit(tree, "element", (node: Element, index: number, parent: Parent) => {
      if (node.tagName === "p" && node.children[0]?.type === "text") {
        const textNode = node.children[0] as Text;
        if (textNode.value?.match(/^\[\^([a-zA-Z0-9-]+?)\]:.+/)) {
          parseFootnoteDefs(
            toHtml(node.children, { allowDangerousHtml: true }),
            footnoteDefs
          );
          parent.children.splice(index, 1);
          return [SKIP, index];
        }
      }
    });

    const merged = Array.from(footnoteRefs).map(([id, key]) => {
      return {
        key,
        id,
        value: footnoteDefs.get(id) || ""
      };
    });

    vfile.data.footnotes = merged;
  }
}

const footnoteDefRegex = /^\[\^([a-zA-Z0-9-]+?)\]:\s*((?:.|\n(?!\[))*)/gm;
function parseFootnoteDefs(paragraph: string, map: Map<string, string>) {
  paragraph.replace(footnoteDefRegex, (_, key, content) => {
    map.set(key, content);
    return "";
  });
}

export default rehypeExtractFn;
