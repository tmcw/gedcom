import { Parent } from "unist";
import visit from "unist-util-visit-parents";

const remove = new Set(["TRLR", "SUBM", "HEAD"]);

export function compact(root: Parent): Parent {
  // Remove "trailer" objects, which are not useful to us.
  root.children = root.children.filter((child) => {
    return !remove.has(child.type);
  });
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
