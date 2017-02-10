(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CountryDataMap = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CountryDataMap.prototype, {

    initialize: function(params) {
      this.fc = App.facade.layer;

      this.state = new StateModel(params);

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setEvents: function() {

    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
      App.on('Remote:load', this.setMap, this);
    },

    setState: function(newState) {
      this.state
        .set(newState, { silent: true });
    },

    getState: function() {
      return this.state.attributes;
    }

  });

})(this.App);
