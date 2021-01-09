import Fs from "fs";
import Path from "path";
import meow from "meow";
import getStdin from "get-stdin";
import { toD3Force, parse, toDot } from "./index";

const cli = meow(
  `
	Usage
	  $ parse-gedcom <input>
	Options
	  --type, -s   Output type
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
  }
);

const EXTENSION_TO_TYPE = {
  ".json": "json",
  ".d3.json": "force",
  ".dot": "dot",
};
type ExtKey = keyof typeof EXTENSION_TO_TYPE;

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

  let output: string = "";

  switch (type) {
    case "json": {
      output = JSON.stringify(parsed, null, 2);
      break;
    }
    case "d3.json": {
      output = JSON.stringify(toD3Force(parsed), null, 2);
      break;
    }
    case "dot": {
      output = toDot(parsed);
      break;
    }
  }

  if (outfile) {
    Fs.writeFileSync(outfile, output, "utf8");
  } else {
    process.stdout.write(output);
  }
})();
