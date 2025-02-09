import type { Node, Parent } from "./types.js";
import { compact } from "./unist-compact.js";

type Link = {
  source: string;
  target: string;
  value: string;
};

type ForceData = {
  nodes: (Node | Parent)[];
  links: Link[];
};

function removeBidirectionals(linkIndex: Map<string, Link[]>, links: Link[]) {
  const pairs = [
    ["@HUSBAND", "@FAMILY_SPOUSE"],
    ["@WIFE", "@FAMILY_SPOUSE"],
    ["@FAMILY_CHILD", "@CHILD"],
  ];

  for (const [_, group] of linkIndex) {
    for (const pair of pairs) {
      const [a, b] = pair.map((key) =>
        group.find((elem) => elem.value === key),
      );
      if (a && b) {
        links.splice(links.indexOf(a), 1);
      }
    }
  }
}

/**
 * Transforms a GEDCOM AST - likely produced using
 * `parse` - into a data structure suited for
 * a [D3 force directed graph](https://observablehq.com/@d3/force-directed-graph)
 * layout.
 *
 * @param root - Parsed GEDCOM content
 * @returns D3-friendly JSON
 */
export function toD3Force(root: Parent): ForceData {
  const compacted = compact(root);
  const nodes = compacted.children;

  const index = new Set<string>(
    nodes.map((child) => child.data?.xref_id as string).filter(Boolean),
  );

  const links: Link[] = [];
  const linkIndex = new Map<string, Link[]>();

  for (const node of nodes) {
    if (!node.data) continue;
    for (const [key, value] of Object.entries(node.data).filter(([key, _]) =>
      key.startsWith("@"),
    )) {
      if (!index.has(value as string)) {
        throw new Error(`Undefined reference: ${value}`);
      }
      if (!node.data?.xref_id) {
        throw new Error(`Link from node with no xref id`);
      }
      const source = node.data?.xref_id as string;
      const target = value as string;
      const link = {
        source,
        target,
        value: key,
      };
      links.push(link);
      const idxKey = [source, target].sort().join("/");
      if (!linkIndex.has(idxKey)) {
        linkIndex.set(idxKey, [link]);
      } else {
        linkIndex.get(idxKey)!.push(link);
      }
    }
  }

  removeBidirectionals(linkIndex, links);

  return {
    nodes,
    links,
  };
}
