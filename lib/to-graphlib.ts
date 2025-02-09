import { Graph } from "graphlib";
import { toD3Force } from "./to-d3-force.js";
import type { Parent } from "./types.js";

/**
 * Transforms a GEDCOM AST into a [Graphlib](https://github.com/dagrejs/graphlib)
 * Graph object.
 *
 * @param root - Parsed GEDCOM content
 * @returns graphviz Graph object
 */
export function toGraphlib(root: Parent): Graph {
  const { nodes, links } = toD3Force(root);

  const digraph = new Graph();

  for (const node of nodes) {
    const NAME = node.data?.NAME;
    digraph.setNode(node.data?.xref_id as string, {
      label: NAME ? String(NAME).replace(/^@/, "") : node.type,
    });
  }
  for (const link of links) {
    digraph.setEdge(link.source, link.target, { label: link.value });
  }

  return digraph;
}
