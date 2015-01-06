var d3 = require('d3'),
    parse = require('../');

var width = window.innerWidth,
    height = window.innerHeight;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-100)
    .linkDistance(20)
    .size([width, height]);

    function over() {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        d3.event.dataTransfer.dropEffect = 'copy';
    }

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('dropzone', 'copy')
    .on('drop', function(e) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        var f = d3.event.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function(e) {
            dropHint.remove();
            buildGraph(parse.d3ize(parse.parse(e.target.result)));
        };

        reader.readAsText(f);
    })
    .on('dragenter', over)
    .on('dragexit', over)
    .on('dragover', over);

var dropHint = svg.append('text')
    .text('Drop a GEDCOM file here')
    .attr('class', 'hint')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + [window.innerWidth / 2, window.innerHeight / 2] + ')');

function buildGraph(graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll('.link')
      .data(graph.links)
    .enter().append('line')
      .attr('class', 'link')
      .style('stroke-width', function(d) { return Math.sqrt(d.value); });

  function lastName(n) {
      var parts =  n.split(/\s/);
      return n[n.length - 1];
  }

  var node = svg.selectAll('.node')
      .data(graph.nodes)
    .enter().append('g')
      .attr('class', 'node')
      .call(force.drag);

  node.append('circle')
      .attr('r', function(d) { return 5; })
      .style('fill', function(d) { return color(lastName(d.name)); });

  node.append('text')
      .text(function(d) { return d.name; });

  force.on('tick', function() {
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) {
        return 'translate(' + [d.x, d.y] + ')'; });
  });
}
