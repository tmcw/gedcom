var test = require('tape'),
    fs = require('fs'),
    parse = require('./');

function fixture(t, name) {
    parse(fs.readFileSync(__dirname + '/fixture/' + name + '.ged', 'utf8'), function(err, d) {
        if (process.env.UPDATE) {
            fs.writeFileSync(__dirname + '/fixture/' + name + '.json', JSON.stringify(d, null, 2));
        }
        t.deepEqual(d, require('./fixture/' + name + '.json'), name);
        t.end();
    });
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
