import { test } from "tap";
import { parse } from "./parse";

test("parser", (t) => {
  t.matchSnapshot(
    parse(
      `0 INDI
    1 BIRT
    2 DATE 12 MAY 1920
    1 DEAT
    2 DATE 1960`
    )
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

test("parser - error, too large a jump", (t) => {
  t.throws(() => {
    parse(
      `0 INDI
    2 BIRT`
    );
  });

  t.end();
});
