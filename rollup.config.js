module.exports = [
  {
    input: "index.js",
    output: {
      file: "dist/index.js",
      format: "cjs"
    }
  },
  {
    input: "index.js",
    output: {
      file: "dist/index.m.s",
      format: "esm"
    }
  },
  {
    input: "index.js",
    output: {
      name: "parseGedcom",
      file: "dist/index.umd.s",
      format: "umd"
    }
  }
];
