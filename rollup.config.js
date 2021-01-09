const rollupTypescript = require("@rollup/plugin-typescript");

module.exports = [
  {
    input: "index.ts",
    plugins: [rollupTypescript()],
    output: {
      file: "dist/index.js",
      format: "cjs",
    },
  },
  {
    input: "index.ts",
    plugins: [rollupTypescript()],
    output: {
      file: "dist/index.m.js",
      format: "esm",
    },
  },
  {
    input: "index.ts",
    plugins: [rollupTypescript()],
    output: {
      name: "parseGedcom",
      file: "dist/index.umd.js",
      format: "umd",
    },
  },
];
