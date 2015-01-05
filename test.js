var test = require('tape'),
    fs = require('fs'),
    gedcom = require('./'),
    parse = gedcom.parse,
    d3ize = gedcom.d3ize;

function fixture(t, name) {
    var result = parse(fs.readFileSync(__dirname + '/fixture/' + name + '.ged', 'utf8'));
    if (process.env.UPDATE) {
        fs.writeFileSync(__dirname + '/fixture/' + name + '.json', JSON.stringify(result, null, 2));
    }
    t.deepEqual(result, require('./fixture/' + name + '.json'), name);
    t.end();
}

function fixture_d3ize(t, name) {
    var result = d3ize(
        parse(fs.readFileSync(__dirname + '/fixture/' + name + '.ged', 'utf8')));
    if (process.env.UPDATE) {
        fs.writeFileSync(__dirname + '/fixture/' + name + '.d3.json', JSON.stringify(result, null, 2));
    }
    t.deepEqual(result, require('./fixture/' + name + '.d3.json'), name);
    t.end();
}

test('ged', function(t) {
    t.test(function(t) {
        fixture(t, 'smallest');
    });
    t.test(function(t) {
        fixture(t, 'me');
    });
    t.end();
});

test('d3ize', function(t) {
    t.test(function(t) {
        fixture_d3ize(t, 'me');
    });
    t.end();
});
