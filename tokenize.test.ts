import { test } from "tap";
import { tokenize } from "./tokenize";

test("parser", (t) => {
  t.same(tokenize("0 HEAD"), [
    { type: "LEVEL", value: 0, raw: "0" },
    { type: "TAG", raw: "HEAD" },
  ]);

  t.same(tokenize("  \t 1 NAME Will /Rogers/"), [
    { type: "LEVEL", value: 1, raw: "1" },
    { type: "TAG", raw: "NAME" },
    { type: "LINEVALUE", raw: "Will /Rogers/" },
  ]);

  t.same(tokenize("  \t 1 SOUR SPACE AFTER "), [
    { type: "LEVEL", value: 1, raw: "1" },
    { type: "TAG", raw: "SOUR" },
    { type: "LINEVALUE", raw: "SPACE AFTER " },
  ]);

  t.same(tokenize("1 _USER_DEFINED_TAG X"), [
    { type: "LEVEL", value: 1, raw: "1" },
    { type: "TAG", raw: "_USER_DEFINED_TAG" },
    { type: "LINEVALUE", raw: "X" },
  ]);

  t.same(tokenize("0 @I1@ INDI"), [
    { type: "LEVEL", value: 0, raw: "0" },
    { type: "XREF_ID", raw: "@I1@" },
    { type: "TAG", raw: "INDI" },
  ]);

  t.same(tokenize("1 CHIL @1234@"), [
    { type: "LEVEL", value: 1, raw: "1" },
    { type: "TAG", raw: "CHIL" },
    { type: "POINTER", raw: "@1234@" },
  ]);

  t.end();
});
