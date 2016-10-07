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
      this.fc = App.facade.cartoLayer;

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

      this.layers.on('change', this.handleLayer.bind(this));
    },

    setSubscriptions: function () {
      App.on('Map:change', this.setState, this);
    },

    render: function () {
      var data;
      var attributes = this.getState();
      this.layers.updateData(data);
    },

    handleLayer: function(element) {
      var options = {
        layer_name: element.value,
        params: {
          date: $(element).data().date,
          cancer_type: $(element).data()['cancer-type']
        }
      };

      //Create layer
      this.fc.getLayer(options).done(function(layer) {
        App.trigger('Layer:change', layer);
      });
    }

  });

})(this.App);
