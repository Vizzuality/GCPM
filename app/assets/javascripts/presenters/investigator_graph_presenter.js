(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.InvestigatorGraph = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorGraph.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.setState(params);
      this.getGraphData();
    },

    setSubscriptions: function() {
      App.on('Remote:load', function(params) {
        if (params.data === 'data') {
          this.investigatorGraph.setElement('#graph');
          this.investigatorGraph.render();
        }
      }.bind(this));
    },

    setState: function(newState) {
      this.state
        .set(newState, { silent: true });
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
      this.$spinner = $('.c-spinner');
      this.$spinner.hide();

      this.investigatorGraph = new App.View.InvestigatorGraph({
        el: '#graph',
        data: this.setData(data)
      });

      this.setSubscriptions();
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
    }

  });

})(this.App);
