import { test } from "tap";
import { parse } from "./parse-to-unist";
import { toDot } from "./to-dot";

test("toD3Force", (t) => {
  t.same(
    toDot(
      parse(`0 HEAD
1 GEDC
2 VERS 5.5.5
2 FORM LINEAGE-LINKED
3 VERS 5.5.5
1 CHAR UTF-8
1 SOUR gedcom.org
2 NAME The GEDCOM Site
2 VERS 5.5.5
2 CORP gedcom.org
3 ADDR
4 CITY LEIDEN
3 WWW www.gedcom.org
1 DATE 2 Oct 2019
2 TIME 0:00:00
1 FILE SSMARR.GED
1 LANG English
1 SUBM @U1@
0 @U1@ SUBM
1 NAME gedcom.org
1 ADDR
2 CITY Leiden 
1 WWW www.gedcom.org
0 @I1@ INDI
1 NAME John /Smith/
2 SURN Smith
2 GIVN John
1 SEX M
1 BIRT
2 DATE 1 Sep 1991
2 PLAC Philadelphia, Philadelphia, Pennsylvania, United States of America
1 FAMS @F1@
0 @I2@ INDI
1 NAME Steven /Stevens/
2 SURN Stevens
2 GIVN Steven
1 SEX M
1 BIRT
2 DATE 8 Aug 1988
2 PLAC Seattle, King, Washington, United States of America
1 FAMS @F1@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 MARR
2 DATE 26 Jun 2015
2 PLAC Portland, Mutnomah, Oregon, United States of America
0 TRLR`)
    ),
    `strict digraph {
  \"@I1@\" [label=\"John /Smith/\"]
  \"@I2@\" [label=\"Steven /Stevens/\"]
  \"@F1@\" [label=FAM]
  \"@I1@\" -> \"@F1@\" [label=\"@FAMILY_SPOUSE\"]
  \"@I2@\" -> \"@F1@\" [label=\"@FAMILY_SPOUSE\"]
  \"@F1@\" -> \"@I1@\" [label=\"@HUSBAND\"]
  \"@F1@\" -> \"@I2@\" [label=\"@WIFE\"]
}
`
  );

  t.end();
});
