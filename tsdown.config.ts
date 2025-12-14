import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["./lib/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
  },
  {
    entry: ["./lib/cli.ts"],
    format: ["esm"],
    noExternal: ["get-stdin", "meow"],
  },
]);
