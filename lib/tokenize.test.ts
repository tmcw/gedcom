import { test } from "tap";
import { tokenize } from "./tokenize";

test("parser", (t) => {
  t.same(tokenize("0"), [{ type: "LEVEL", value: 0 }]);

  // t.same(tokenize("  \t 1 NAME Will /Rogers/"), {
  //   level: 1,
  //   tag: "NAME",
  //   value: "Will /Rogers/",
  // });

  // t.same(tokenize("  \t 1 SOUR SPACE AFTER "), {
  //   level: 1,
  //   tag: "SOUR",
  //   value: "SPACE AFTER ",
  // });

  // t.same(tokenize("12 _USER_DEFINED_TAG X"), {
  //   level: 12,
  //   tag: "_USER_DEFINED_TAG",
  //   value: "X",
  // });

  // t.same(tokenize("0 @I1@ INDI"), {
  //   level: 0,
  //   xref_id: "@I1@",
  //   tag: "INDI",
  // });

  // t.same(tokenize("1 CHIL @1234@"), {
  //   level: 1,
  //   tag: "CHIL",
  //   pointer: "@1234@",
  // });

  // t.same(tokenize("0 INDI"), {
  //   level: 0,
  //   tag: "INDI",
  // });

  t.end();
});

// test("parser error conditions", (t) => {
//   t.throws(() => {
//     tokenize("1");
//   });
//
//   t.throws(() => {
//     tokenize("01 INDI");
//   });
//
//   t.end();
// });
