import { test } from "tap";
import { parse } from "./parse-to-unist";

test("parser", (t) => {
  t.same(
    parse(
      `0 INDI
    1 BIRT
    2 DATE 12 MAY 1920
    1 DEAT
    2 DATE 1960`
    ),
    {
      type: "root",
      children: [
        {
          type: "INDI",
          data: {
            formal_name: "INDIVIDUAL",
          },
          value: undefined,
          children: [
            {
              type: "BIRT",
              data: {
                formal_name: "BIRTH",
              },
              value: undefined,
              children: [
                {
                  type: "DATE",
                  data: {
                    formal_name: "DATE",
                  },
                  value: "12 MAY 1920",
                  children: [],
                },
              ],
            },
            {
              type: "DEAT",
              data: {
                formal_name: "DEATH",
              },
              value: undefined,
              children: [
                {
                  type: "DATE",
                  data: {
                    formal_name: "DATE",
                  },
                  value: "1960",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }
  );

  t.end();
});

test("parser - multiple root entities", (t) => {
  t.same(
    parse(
      `0 INDI
    1 NAME John
    0 INDI
    1 NAME Tom`
    ),
    {
      type: "root",
      children: [
        {
          type: "INDI",
          data: {
            formal_name: "INDIVIDUAL",
          },
          value: undefined,
          children: [
            {
              type: "NAME",
              data: {
                formal_name: "NAME",
              },
              value: "John",
              children: [],
            },
          ],
        },
        {
          type: "INDI",
          data: {
            formal_name: "INDIVIDUAL",
          },
          value: undefined,
          children: [
            {
              type: "NAME",
              data: {
                formal_name: "NAME",
              },
              value: "Tom",
              children: [],
            },
          ],
        },
      ],
    }
  );

  t.end();
});

test("parser - concatenation", (t) => {
  t.same(
    parse(`
0 SOUR Waters, Henry F., Genealogical Gleanings in England: Abstracts of W
1 CONC ills Relating to Early American Families. 2 vols., reprint 1901, 190
1 CONC 7. Baltimore: Genealogical Publishing Co., 1981.
1 CONT Stored in Family History Library book 942 D2wh; films 481,057-58 Vol 2, pa 
1 CONC ge 388.`).children[0].value,
    "Waters, Henry F., Genealogical Gleanings in England: Abstracts of Wills Relating to Early American Families. 2 vols., reprint 1901, 1907. Baltimore: Genealogical Publishing Co., 1981.\nStored in Family History Library book 942 D2wh; films 481,057-58 Vol 2, pa ge 388."
  );
  t.end();
});

test("parser - concatenation", (t) => {
  t.throws(() => {
    parse(`
0 SOUR Waters, Henry F., Genealogical Gleanings in England: Abstracts of W
1 CONC ills Relating to Early American Families. 2 vols., reprint 1901, 190
1 CONC @123@`).children[0].value,
      "Waters, Henry F., Genealogical Gleanings in England: Abstracts of Wills Relating to Early American Families. 2 vols., reprint 1901, 1907. Baltimore: Genealogical Publishing Co., 1981.\nStored in Family History Library book 942 D2wh; films 481,057-58 Vol 2, pa ge 388.";
  });
  t.end();
});

test("parser - error, too large a jump", (t) => {
  t.throws(() => {
    parse(
      `0 INDI
    2 BIRT`
    );
  });

  t.end();
});
