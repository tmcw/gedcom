function hasTag(val) {
    return function(node) {
        return node.tag === val;
    };
}

function d3ize(tree) {
    var peopleNodes = tree
        .filter(hasTag('INDI'))
        .map(toNode);
    var families = tree.filter(hasTag('FAM'));
    var familyNodes = families.map(toNode);
    var links = families.reduce(function(memo, family) {
        return memo.concat(familyLinks(family));
    }, []);
    var allNodes = peopleNodes.concat(familyNodes);
    var indexedNodes = allNodes.reduce(function(memo, node, i) {
        memo[node.id] = i;
        return memo;
    }, {});
    links = links.map(idToIndex(indexedNodes));
    return {
        nodes: allNodes,
        links: links
    };
}

function getName(p) {
    if (p.tag === 'INDI') {
        var nameNode = (p.tree.filter(hasTag('NAME')) || [])[0];
        if (nameNode) {
            return nameNode.data.replace(/\//g, '');
        }
    } else {
        return 'Family';
    }
}

function toNode(p) {
    p.id = p.pointer;
    p.name = getName(p);
    return p;
}

function idToIndex(indexedNodes) {
    return function(link) {
        return {
            source: indexedNodes[link.source],
            target: indexedNodes[link.target]
        };
    };
}

function familyLinks(family) {
    var memberLinks = family.tree.map(function(member) {
        return {
            source: family.pointer,
            target: member.data
        };
    });
    return memberLinks;
}

module.exports = d3ize;
