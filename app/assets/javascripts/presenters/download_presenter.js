(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Download = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Download.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {

      }, this);
    },

    setSubscriptions: function() {
      App.on('Toolbar:action', function(actionName){
        console.log(actionName);
      });
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
