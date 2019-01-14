const parsePerson = person => {
  let data = [];
  let level = 1;
  let tag;
  let pointer;
  let value;
  let id;
  for (let { type: t, raw: r, value: v } of person) {
    if (t === "LEVEL") {
      level = v;
    } else if (t === "TAG") {
      tag = r;
    } else if (t === "LINEVALUE") {
      value = r || v;
    } else if (t === "XREF_ID") {
      id = r;
    } else if (t === "POINTER") {
      pointer = r;
    } else if (t === "TERMINATOR") {
      data.push({
        level,
        tag,
        value,
        pointer,
        id
      });
      tag = pointer = value = id = undefined;
    }
  }
  let name = data.find(({ tag }) => tag === "NAME");
  let parentFamily = data.find(({ tag }) => tag === "FAMS");
  let childFamily = data.find(({ tag }) => tag === "FAMC");
  let husb = data.find(({ tag }) => tag === "HUSB");
  let wife = data.find(({ tag }) => tag === "WIFE");
  let children = data.filter(({ tag }) => tag === "CHIL");
  let obj = {
    name: name && name.value,
    parentFamily: parentFamily && parentFamily.pointer,
    childFamily: childFamily && childFamily.pointer,
    husb: husb && husb.pointer,
    wife: wife && wife.pointer,
    children: children && children.map(c => c.pointer),
    type: data[0].tag,
    id: data[0].id,
    data
  };
  return obj;
};

const entities = tokens => {
  let chunks = [];
  let chunk = [];
  for (let tok of tokens) {
    if (tok.type === "LEVEL" && tok.value == 0) {
      chunks.push(chunk);
      chunk = [];
    } else {
      chunk.push(tok);
    }
  }
  chunks.push(chunk);
  chunks.shift();
  chunks.shift();
  let all = chunks.map(parsePerson).map(ent => [ent.id, ent]);
  return {
    all: new Map(all),
    people: new Map(all.filter(([k, v]) => v.type === "INDI")),
    families: new Map(all.filter(([k, v]) => v.type === "FAM"))
  };
};

const cDigit = "0-9";
const rLevel = new RegExp(`^([${cDigit}]*)`);
const cDelim = " ";
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
const rTag = new RegExp(`^([${cAlphanum}])+`);
const rLineItem = new RegExp(/^(.*)/);
const rTerminator = new RegExp("^(\\r|\\n|\\r\\n|\\n\\r)");

const tokenize = function* tokenize(line) {
  const tokens = [];
  let buf = line;
  while (buf.length) {
    {
      const level = buf.match(rLevel);
      if (!level) throw new Error("Expected level");
      yield {
        type: "LEVEL",
        value: parseInt(level[0]),
        raw: level[0]
      };
      buf = buf.substring(level[0].length);
    }
    {
      const delim = buf.match(rDelim);
      if (!delim) throw new Error("Expected delimiter after level");
      yield {
        type: "DELIM",
        raw: delim[0]
      };
      buf = buf.substring(delim[0].length);
    }
    {
      const pointer = buf.match(rPointer);
      if (pointer) {
        yield {
          type: "XREF_ID",
          raw: pointer[0]
        };
        buf = buf.substring(pointer[0].length);
        {
          const delim = buf.match(rDelim);
          if (!delim) throw new Error("Expected delimiter after pointer");
          yield {
            type: "DELIM",
            raw: delim[0]
          };
          buf = buf.substring(delim[0].length);
        }
      }
    }
    {
      const tag = buf.match(rTag);
      if (!tag) throw new Error("Expected tag");
      yield {
        type: "TAG",
        raw: tag[0]
      };
      buf = buf.substring(tag[0].length);
    }
    {
      const delim = buf.match(rDelim);
      if (delim) {
        tokens.push({
          type: "DELIM",
          raw: delim[0]
        });
        buf = buf.substring(delim[0].length);
        {
          const pointer = buf.match(rPointer);
          const lineItem = buf.match(rLineItem);
          if (pointer) {
            yield {
              type: "POINTER",
              raw: pointer[0]
            };
            buf = buf.substring(pointer[0].length);
          } else if (lineItem) {
            yield {
              type: "LINEVALUE",
              raw: lineItem[0]
            };
            buf = buf.substring(lineItem[0].length);
          }
        }
      }
    }
    {
      const terminator = buf.match(rTerminator);
      if (!terminator) return;
      yield {
        type: "TERMINATOR",
        raw: terminator[0]
      };
      buf = buf.substring(terminator[0].length);
    }
  }
};

export { entities, tokenize };
