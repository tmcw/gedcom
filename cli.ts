#!/usr/bin/env node

import Fs from "node:fs";
import Path from "node:path";
import getStdin from "get-stdin";
import meow from "meow";
import { parse, toD3Force, toDot } from "./index";
import type { Parent } from "./lib/types";

const cli = meow(
  `
	Usage
	  $ parse-gedcom <input>
	Options
	  --type, -s   Output type (json, d3.json, dot)
	Examples
	  $ parse-gedcom input.ged output.json
`,
  {
    flags: {
      type: {
        type: "string",
        alias: "t",
      },
    },
  },
);

const EXTENSION_TO_TYPE = {
  ".json": "json",
  ".d3.json": "force",
  ".dot": "dot",
};
type ExtKey = keyof typeof EXTENSION_TO_TYPE;

function getOutputFromType(type: string, parsed: Parent) {
  switch (type) {
    case "json": {
      return JSON.stringify(parsed, null, 2);
    }
    case "d3.json": {
      return JSON.stringify(toD3Force(parsed), null, 2);
    }
    case "dot": {
      return toDot(parsed);
    }
  }
  return "";
}

(async () => {
  const [infile, outfile] = cli.input;
  const inputStr = infile ? Fs.readFileSync(infile, "utf8") : await getStdin();

  const parsed = parse(inputStr);

  let type = "json";
  if (cli.flags.type) {
    type = cli.flags.type;
  } else if (outfile) {
    const ext = Path.extname(outfile);
    if (ext in EXTENSION_TO_TYPE) {
      type = EXTENSION_TO_TYPE[ext as ExtKey];
    }
  }

  const output = getOutputFromType(type, parsed);

  if (outfile) {
    Fs.writeFileSync(outfile, output, "utf8");
  } else {
    process.stdout.write(output);
  }
})();
