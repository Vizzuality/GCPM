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
      console.error('An error has occurred');
    },

    setData: function(data) {
      var renamedData = _.map(data, function(proj) {
        var newProject = _.extend({}, proj);
        newProject.children = proj.investigators;
        return newProject;
      });

      return {
        name: gon.server_params['name'],
        children: renamedData,
        projects: renamedData
      };
    },

    createSvg: function(data) {
      var utilData = this.setData(data);

      this.fc = App.facade.GraphFacade;

      d3.select("svg")
      .remove();

      this.fc.setSvg();
      this.fc.setStructure(utilData);
      this.fc.setNodes();
      this.fc.setShapes();

      this.fc.setText(this.fc.setLink(this.fc.nodeProjects, 'projects'));
      this.fc.setText(this.fc.setLink(this.fc.nodeInvestigators, 'investigators'));
      this.fc.setText(this.fc.nodeInvestigator);

      this.fc.setTitle();

    }

  });

})(this.App);
