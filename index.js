const tags = require("./tags");

module.exports.tags = tags;

module.exports.parse = function parse(str) {
  const lines = str.split("\n").filter(String);
  return lines.map(parseLine);
};

// http://wiki-en.genealogy.net/GEDCOM/NAME-Tag
const parsers = {
  NAME: function parseName(value) {
    const match = value.match(/(.*)\/(.*)\/(.*)/);
    if (match) {
      const [_, before, surname, after] = match;
      return { surname, name: before + surname + after };
    } else {
      return { name: value };
    }
  }
};

// http://homepages.rootsweb.com/~pmcbride/gedcom/55gcch1.htm
function parseLine(str) {
  const match = str.match(/([0-9]+)\s(@\w+@\s)?(\w+)(\s(.*))?/);

  if (!match) {
    console.error(`line: ${str}`);
    throw new Error("could not parse line");
  }

  const [_, level, xref_id, tag, _2, value] = match;

  if (level.length > 1 && level[0] === "0") {
    console.error(`line: ${str}`);
    throw new Error("non-zero level cannot start with 0");
  }

  let parsed;
  if (parsers[tag]) {
    parsed = parsers[tag](value);
  }

  return {
    level: parseInt(level),
    tag,
    value,
    parsed
  };
}
