const fs = require("fs");
const { parse, tags } = require("./index");

test("parser", () => {
  const lines = parse(fs.readFileSync("./sample-norefs.ged", "utf8"));
  expect(lines[0]).toEqual({
    level: 0,
    tag: "HEAD"
  });
  expect(lines[1]).toEqual({
    level: 1,
    tag: "SOUR",
    value: "PAF"
  });
});

test("parser-refs", () => {
  expect(parse("1 NAME Elizabeth /Stansfield/")[0]).toEqual({
    level: 1,
    tag: "NAME",
    value: "Elizabeth /Stansfield/",
    parsed: {
      name: "Elizabeth Stansfield",
      surname: "Stansfield"
    }
  });
});

test("tags", () => {
  expect(tags.WILL).toEqual({
    tag: "WILL",
    expanded: "WILL",
    description:
      "A legal document treated as an event, by which a person disposes of his or her estate, to take effect after death. The event date is the date the will was signed while the person was alive. (See also PROBate.)"
  });
});
