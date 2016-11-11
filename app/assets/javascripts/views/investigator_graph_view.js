/* global d3 */

(function(App) {

  'use strict';

  App.View.InvestigatorGraph = Backbone.View.extend({

    template: HandlebarsTemplates['graph_legend'],

    initialize: function(settings) {
      this.data = settings.data;
      this.fc = App.facade.GraphFacade;
      this.render();
    },

    render: function() {
      d3.select("svg")
      .remove();

      this.addLegend();
      this.addGraph();
      return this;
    },

    addGraph: function() {
      this.fc.setSvg(this.el);
      this.fc.setStructure(this.data);
      this.fc.addShapes();

      this.fc.addText(this.fc.addLink(this.fc.nodeProjects, 'projects'));
      this.fc.addText(this.fc.addLink(this.fc.nodeInvestigators, 'investigators'));
      this.fc.addText(this.fc.nodeInvestigator);

      this.fc.addTitle();
    },

    addLegend: function() {
      this.$el.html(this.template({
        current: 'Current investigator',
        rects: 'Project',
        others: 'Investigator / Colaborator'
      }));
    }

  });

})(this.App);
