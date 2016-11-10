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
      this.fc.setNodes();
      this.fc.setShapes();

      this.fc.setText(this.fc.setLink(this.fc.nodeProjects, 'projects'));
      this.fc.setText(this.fc.setLink(this.fc.nodeInvestigators, 'investigators'));
      this.fc.setText(this.fc.nodeInvestigator);

      this.fc.setTitle();
    }

  });

})(this.App);
