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

      this.layersCollection = new App.Collection.Layers();

      var data = {
        layers: [
        {
          value: 'incidence',
          id: 'layerIncidence'
        },
        {
          value: 'mortality',
          id: 'layerMortality'
        },
        {
          value: 'human development index',
          group: [
            {
              value: 'hdi',
              date: '1980',
              id: 'layer1980'
            },
            {
              value: 'hdi',
              date: '1985',
              id: 'layer1985'
            }
          ]}
        ]
      }
      params.data = data;
      params.active = false;
      this.getLayers();
      this.setEvents();
      this.setSubscriptions();
      this.setState(params);
    },

    setEvents: function () {
      this.state.on('change', function () {
        this.render();
        App.trigger('Layers:change', this.getState());
      }, this);

      this.layers.on('change', this.handleLayer.bind(this));
    },

    setSubscriptions: function () {
      App.on('Actionbar:action', this.toggleActive, this);
    },

    getLayers: function() {
      this.layersCollection.fetch().done(function(data) {
      }.bind(this));
    },

    setState: function (params) {
      this.state.set(params);
    },

    getState: function () {
      return this.state.attributes;
    },


    render: function () {
      var data = this.state.attributes;
      this.layers.updateData(data);
    },

    handleLayer: function(element) {
      if (element) {
        var options = {
          layer_name: element.value,
          params: {
            date: $(element).data().date,
            cancer_type: $(element).data()['cancer-type']
          }
        };

        /* Create layer */
        this.fc.getLayer(options).done(function(layer) {
          App.trigger('Layer:change', layer);
        });
      } else App.trigger('Layer:remove', null);
    },

    toggleActive: function(){
      var active = this.getState().active ? false : true;
      this.setState({active: active});
    }

  });

})(this.App);
