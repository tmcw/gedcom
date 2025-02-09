import { expect, test } from "vitest";
import { parse } from "./parse-to-unist.js";

test("parser", () => {
  expect(
    parse(
      `0 INDI
    1 BIRT
    2 DATE 12 MAY 1920
    1 DEAT
    2 DATE 1960`,
    ),
  ).toEqual({
    type: "root",
    data: {},
    children: [
      {
        type: "INDI",
        data: {
          formal_name: "INDIVIDUAL",
        },
        children: [
          {
            type: "BIRT",
            data: {
              formal_name: "BIRTH",
            },
            children: [
              {
                type: "DATE",
                data: {
                  formal_name: "DATE",
                  value: "12 MAY 1920",
                },
                children: [],
              },
            ],
          },
          {
            type: "DEAT",
            data: {
              formal_name: "DEATH",
            },
            children: [
              {
                type: "DATE",
                data: {
                  formal_name: "DATE",
                  value: "1960",
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  });
});

test("parser - multiple root entities", () => {
  expect(
    parse(
      `0 INDI
    1 NAME John
    0 INDI
    1 NAME Tom`,
    ),
  ).toEqual({
    type: "root",
    data: {},
    children: [
      {
        type: "INDI",
        data: {
          formal_name: "INDIVIDUAL",
        },
        children: [
          {
            type: "NAME",
            data: {
              formal_name: "NAME",
              value: "John",
            },
            children: [],
          },
        ],
      },
      {
        type: "INDI",
        data: {
          formal_name: "INDIVIDUAL",
        },
        children: [
          {
            type: "NAME",
            data: {
              formal_name: "NAME",
              value: "Tom",
            },
            children: [],
          },
        ],
      },
    ],
  });
});

test("parser - pointers", () => {
  expect(
    parse(
      `0 @3@ INDI
      1 NAME Joe/Williams/
        1 SEX M
      1 BIRT
      2 DATE 11 JUN 1861
      2 PLAC Idaho Falls, Bonneville, Idaho
      2 FAMC @4@
      1 FAMC @4@
      1 FAMC @9@
      2 PEDI Adopted
      1 ADOP
      2 FAMC @9@
      2 DATE 16 MAR 1864
      1 SLGC
      2 FAMC @9@
      2 DATE 2 OCT 1987
      2 TEMP SLAKE`,
    ),
  ).toEqual({
    type: "root",
    data: {},
    children: [
      {
        type: "INDI",
        data: {
          xref_id: "@3@",
          formal_name: "INDIVIDUAL",
        },
        children: [
          {
            type: "NAME",
            data: {
              formal_name: "NAME",
              value: "Joe/Williams/",
            },
            children: [],
          },
          {
            type: "SEX",
            data: {
              formal_name: "SEX",
              value: "M",
            },
            children: [],
          },
          {
            type: "BIRT",
            data: {
              formal_name: "BIRTH",
            },
            children: [
              {
                type: "DATE",
                data: {
                  formal_name: "DATE",
                  value: "11 JUN 1861",
                },
                children: [],
              },
              {
                type: "PLAC",
                data: {
                  formal_name: "PLACE",
                  value: "Idaho Falls, Bonneville, Idaho",
                },
                children: [],
              },
              {
                type: "FAMC",
                data: {
                  formal_name: "FAMILY_CHILD",
                  pointer: "@4@",
                },
                children: [],
              },
            ],
          },
          {
            type: "FAMC",
            data: {
              formal_name: "FAMILY_CHILD",
              pointer: "@4@",
            },
            children: [],
          },
          {
            type: "FAMC",
            data: {
              formal_name: "FAMILY_CHILD",

              pointer: "@9@",
            },
            children: [
              {
                type: "PEDI",
                data: {
                  formal_name: "PEDIGREE",
                  value: "Adopted",
                },
                children: [],
              },
            ],
          },
          {
            type: "ADOP",
            data: {
              formal_name: "ADOPTION",
            },
            children: [
              {
                type: "FAMC",
                data: {
                  formal_name: "FAMILY_CHILD",
                  pointer: "@9@",
                },
                children: [],
              },
              {
                type: "DATE",
                data: {
                  formal_name: "DATE",
                  value: "16 MAR 1864",
                },
                children: [],
              },
            ],
          },
          {
            type: "SLGC",
            data: {
              formal_name: "SEALING_CHILD",
            },
            children: [
              {
                type: "FAMC",
                data: {
                  formal_name: "FAMILY_CHILD",
                  pointer: "@9@",
                },
                children: [],
              },
              {
                type: "DATE",
                data: {
                  formal_name: "DATE",
                  value: "2 OCT 1987",
                },
                children: [],
              },
              {
                type: "TEMP",
                data: {
                  formal_name: "TEMPLE",
                  value: "SLAKE",
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  });
});

test("parser - concatenation", () => {
  expect(
    parse(`
  0 SOUR Waters, Henry F., Genealogical Gleanings in England: Abstracts of W
  1 CONC ills Relating to Early American Families. 2 vols., reprint 1901, 190
  1 CONC 7. Baltimore: Genealogical Publishing Co., 1981.
  1 CONT Stored in Family History Library book 942 D2wh; films 481,057-58 Vol 2, pa 
  1 CONC ge 388.`).children[0].data?.value,
  ).toEqual(
    "Waters, Henry F., Genealogical Gleanings in England: Abstracts of Wills Relating to Early American Families. 2 vols., reprint 1901, 1907. Baltimore: Genealogical Publishing Co., 1981.\nStored in Family History Library book 942 D2wh; films 481,057-58 Vol 2, pa ge 388.",
  );
});

test("parser - concatenation", () => {
  expect(() => {
    parse(`
0 SOUR Waters, Henry F., Genealogical Gleanings in England: Abstracts of W
1 CONC ills Relating to Early American Families. 2 vols., reprint 1901, 190
1 CONC @123@`).children[0].data?.value;
  }).toThrow();
});

test("parser - error, too large a jump", (t) => {
  expect(() => {
    parse(
      `0 INDI
    2 BIRT`,
    );
  }).toThrow();
});
