import { Parent } from "unist";
import dot from "graphlib-dot";
import { toGraphlib } from "./to-graphlib";

export function toDot(root: Parent): string {
  return dot.write(toGraphlib(root));
}
