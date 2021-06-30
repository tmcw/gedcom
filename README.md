# gedcom

A small, simple parser for [GEDCOM](http://en.wikipedia.org/wiki/GEDCOM) 5.5.1.

# [API Documentation](./docs/README.md)

### Installation

The `gedcom` package can be added as a dependency to use in your code, or
if you'd like to just use the CLI, install it globallly:

```
npm install -g gedcom
```

### CLI

```
Usage
$ gedcom <input>
	Options
	  --type, -s   Output type (json, d3.json, dot)
	Examples
	  $ gedcom input.ged output.json
```

### Caveats

- The GEDCOM specification allows use of an ANSEL character encoding - a nearly-unknown
  predecessor to UTF-8. This parser doesn't currently handle ANSEL encoding, so it
  may behave oddly with files in ANSEL. However, it appears that most programs that
  export GEDCOM default to or at least support UTF-8, which is recommended instead.
- The GEDCOM standard is ubiquitous and practical, but has [embedded cultural biases](./GEDCOM_BIAS.md).
  This parser allows "non-standard" input in places where GEDCOM is bigoted, like
  the `SEX_VALUE` field.
