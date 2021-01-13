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

// export type Line = {
//   level: number;
//   tag: TagName;
//   xref_id?: string;
//   pointer?: string;
//   value?: string;
// };

export type Pos = {
  line: number;
  column: number;
  offset: number;
};

export type Token = {
  type: "level" | "eol";
  value?: string;
  start: Pos;
  end: Pos;
};

function ws(code: number) {
  return code === 9 /* `\t` */ || code === 32; /* ` ` */
}

type TokenType = Token["type"];

const rTerminator = new RegExp("(\\r|\\n|\\r\\n|\\n\\r)", "g");

/**
 * Lowest-level API to parse-gedcom: parses a single line
 * of GEDCOM into its constituent tag, level, xref_id,
 * and so on. It's unlikely that external applications would use this API.
 * Instead they will more often use `parse`.
 *
 * @param buf - One line of GEDCOM data as a string
 * @returns a line object.
 */
export function tokenize(buffer: string): Token[] {
  let line = 1;
  let column = 1;
  let offset = 0;
  // GEDCOM supports \n, \r, \r\n, and \n\r, so search for the first.
  let end = Math.min(buffer.indexOf("\n"), buffer.indexOf("\r"));
  let start = 0;
  let value;
  let eol;
  const tokens: Token[] = [];

  function add(type: TokenType, value: string) {
    let start = now();

    offset += value.length;
    column += value.length;

    // Note that only a final line feed is supported: it’s assumed that
    // they’ve been split over separate tokens already.
    if (value.charCodeAt(value.length - 1) === 10 /* `\n` */) {
      line++;
      column = 1;
    }

    let token: Token = {
      type,
      start,
      end: now(),
    };
    if (value) token.value = value;
    tokens.push(token);
  }

  function now() {
    return { line: line, column: column, offset: offset };
  }

  while (end > -1) {
    value = buffer.slice(start, end);
    if (value.charCodeAt(value.length - 1) === 13 /* `\r` */) {
      value = value.slice(0, -1);
      eol = "\r\n";
    } else if (value.charCodeAt(value.length - 1) === 13 /* `\r` */) {
      // TODO: fix for this case
      value = value.slice(0, -1);
      eol = "\n\r";
    } else {
      eol = "\n";
    }

    parseLine(value);
    add("eol", eol);

    start = end + 1;
    end = buffer.indexOf("\n", start);
  }

  function parseLine(value: string) {
    let code = value.charCodeAt(0);
    let start;
    let index = 0;

    // Allow any amount of whitespace at the beginning of a line
    while (ws(value.charCodeAt(index))) index++;

    code = value.charCodeAt(index);

    // 0-9
    if (code >= 48 && code <= 59) {
      let secondDigit = value.charCodeAt(index + 1);
      const hasSecondDigit = (secondDigit >= 48 && secondDigit <= 59)
      add('level', value.slice(index, hasSecondDigit 
    }
  }

  // input.split(rTerminator);
  // function expect(re: RegExp, message: string) {
  //   const match = buf.match(re);
  //   if (!match) throw new Error(message);
  //   buf = buf.substring(match[0].length);
  //   return match[1];
  // }

  // buf = buf.trimStart();
  // let xref_id: string | undefined = undefined;
  // const levelStr = expect(rLevel, "Expected level");

  // if (levelStr.length > 2 || (levelStr.length === 2 && levelStr[0] === "0")) {
  //   throw new Error(`Invalid level: ${levelStr}`);
  // }

  // const level = parseInt(levelStr);

  // expect(rDelim, "Expected delimiter after level");

  // const xref = buf.match(rPointer);
  // if (xref) {
  //   xref_id = xref[0];
  //   buf = buf.substring(xref[0].length);
  //   expect(rDelim, "Expected delimiter after pointer");
  // }

  // const tag = expect(rTag, "Expected tag") as TagName;

  // let line: Line = {
  //   level,
  //   tag,
  // };

  // if (xref_id) line.xref_id = xref_id;

  // const delim = buf.match(rDelim);
  // if (delim) {
  //   buf = buf.substring(delim[0].length);
  //   const pointer_match = buf.match(rPointer);
  //   const value_match = buf.match(rLineItem);
  //   if (pointer_match) {
  //     line.pointer = pointer_match[0];
  //   } else if (value_match) {
  //     line.value = value_match[1];
  //   }
  // }

  return tokens;
}
