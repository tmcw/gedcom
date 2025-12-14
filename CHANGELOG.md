# Changelog

## 3.0.6

### Patch Changes

- cbc3965: Include TypeScript types, switch from tsup to tsdown

  This project previously used tsup, which was deprecated in favor of tsdown. So it now uses tsdown.

  In the process, I've also adopted [changesets](https://github.com/changesets/bot), so please use `npx @changesets/cli` to write a changeset for PRs. This'll help the project manage an orderly changelog and manage version updates automatically.

  This also updates the `package.json` exports to be more accurate: there are TypeScript types for both the CJS and ESM exports. I expect that in the next major version we should drop the CJS version because almost all JavaScript runtimes support ESM now.

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/tmcw/parse-gedcom/compare/v2.0.2...v3.0.0) (2021-03-29)

### ⚠ BREAKING CHANGES

- This changes the bin name.

- Change executable from parse-gedcom to gedcom ([c19dbb9](https://github.com/tmcw/parse-gedcom/commit/c19dbb9002970d2f203aeab89956fb1f18ba664b))

### [2.0.2](https://github.com/tmcw/parse-gedcom/compare/v2.0.1...v2.0.2) (2021-03-29)

### [2.0.1](https://github.com/tmcw/gedcom/compare/v1.0.3...v2.0.1) (2021-01-17)

### Bug Fixes

- **package:** update concat-stream to version 2.0.0 ([#21](https://github.com/tmcw/gedcom/issues/21)) ([ce50b98](https://github.com/tmcw/gedcom/commit/ce50b981b5233f7ae2b84e44d347e6039002831e))
