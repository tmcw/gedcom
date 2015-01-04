function d3ize(tree) {
    function hasTag(val) {
        return function(node) {
            return node.tag === val;
        };
    }
    var peopleNodes = tree
        .filter(hasTag('INDI'))
        .map(toNode);
    var families = tree.filter(hasTag('FAM'));
    var familyNodes = families.map(toNode);
    var links = families.reduce(function(memo, family) {
        return memo.concat(familyLinks(family));
    }, []);
    return {
        nodes: peopleNodes.concat(familyNodes),
        links: links
    };
}

function toNode(p) {
    p.name = p.pointer;
    return p;
}

function familyLinks(family) {
    var memberLinks = family.tree.map(function(member) {
        return {
            from: family.pointer,
            to: member.data
        };
    });
    return memberLinks;
}

module.exports = d3ize;
