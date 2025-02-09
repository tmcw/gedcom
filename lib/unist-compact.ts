import { remove } from "unist-util-remove";
import { visitParents } from "unist-util-visit-parents";
import type { GEDCOMData, Parent } from "./types";

function addValue(data: GEDCOMData, path: string, value: any) {
  const existingValue = data![path];
  if (!existingValue) {
    data![path] = value;
  } else {
    data!["+" + path] = ((data!["+" + path] as any[]) || []).concat(value);
  }
}

/**
 * This applies an opinionated transformation to GEDCOM data,
 * making it easier for common use cases. In the raw GEDCOM
 * AST, attributes like birth years are represented as nodes.
 * This transformation compresses those attributes into properties
 * of a node’s `.data` member.
 *
 * Here's how this transformation works:
 *
 * For example, let's say you have this content:
 *
 * ```
 * 0 INDI
 *   1 BIRT
 *     2 DATE 12 MAY 1920
 *   1 DEAT
 *     2 DATE 1960
 * ```
 *
 * The output of `parse` will create nodes for the INDI, BIRT, DATE,
 * DEAT, and DATE objects. If you simply want to ask 'when was this individual
 * alive?' This can be a difficult question to answer. Compact will transform
 * those nodes into a simplified form:
 *
 * ```js
 *  {
 *   type: "INDI",
 *   data: {
 *     formal_name: "INDIVIDUAL",
 *     "BIRTH/DATE": "12 MAY 1920",
 *     "DEATH/DATE": "1960",
 *   },
 *   value: undefined,
 *   children: [],
 * }
 * ```
 *
 * If there are multiple values for something like a birth date, they'll be
 * included in an additional property with a `+`:
 *
 * {
 *   "BIRTH/DATE": "12 MAY 1920",
 *   "+BIRTH/DATE": ["13 MAY 1920"],
 * }
 *
 * This also removes nodes from the syntax tree that are unlikely
 * to have any use for genealogical or visualization applications.
 *
 * @param root - a parsed GEDCOM document
 * @param removeNodes - a list of nodes that should be removed.
 * @returns the same document, with attributes compacted.
 */
export function compact(
  root: Parent,
  removeNodes: string[] = ["TRLR", "SUBM", "SUBN", "HEAD", "NOTE", "SOUR"],
): Parent {
  // Remove "trailer" objects, which are not useful to us.
  remove(root, removeNodes);
  for (const child of root.children) {
    if (!child.data) child.data = {};
    visitParents(child, (node, ancestors) => {
      const path = ancestors
        .slice(1)
        .concat(node)
        .map((a) => a.data?.formal_name || a.type)
        .join("/");
      if (node.data?.value) {
        addValue(child.data!, path, node.data.value);
      } else if (node.data?.pointer) {
        addValue(child.data!, `@${path}`, node.data.pointer);
      }
    });
    // FIXME: should this be brought back?
    child.children = [];
  }
  return root;
}
