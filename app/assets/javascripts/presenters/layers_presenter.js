(function (App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Layers = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Layers.prototype, {

    initialize: function (params) {
      this.state = new StateModel();
      this.layers = new App.View.Layers({ el: '#layers' });
      this.setEvents();
      this.setSubscriptions();
      this.setState(params);
    },

    setState: function (params) {
      this.state.set(params);
    },

    getState: function () {
      return this.state.attributes;
    },

    setEvents: function () {
      this.state.on('change', function () {
        this.render();
        App.trigger('Layers:change', this.getState());
      }, this);
    },

    setSubscriptions: function () {
      App.on('Map:change', this.setState, this);
    },

    render: function () {
      var data;
      var attributes = this.getState();
      this.layers.updateData(data);
    }

  });

})(this.App);
