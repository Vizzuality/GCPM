(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.InvestigatorGraph = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorGraph.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      // this.investigatorGraph = new App.View.InvestigatorGraph({
      //   el: '#graph'
      // });

      this.setState(params);
      this.getGraphData();
    },


    setState: function(newState) {
      this.state
        .set(newState, { silent: true });
    },

    getState: function() {
      return this.state.attributes;
    },

    getGraphData: function() {
      $.ajax({
        url: '/api/investigators/'+ gon.server_params['investigators[]'] + '/graph',
        type: 'GET',
        dataType: 'json',
        success: this.dataSuccess.bind(this),
        error: this.dataError.bind(this)
      })
    },

    dataSuccess: function(data) {
      this.createSvg(data);
    },

    dataError: function() {
      console.error('Error in getting data');
    },

    createSvg: function(data) {
      var utilData = this.setData(data);

      d3.select("svg")
      .remove();

      // Create a svg canvas
      var vis = d3.select("#graph").append("svg:svg")
        .attr("width", '100%')
        .attr("height", 600)
        .append("svg:g")
        .attr("transform", "translate(40, 0)");

      var layout = d3.layout.tree().size([500, 600]);

      var diagonal = d3.svg.diagonal()
        // change x and y (for the left to right tree)
        .projection(function(d) { return [d.y, d.x]; });

      // Preparing the data for the tree layout, convert data into an array of nodes
      var nodes = layout.nodes(utilData);
      // Create an array with all the links
      var links = layout.links(nodes);
      var link = vis.selectAll("pathlink")
        .data(links)
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("d", diagonal);

      var node = vis.selectAll("g.node")
        .data(nodes)
        .enter().append("svg:g")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      // Add the dot at every node
      node.append("svg:circle")
        .attr("r", 3.5);

      // place the name atribute left or right depending if children
      node.append("svg:text")
        .attr("dx", function(d) { return d.investigators ? -8 : 8; })
        .attr("dy", 3)
        .attr("text-anchor", function(d) {
          if (d.investigators) {
            return d.investigators.length != 0 ? 'end' : 'start';
          } else if (d.projects) {
            return d.projects.length != 0 ? 'end' : 'start';
          } else {
            return 'start';
          }
        })
        .text(function(d) {
          if (d.title) {
            return d.title;
          } else {
            return d.name;
          }
        });
    },

    setData: function(data) {
      var renamedData = _.map(data, function(proj) {
        var newProject = _.extend({}, proj);
        newProject.children = proj.investigators;
        return newProject;
      });

      return { name: 'Yo', children: renamedData };
    }

  });

})(this.App);
