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
          .attr("viewBox", "0 0 " + this.width + " 500")
          //class to make it responsive
          .classed("svg-content-responsive", true)
          .append("svg:g")
          .attr("transform", "translate(100, 0)");
    },

    setStructure: function(utilData) {
      var layout = d3.layout.tree().size([500, this.maxWidth]);

      var diagonal = d3.svg.diagonal()
        // change x and y (for the left to right tree)
        .projection(function(d) { return [d.y, d.x]; });

      // Preparing the data for the tree layout, convert data into an array of nodes
      var nodes = layout.nodes(utilData);

      // Create an array with all the links
      var links = layout.links(nodes);
      var link = this.svg.selectAll("pathlink")
        .data(links)
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("d", diagonal);

      this.node = this.svg.selectAll("g.node")
        .data(nodes)
        .enter().append("svg:g")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .attr("class", function(d) {
          if (d.projects) {
            return "investigator";
          } else if (d.investigators) {
            return "projects";
          } else {
            return "investigators";
          }
        });
    },

    setNodes: function() {
      this.nodeProjects = this.svg.selectAll('.projects');
      this.nodeInvestigators = this.svg.selectAll('.investigators');
      this.nodeInvestigator = this.svg.selectAll('.investigator');
    },

    setShapes: function() {
      this.insertRect(this.nodeProjects);
      this.insertDots(this.nodeInvestigators);
      this.insertDots(this.nodeInvestigator);
    },

    insertDots: function(nodes) {
      nodes.append("svg:circle")
        .attr("r", 8);

      nodes.append("svg:circle")
        .attr("r", .5)
        .attr("class", "dot");
    },

    insertRect: function(nodes) {
      nodes.append("svg:rect")
        .attr("width", 100)
        .attr("height", 20)
        .attr("x", -60)
        .attr("y", -10);
    },

    setLink: function(node, name) {
      return node.append("svg:a")
        .attr("xlink:href", function(d){
          return '/' + name + '/' + d.slug;
        })
        .attr("class", "data-link")
    },

    setText: function(nodes) {
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

    setTitle: function() {
      this.node.append("svg:title").text(function(d) {
        if (d.title) {
          return d.title;
        } else {
          return d.name;
        }
      });
    }

  };

  App.facade.GraphFacade = _.extend(graphFacade, Backbone.Events);

})(this.App);
