import { FORMAL_NAMES } from "./formal_names";

const cDigit = "0-9";
const rLevel = new RegExp(`^([${cDigit}]*)`);
const cDelim = new RegExp("(\\s+)");
const rDelim = new RegExp(`^([${cDelim}])`);
const cAt = "@";
const cAlpha = "A-ZÀ-ÿa-z_";
const cAlphanum = `${cAlpha}${cDigit}`;
const cHash = "#";
const cNonAt = `${cAlpha}${cDigit}${cDelim}${cHash}`;
const cPointerChar = cNonAt;
const rPointer = new RegExp(
  `^${cAt}([${cAlphanum}])([${cPointerChar}])*${cAt}`
);
const rTag = new RegExp(`^(_?[${cAlphanum}]+)`);
const rLineItem = new RegExp(/^(.*)/);

type TagName = keyof typeof FORMAL_NAMES;

type Line = {
  level: number;
  tag: TagName;
  xref_id?: string;
  pointer?: string;
  value?: string;
};

export function tokenize(buf: string): Line {
  function expect(re: RegExp, message: string) {
    const match = buf.match(re);
    if (!match) throw new Error(message);
    buf = buf.substring(match[0].length);
    return match[1];
  }

  buf = buf.trimStart();
  let xref_id: string | undefined = undefined;
  const level = parseInt(expect(rLevel, "Expected level"));
  expect(rDelim, "Expected delimiter after level");

  const xref = buf.match(rPointer);
  if (xref) {
    xref_id = xref[0];
    buf = buf.substring(xref[0].length);
    expect(rDelim, "Expected delimiter after pointer");
  }

  const tag = expect(rTag, "Expected tag") as TagName;

  let line: Line = {
    level,
    tag,
  };

  if (xref_id) line.xref_id = xref_id;

  const delim = buf.match(rDelim);
  if (delim) {
    buf = buf.substring(delim[0].length);
    const pointer_match = buf.match(rPointer);
    const value_match = buf.match(rLineItem);
    if (pointer_match) {
      line.pointer = pointer_match[0];
    } else if (value_match) {
      line.value = value_match[1];
    }
  }

  return line;
}
