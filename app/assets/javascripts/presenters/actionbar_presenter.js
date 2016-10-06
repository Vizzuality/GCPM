(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({

    defaults: {

    }

  });

  App.Presenter.Actionbar = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Actionbar.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.actionbar = new App.View.Actionbar({ el: '#actionbar' });

      this.setEvents();
      this.setSubscriptions();
      this.setState(params);
      this.actionbar.render(this.state.attributes);
    },

    setEvents: function() {
      this.state.on('change', this.render, this);
      this.actionbar.on('action', function(actionName) {
        App.trigger('Actionbar:action', actionName);
      }, this);
    },

    setSubscriptions: function() {
    },

    setState: function(state) {
      this.state.set(state);
    },

    render: function() {
      var data = this.state.attributes;

      this.actionbar.render(data);
      App.trigger('Actionbar:change', this.state.attributes);
    }

  });

})(this.App);
