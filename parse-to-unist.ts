import { tokenize } from "./tokenize";
import { FORMAL_NAMES } from "./formal_names";
import { Parent } from "unist";

const rTerminator = new RegExp("(\\r|\\n|\\r\\n|\\n\\r)", "g");

export function parse(input: string): Parent {
  let root: Parent = {
    type: "root",
    children: [],
  };

  const lines = input.split(rTerminator).filter((str) => str.trim());

  let stack: Parent[] = [];
  let lastLevel = 0;

  for (const line of lines) {
    const { level, tag, value, pointer } = tokenize(line);
    const formal_name = FORMAL_NAMES[tag];
    const node: Parent = {
      type: tag,
      data: {
        formal_name,
      },
      value,
      children: [],
    };

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
