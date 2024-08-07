import { toHtml } from 'hast-util-to-html';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import slugify from '@sindresorhus/slugify';
function rehypeExtractToc() {
    return transformer;
    function transformer(tree, vfile) {
        const idMap = new Map();
        visit(tree, 'element', onHeading);
        function onHeading(node) {
            if (node.tagName === 'h2') {
                const value = getInnerHtml(node);
                let id = getOrCreateId(node);
                if (idMap.has(id)) {
                    const count = idMap.get(id) + 1;
                    idMap.set(id, count);
                    id = `${id}-${count}`;
                }
                else {
                    idMap.set(id, 1);
                }
                if (!vfile.data.toc) {
                    vfile.data.toc = [];
                }
                vfile.data.toc.push({ id, value });
            }
        }
        function getOrCreateId(node) {
            if (!node.properties) {
                node.properties = {};
            }
            if (!node.properties.id) {
                node.properties.id = slugify(toString(node));
            }
            return node.properties.id;
        }
        function getInnerHtml(node) {
            return node.children.map(child => toHtml(child, { allowDangerousHtml: true })).join('');
        }
    }
}
export default rehypeExtractToc;
