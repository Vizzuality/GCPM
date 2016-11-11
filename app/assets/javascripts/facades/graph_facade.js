(function(App) {

  'use strict';

  var graphFacade = {

    setSvg: function(el) {
      this.width = $(el).width();
      this.rest = this.width * .5;
      this.maxWidth = this.width - this.rest;

      this.svg = d3.select(el)
        .classed("svg-container", true)
        .append("svg:svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          //Class to make it responsive
          .classed("svg-content-responsive", true);

      this.g = this.svg
        .append("svg:g")
          .attr("transform", "translate(100, 0)");
    },

    setStructure: function(utilData) {
      var investigatorsCount = 0;
      _.each(utilData.children, function(project) {
        if (project.children) {
          investigatorsCount = investigatorsCount + project.children.length;
        }
      });

      this.height = investigatorsCount * 45;

      var layout = d3.layout.tree().size([this.height, this.maxWidth]);

      var diagonal = d3.svg.diagonal()
        // change x and y (for the left to right tree)
        .projection(function(d) { return [d.y, d.x]; });

      // Preparing the data for the tree layout, convert data into an array of nodes
      var nodes = layout.nodes(utilData);

      // Create an array with all the links
      var links = layout.links(nodes);

      this.g.selectAll("pathlink")
        .data(links)
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("d", diagonal);

      this.node = this.g.selectAll("g.node")
        .data(nodes)
        .enter().append("svg:g")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .attr("class", function(d) {
          if (d.projects) {
            return "current";
          } else if (d.investigators) {
            return "rects";
          } else {
            return "others";
          }
        });

      this.setNodes();

      // Set graph height depending on the number of investigators
      this.svg.attr("viewBox", "0 0 " + this.width + " " + this.height );
    },

    setNodes: function() {
      this.nodeProjects = this.g.selectAll('.rects');
      this.nodeInvestigators = this.g.selectAll('.others');
      this.nodeInvestigator = this.g.selectAll('.current');
    },

    addShapes: function() {
      this.addRect(this.nodeProjects);
      this.addDots(this.nodeInvestigators);
      this.addDots(this.nodeInvestigator);
    },

    addDots: function(nodes) {
      nodes.append("svg:circle")
        .attr("r", 8);

      nodes.append("svg:circle")
        .attr("r", .5)
        .attr("class", "dot");
    },

    addRect: function(nodes) {
      nodes.append("svg:rect")
        .attr("width", 100)
        .attr("height", 20)
        .attr("x", -60)
        .attr("y", -10);
    },

    addLink: function(node, name) {
      return node.append("svg:a")
        .attr("xlink:href", function(d){
          return '/' + name + '/' + d.slug;
        })
        .attr("class", "data-link")
    },

    addText: function(nodes) {
      nodes.append("svg:text")
        .attr("x", function(d) {
          if (d.projects) {
            return -16;
          } else if (d.investigators) {
            return 34;
          } else {
            return 16;
          }
        })
        .attr("y", function(d) { return d.investigators ? 5 : 3; })
        .attr("text-anchor", function(d) {
          if (d.investigators) {
            return d.investigators.length != 0 ? 'end' : 'start';
          } else if (d.projects) {
            return d.projects.length != 0 ? 'end' : 'start';
          } else {
            return 'start';
          }
        })
        .attr("font-size", 12)
        .attr("font-weight", function(d) { return d.investigators ? "bold" : "normal" })
        .text(function(d) {
          if (d.title) {
            return d.title.length > 14 ? d.title.substring(0, 12) + '...' : d.title;
          } else {
            return d.name;
          }
      });

    },

    addTitle: function() {
      this.node.append("svg:title").text(function(d) {
        if (d.title) {
          return d.title;
        } else {
          return d.name;
        }
      });
    },

    addLegend: function(text) {
      this.legend = this.g.append("svg:g")
         .attr("transform", "translate(-80, 100)");

      this.addLegendCurrent(text.current);
      this.addLegendRect(text.rect);
      this.addLegendOthers(text.others);
    },

    addLegendCurrent: function(text) {
      this.current = this.legend.append("svg:g")
        .attr("y", 5)
        .attr("class", "current");

      this.current.append("svg:circle")
          .attr("r", 8);

      this.current.append("svg:circle")
        .attr("r", .5)
        .attr("class", "dot");

      this.current.append("svg:text")
        .attr("x", 16)
        .attr("y", 4)
        .text(text);
    },

    addLegendRect: function(text) {
      this.rect = this.legend.append("svg:g")
        .attr("transform", "translate(-8, 22)");

      this.rect.append("svg:rect")
          .attr("width", 16)
          .attr("height", 16);

      this.rect.append("svg:text")
        .attr("x", 25)
        .attr("y", 12)
        .text(text);
    },

    addLegendOthers: function(text) {
      this.others = this.legend.append("svg:g")
        .attr("transform", "translate(0, 60)");

      this.others.append("svg:circle")
          .attr("r", 8);

      this.others.append("svg:circle")
        .attr("r", .5)
        .attr("class", "dot");

      this.others.append("svg:text")
        .attr("x", 16)
        .attr("y", 4)
        .text(text);
    }

  };

  App.facade.GraphFacade = _.extend(graphFacade, Backbone.Events);

})(this.App);
