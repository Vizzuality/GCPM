(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.InvestigatorData = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorData.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.investigatorData = new App.View.InvestigatorData({
        el: '#entityData'
      });

      this.graph = new App.Presenter.InvestigatorGraph();

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setEvents: function() {
      this.state.on('change', this.renderSubviews, this);
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
      App.on('Remote:load', this.renderSubviews, this);
    },

    setState: function(newState) {
      this.state
        .set(newState, { silent: true });
    },

    getState: function() {
      return this.state.attributes;
    },

    renderSubviews: function(params) {
      if (params.data === 'data') {
        this.investigatorData.setElement('#entityData');
        this.investigatorData.render();
      }
    }

  });

})(this.App);
