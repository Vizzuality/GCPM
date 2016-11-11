(function(App) {

  'use strict';

  App.View.InvestigatorGraph = Backbone.View.extend({

    initialize: function(settings) {
      this.data = settings.data;
      this.fc = App.facade.GraphFacade;
      this.render();
    },

    render: function() {
      d3.select("svg")
      .remove();

      this.createSvg();
      return this;
    },

    createSvg: function() {
      this.fc.setSvg(this.el);
      this.fc.setStructure(this.data);
      this.fc.addShapes();

      this.fc.addText(this.fc.addLink(this.fc.nodeProjects, 'projects'));
      this.fc.addText(this.fc.addLink(this.fc.nodeInvestigators, 'investigators'));
      this.fc.addText(this.fc.nodeInvestigator);

      this.fc.addTitle();

      this.fc.addLegend({
        current: 'Current investigator',
        rect: 'Project',
        others: 'Investigator/Colaborator'
      });
    }

  });

})(this.App);
