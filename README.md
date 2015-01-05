# parse-gedcom

[![build status](https://secure.travis-ci.org/tmcw/parse-gedcom.png)](http://travis-ci.org/tmcw/parse-gedcom)

A simple [GEDCOM](http://en.wikipedia.org/wiki/GEDCOM) parser that
focuses on translating GEDCOM structure into [JSON](http://www.json.org/).

Tested with GEDCOM 5.5 exported from [Geni.com](http://www.geni.com/).

## Usage

node or browserify:

    npm install --save parse-gedcom

otherwise:

```html
<script src='https://wzrd.in/standalone/parse-gedcom@latest'></script>
```

## [Usage Online](http://macwright.org/parse-gedcom/live/)

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

## API

* `.parse(string)` -> JSON
* `.d3ize(JSON)` -> d3-capable JSON
