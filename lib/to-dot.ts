import { Parent } from "unist";
import dot from "graphlib-dot";
import { toGraphlib } from "./to-graphlib";

/**
 * Transforms a GEDCOM AST - likely produced using
 * `parse` - into a [Graphviz DOT](https://graphviz.org/doc/info/lang.html)
 * language file.
 *
 * @param root - Parsed GEDCOM content
 * @returns DOT-formatted graph
 */
export function toDot(root: Parent): string {
  return dot.write(toGraphlib(root));
}
