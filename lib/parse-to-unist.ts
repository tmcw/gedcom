import { tokenize } from "./tokenize";
import { FORMAL_NAMES } from "./formal_names";
import { Parent } from "unist";

const rTerminator = new RegExp("(\\r|\\n|\\r\\n|\\n\\r)", "g");

/**
 * Parse a string of GEDCOM data into an unist-compatible
 * abstract syntax tree. This is the core function for transforming
 * GEDCOM into JSON data that captures all of its detail, but
 * for practical usage you may also want to run `compact`
 * on the generated syntax tree to compress attributes.
 *
 * **Note**: the AST format uses 'children' to indicate the children
 * of abstract syntax tree nodes, but these are not equivalent to
 * parent/child relationships in family data.
 *
 * @param input - GEDCOM data as a string
 * @returns ast
 */
export function parse(input: string): Parent {
  let root: Parent = {
    type: "root",
    children: [],
  };

  const lines = input.split(rTerminator).filter((str) => str.trim());

  let stack: Parent[] = [];
  let lastLevel = 0;

  for (const line of lines) {
    const { level, xref_id, tag, value, pointer } = tokenize(line);
    const formal_name = FORMAL_NAMES[tag];
    const node: Parent = {
      type: tag,
      data: {
        formal_name,
      },
      value,
      children: [],
    };

    if (xref_id) node.data!.xref_id = xref_id;
    if (pointer) node.data!.pointer = pointer;
    if (tag.startsWith("_")) node.data!.custom_tag = true;

    if (tag === "CONC" || tag === "CONT") {
      if (pointer) throw new Error("Cannot concatenate a pointer");
      const head = stack[stack.length - 1];
      // If this is a NOTE tag, it may not have any text at the beginning.
      if (!head.value) head.value = "";
      if (tag === "CONT") head.value += "\n";
      if (value) {
        head.value += value;
      }

      continue;
    }

    if (level == 0) {
      root.children.push(node);
      stack = [node];
    } else if (lastLevel == level - 1) {
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else if (level <= lastLevel) {
      for (let i = 0; i <= lastLevel - level; i++) {
        stack.pop();
      }
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else {
      throw new Error(
        `Illegal nesting: transition from ${lastLevel} to ${level}`
      );
    }
    lastLevel = level;
  }

  return root;
}
