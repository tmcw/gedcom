# parse-gedcom

A simple [GEDCOM](http://en.wikipedia.org/wiki/GEDCOM) parser that
focuses on translating GEDCOM structure into [JSON](http://www.json.org/).

## API

* `parse(string, function(err, res) { })`
* `.transformStream()`: returns a through stream that
  parses GEDCOM data.
