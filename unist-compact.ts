import { Parent } from "unist";
import visit from "unist-util-visit-parents";

export function compact(root: Parent): Parent {
  for (let child of root.children) {
    if (!child.data) child.data = {};
    visit(child, (node, ancestors) => {
      const path = ancestors
        .slice(1)
        .concat(node)
        .map((a) => a.data?.formal_name || a.type)
        .join("/");
      if (node.value) {
        child.data![path] = node.value;
      } else if (node.data?.pointer) {
        child.data![`@${path}`] = node.data.pointer;
      }
    });
    child.children = [];
  }
  return root;
}
