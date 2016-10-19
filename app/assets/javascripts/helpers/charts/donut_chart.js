(function(App) {
  'use strict';

  /**
   * Donut chart helper
   * @param  {Object} data
   * @param  {Object} options
   * @return {Object}
   */

  var defaults = {
    size: { width: 100, height: 100, radius: 4, padding: 4 },
    colors: ['#98abc5', '#8a89a6', '#7b6888'],
    dataName: 'value'
  };

  App.helper.donutChart = function(data, options) {
    if (!data || !data.length) {
      console.error('data should exist');
      return;
    }

    // var opts = Object.assign({}, defaults, options || {});
    var opts = _.extend(defaults, options || {});
    var width = opts.size.width;
    var height = opts.size.height;
    var radius = Math.min(width, height) / 2;
    var color = d3.scale.ordinal().range(opts.colors);

    // Creating arc
    var arc = d3.svg.arc()
      .outerRadius(radius - opts.size.padding)
      .innerRadius(radius - (opts.size.radius + opts.size.padding));

    // Pie chart layout
    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[opts.dataName]; });

    // Creating SVG element
    var svgElement = document.createElementNS(d3.ns.prefix.svg, 'svg');
    var svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var g = svg.selectAll('.arc')
        .data(pie(data))
      .enter().append('g')
        .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', function(d) { return color(d.value); });

    return svgElement;
  };

})(this.App);
