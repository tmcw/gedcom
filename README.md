# parse-gedcom

A simple [GEDCOM](http://en.wikipedia.org/wiki/GEDCOM) parser that
focuses on translating GEDCOM structure into [JSON](http://www.json.org/).

## API

* `parse(string, function(err, res) { })`
* `.transformStream()`: returns a through stream that
  parses GEDCOM data.

## CLI Usage

`parse-gedcom` transforms GEDCOM files into JSON with proper nesting of
family & child elements.

```sh
$ parse-gedcom < file.ged > output.json
```

`parse-gedcom-d3` transforms GEDCOM files into JSON ready to be used in
a [d3](http://d3js.org/) force layout.

```sh
$ parse-gedcom-d3 < file.ged > output.json
```

See `demo.js` in this repository for an example.
