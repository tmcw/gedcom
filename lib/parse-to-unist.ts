import { FORMAL_NAMES } from "./formal_names.js";
import type { Line } from "./tokenize.js";
import { tokenize } from "./tokenize.js";
import type { Parent } from "./types.js";

const rTerminator = /(\r|\n|\r\n|\n\r)/g;

function lineToNode({ tag, value, xref_id, pointer }: Line) {
  const formal_name = FORMAL_NAMES[tag];
  const node: Parent = {
    type: tag,
    data: {
      formal_name,
      ...(value !== undefined ? { value } : {}),
    },
    children: [],
  };

  if (xref_id) node.data!.xref_id = xref_id;
  if (pointer) node.data!.pointer = pointer;
  if (tag.startsWith("_")) node.data!.custom_tag = true;

  return node;
}

function handleContinued(
  { tag, value, pointer }: Line,
  head: Parent,
  lineNumber?: number,
) {
  if (!(tag === "CONC" || tag === "CONT")) return false;
  if (pointer)
    throw new Error(
      lineNumber
        ? `Cannot concatenate a pointer (CONC/CONT cannot have a pointer value) at line ${lineNumber}`
        : "Cannot concatenate a pointer (CONC/CONT cannot have a pointer value)",
    );
  // If this is a NOTE tag, it may not have any text at the beginning.
  if (head.data) {
    if (!head.data.value) head.data.value = "";
    if (tag === "CONT") head.data.value += "\n";
    if (value) {
      head.data.value += value;
    }
  }
  return true;
}

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
  const root: Parent = {
    data: {},
    type: "root",
    children: [],
  };

  const lines = input.split(rTerminator).filter((str) => str.trim());

  let stack: Parent[] = [];
  let lastLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const tokens = tokenize(lines[i], lineNumber);

    if (handleContinued(tokens, stack[stack.length - 1], lineNumber)) {
      continue;
    }

    const node = lineToNode(tokens);
    const { level } = tokens;

    if (level === 0) {
      root.children.push(node);
      stack = [node];
    } else if (lastLevel === level - 1 || level <= lastLevel) {
      for (let i = 0; i <= lastLevel - level; i++) {
        stack.pop();
      }
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else {
      throw new Error(
        `Illegal nesting at line ${lineNumber}: transition from level ${lastLevel} to ${level}`,
      );
    }
    lastLevel = level;
  }

  return root;
}
