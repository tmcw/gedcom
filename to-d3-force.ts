import { Node, Parent } from "unist";
import { compact } from "./unist-compact";

type Link = {
  source: string;
  target: string;
  value: string;
};

type ForceData = {
  nodes: Node[];
  links: Link[];
};

export function toD3Force(root: Parent): ForceData {
  const compacted = compact(root);
  const nodes = compacted.children;

  const index = new Set<string>(
    nodes.map((child) => child.data?.xref_id as string).filter(Boolean)
  );

  const links: Link[] = [];
  nodes.forEach((node) => {
    if (!node.data) return;
    Object.entries(node.data)
      .filter(([key, _]) => key.startsWith("@"))
      .forEach(([key, value]) => {
        if (!index.has(value as string)) {
          throw new Error(`Undefined reference: ${value}`);
        }
        if (!node.data?.xref_id) {
          throw new Error(`Link from node with no xref id`);
        }
        links.push({
          source: node.data?.xref_id as string,
          target: value as string,
          value: key,
        });
      });
  });

  return {
    nodes,
    links,
  };
}
