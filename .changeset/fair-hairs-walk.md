---
"gedcom": patch
---

Include TypeScript types, switch from tsup to tsdown

This project previously used tsup, which was deprecated in favor of tsdown. So it now uses tsdown.

In the process, I've also adopted [changesets](https://github.com/changesets/bot), so please use `npx @changesets/cli` to write a changeset for PRs. This'll help the project manage an orderly changelog and manage version updates automatically.

This also updates the `package.json` exports to be more accurate: there are TypeScript types for both the CJS and ESM exports. I expect that in the next major version we should drop the CJS version because almost all JavaScript runtimes support ESM now.
