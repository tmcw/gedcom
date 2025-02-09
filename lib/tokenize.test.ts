import { expect, test } from "vitest";
import { tokenize } from "./tokenize.js";

test("parser", () => {
  expect(tokenize("0 HEAD")).toEqual({ level: 0, tag: "HEAD" });

  expect(tokenize("  \t 1 NAME Will /Rogers/")).toEqual({
    level: 1,
    tag: "NAME",
    value: "Will /Rogers/",
  });

  expect(tokenize("  \t 1 SOUR SPACE AFTER ")).toEqual({
    level: 1,
    tag: "SOUR",
    value: "SPACE AFTER ",
  });

  expect(tokenize("12 _USER_DEFINED_TAG X")).toEqual({
    level: 12,
    tag: "_USER_DEFINED_TAG",
    value: "X",
  });

  expect(tokenize("0 @I1@ INDI")).toEqual({
    level: 0,
    xref_id: "@I1@",
    tag: "INDI",
  });

  expect(tokenize("0 @I-1WITHHYPHEN@ INDI")).toEqual({
    level: 0,
    xref_id: "@I-1WITHHYPHEN@",
    tag: "INDI",
  });

  expect(tokenize("1 CHIL @1234@")).toEqual({
    level: 1,
    tag: "CHIL",
    pointer: "@1234@",
  });

  expect(tokenize("0 INDI")).toEqual({
    level: 0,
    tag: "INDI",
  });
});

test("parser error conditions", () => {
  expect(() => {
    tokenize("1");
  }).toThrow();

  expect(() => {
    tokenize("01 INDI");
  }).toThrow();
});
