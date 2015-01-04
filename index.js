var es = require('event-stream'),
    reduce = require('stream-reduce'),
    traverse = require('traverse'),
    Combiner = require('stream-combiner');

// from https://github.com/madprime/python-gedcom/blob/master/gedcom/__init__.py
// * Level must start with nonnegative int, no leading zeros.
// * Pointer optional, if it exists it must be flanked by '@'
// * Tag must be alphanumeric string
// * Value optional, consists of anything after a space to end of line
//   End of line defined by \n or \r
var lineRe = /\s*(0|[1-9]+[0-9]*) (@[^@]+@ |)([A-Za-z0-9_]+)( [^\n\r]*|)/;

function transformStream() {
    var start = {
        root: {
            tree: []
        },
        level: 0
    };
    start.pointer = start.root;
    return Combiner(
        es.split(),
        es.map(mapLine),
        reduce(function(memo, data) {
            if (data.level === memo.level) {
                memo.pointer.tree.push(data);
            } else if (data.level > memo.level) {
                var up = memo.pointer;
                memo.pointer = memo.pointer.tree[
                    memo.pointer.tree.length - 1];
                memo.pointer.tree.push(data);
                memo.pointer.up = up;
                memo.level = data.level;
            } else if (data.level < memo.level) {
                memo.pointer = memo.pointer.up;
                memo.pointer.tree.push(data);
                memo.level = data.level;
            }
            return memo;
        }, start),
        es.map(getTree));

    function getTree(data, callback) {
        callback(null, traverse(data.root).map(function(node) {
            delete node.up;
            delete node.level;
            this.update(node);
        }));
    }

    function mapLine(data, callback) {
        var match = data.match(lineRe);
        if (!match) return callback();
        callback(null, {
            level: parseInt(match[1], 10),
            pointer: match[2].trim(),
            tag: match[3].trim(),
            data: match[4].trim(),
            tree: []
        });
    }
}

function parse(input, callback) {
    var stream = transformStream()
        .on('data', function(d) {
            callback(null, d);
        });
    stream.write(input);
    stream.end();
}

module.exports = parse;
module.exports.transformStream = transformStream;
