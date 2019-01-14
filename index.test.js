const fs = require("fs");
const { tokenize, entities } = require("./");

test("parser", () => {
  expect(
    entities(tokenize(fs.readFileSync("./sample-norefs.ged", "utf8")))
  ).toMatchSnapshot();
});

test("parser-refs", () => {
  expect([...tokenize("1 NAME Elizabeth /Stansfield/")]).toMatchSnapshot();
});
