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
// const rTerminator = new RegExp("^(\\r|\\n|\\r\\n|\\n\\r)");

type Token = {
  type: string;
  raw: string;
  value?: number;
};

export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let buf = line.trimStart();

  function expect(re: RegExp, message: string) {
    const match = buf.match(re);
    if (!match) throw new Error(message);
    buf = buf.substring(match[0].length);
    return match[1];
  }

  const level = expect(rLevel, "Expected level");
  tokens.push({
    type: "LEVEL",
    value: parseInt(level),
    raw: level[0],
  });

  expect(rDelim, "Expected delimiter after level");

  {
    const pointer = buf.match(rPointer);
    if (pointer) {
      tokens.push({
        type: "XREF_ID",
        raw: pointer[0],
      });
      buf = buf.substring(pointer[0].length);
      {
        expect(rDelim, "Expected delimiter after pointer");
      }
    }
  }

  tokens.push({
    type: "TAG",
    raw: expect(rTag, "Expected tag"),
  });

  {
    const delim = buf.match(rDelim);
    if (delim) {
      buf = buf.substring(delim[0].length);
      {
        const pointer = buf.match(rPointer);
        const lineItem = buf.match(rLineItem);
        if (pointer) {
          tokens.push({
            type: "POINTER",
            raw: pointer[0],
          });
          buf = buf.substring(pointer[0].length);
        } else if (lineItem) {
          tokens.push({
            type: "LINEVALUE",
            raw: lineItem[0],
          });
          buf = buf.substring(lineItem[0].length);
        }
      }
    }
  }

  return tokens;
}
