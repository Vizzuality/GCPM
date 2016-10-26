/* global URI */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Footer = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Footer.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.footer = new App.View.Footer();
      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
    },

    setSubscriptions: function() {
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(newState, options) {
      this.state
        .clear({ silent: true})
        .set(newState, options);
    },

    getState: function() {
      return this.state.attributes;
    }

  });

})(this.App);
