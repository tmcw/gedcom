import type { FORMAL_NAMES } from "./formal_names.js";

const cDigit = "0-9";
const rLevel = new RegExp(`^([${cDigit}]*)`);
const cDelim = /(\s+)/;
const rDelim = new RegExp(`^([${cDelim}])`);
const cAt = "@";
const cAlpha = "A-ZÀ-ÿa-z_";
const cAlphanum = `${cAlpha}${cDigit}`;
const cHash = "#";
const cNonAt = `${cAlpha}${cDigit}${cDelim}${cHash}`;
const cPointerChar = cNonAt;
const rPointer = new RegExp(
  `^${cAt}([${cAlphanum}])([${cPointerChar}\\-])*${cAt}`,
);
const rTag = new RegExp(`^(_?[${cAlphanum}]+)`);
const rLineItem = new RegExp(/^(.*)/);

type TagName = keyof typeof FORMAL_NAMES;

export type Line = {
  level: number;
  tag: TagName;
  xref_id?: string;
  pointer?: string;
  value?: string;
};

/**
 * Lowest-level API to parse-gedcom: parses a single line
 * of GEDCOM into its constituent tag, level, xref_id,
 * and so on. It's unlikely that external applications would use this API.
 * Instead they will more often use `parse`.
 *
 * @param buf - One line of GEDCOM data as a string
 * @returns a line object.
 */
export function tokenize(buf: string, lineNumber: number): Line {
  function expect(re: RegExp, message: string) {
    const match = buf.match(re);
    if (!match) throw new Error(`${message} at line ${lineNumber}`);
    buf = buf.substring(match[0].length);
    return match[1];
  }

  buf = buf.trimStart();
  let xref_id: string | undefined = undefined;
  const levelStr = expect(rLevel, "Expected level");

  if (levelStr.length > 2 || (levelStr.length === 2 && levelStr[0] === "0")) {
    throw new Error(`Invalid level: ${levelStr} at line ${lineNumber}`);
  }

  const level = Number.parseInt(levelStr);

  expect(rDelim, "Expected delimiter after level");

  const xref = buf.match(rPointer);
  if (xref) {
    xref_id = xref[0];
    buf = buf.substring(xref[0].length);
    expect(rDelim, "Expected delimiter after pointer");
  }

  const tag = expect(rTag, "Expected tag") as TagName;

  const line: Line = {
    level,
    tag,
  };

  if (xref_id) line.xref_id = xref_id;

  const plaintext = (tag === "CONC" || tag === "CONT" || tag === "NOTE");
  const delim = buf.match(rDelim);
  if (delim) {
    buf = buf.substring(delim[0].length);
    const pointer_match = !plaintext && buf.match(rPointer);
    const value_match = buf.match(rLineItem);
    if (pointer_match) {
      line.pointer = pointer_match[0];
    } else if (value_match) {
      line.value = value_match[1];
    }
  }

  return line;
}
