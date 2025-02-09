import { expect, test } from "vitest";
import { compact } from "./unist-compact";

test("compact", () => {
  expect(
    compact({
      type: "root",
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
    }),
  ).toEqual({
    type: "root",
    children: [
      {
        type: "INDI",
        data: {
          formal_name: "INDIVIDUAL",
          "BIRTH/DATE": "12 MAY 1920",
          "DEATH/DATE": "1960",
        },
        children: [],
      },
    ],
  });

  expect(
    compact({
      type: "root",
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
    }),
  ).toEqual({
    type: "root",
    children: [
      {
        type: "INDI",
        data: {
          formal_name: "INDIVIDUAL",
          NAME: "Joe/Williams/",
          SEX: "M",
          "BIRTH/DATE": "11 JUN 1861",
          "BIRTH/PLACE": "Idaho Falls, Bonneville, Idaho",
          "@BIRTH/FAMILY_CHILD": "@4@",
          "@FAMILY_CHILD": "@4@",
          "+@FAMILY_CHILD": ["@9@"],
          "FAMILY_CHILD/PEDIGREE": "Adopted",
          "@ADOPTION/FAMILY_CHILD": "@9@",
          "ADOPTION/DATE": "16 MAR 1864",
          "@SEALING_CHILD/FAMILY_CHILD": "@9@",
          "SEALING_CHILD/DATE": "2 OCT 1987",
          "SEALING_CHILD/TEMPLE": "SLAKE",
        },
        children: [],
      },
    ],
  });
});

test("multiple values for an attribute", () => {
  expect(
    compact({
      type: "root",
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
                value: "Joe/Williams/",
              },
              children: [],
            },
            {
              type: "NAME",
              data: {
                formal_name: "NAME",
                value: "Joe/Wiliams/",
              },
              children: [],
            },
            {
              type: "NAME",
              data: {
                formal_name: "NAME",
                value: "Joe/Trilliams/",
              },
              children: [],
            },
          ],
        },
      ],
    }),
  ).toEqual({
    type: "root",
    children: [
      {
        type: "INDI",
        data: {
          formal_name: "INDIVIDUAL",
          NAME: "Joe/Williams/",
          "+NAME": ["Joe/Wiliams/", "Joe/Trilliams/"],
        },
        children: [],
      },
    ],
  });
});
