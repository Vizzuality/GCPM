(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ShowMoreButton = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ShowMoreButton.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.showMoreButton = new App.View.ShowMoreButton({el: '#show_more_button_filtered' });
      this.setEvents();
      this.setSubscriptions();
      this.setState(params);

    },

    setSubscriptions: function() {
      App.on('Router:change', this.setState, this);
      App.on('Map:change', this.setState, this);
    },

    setEvents: function() {
      this.state.on('change', this.setURI, this);
    },

    setState: function(state) {
      this.state.set(state);
    },

    getState: function() {
      return this.state.attributes;
    },

    setURI: function() {
      this.showMoreButton.setURI(this.getState());
    }

  });

})(this.App);
