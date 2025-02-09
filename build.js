import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["lib/index.ts"],
  format: "esm",
  bundle: true,
  outfile: "dist/gedcom.js",
});

await esbuild.build({
  entryPoints: ["lib/index.ts"],
  format: "cjs",
  bundle: true,
  outfile: "dist/gedcom.cjs",
});

await esbuild.build({
  entryPoints: ["lib/cli.ts"],
  format: "esm",
  bundle: true,
  platform: "node",
  outfile: "dist/cli.js",
});
