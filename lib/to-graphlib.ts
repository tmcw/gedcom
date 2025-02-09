import { Graph } from "graphlib";
import { toD3Force } from "./to-d3-force";
import { Parent } from "./types";

/**
 * Transforms a GEDCOM AST into a [Graphlib](https://github.com/dagrejs/graphlib)
 * Graph object.
 *
 * @param root - Parsed GEDCOM content
 * @returns graphviz Graph object
 */
export function toGraphlib(root: Parent): Graph {
	const { nodes, links } = toD3Force(root);

	var digraph = new Graph();

	for (let node of nodes) {
		const NAME = node.data?.NAME;
		digraph.setNode(node.data?.xref_id as string, {
			label: NAME ? String(NAME).replace(/^@/, "") : node.type,
		});
	}
	for (let link of links) {
		digraph.setEdge(link.source, link.target, { label: link.value });
	}

	return digraph;
}
