(function (App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Layers = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Layers.prototype, {

    initialize: function (params) {
      this.params = params;
      this.state = new StateModel();
      this.layers = new App.View.Layers({ el: '#layers' });
      this.fc = App.facade.cartoLayer;

      this.layersCollection = new App.Collection.Layers();

      // var data = {
      //   layers: [
      //   {
      //     value: 'incidence',
      //     id: 'layerIncidence'
      //   },
      //   {
      //     value: 'mortality',
      //     id: 'layerMortality'
      //   },
      //   {
      //     value: 'human development index',
      //     group: [
      //       {
      //         value: 'hdi',
      //         date: '1980',
      //         id: 'layer1980'
      //       },
      //       {
      //         value: 'hdi',
      //         date: '1985',
      //         id: 'layer1985'
      //       }
      //     ]}
      //   ]
      // }
      // this.params.layers = data;
      this.params.active = false;

      this.setLayers();
      this.setEvents();
      this.setSubscriptions();
      this.setState(this.params);
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

    setLayers: function() {
      this.layersCollection.fetch().done(function(data) {
        this.layersList = _.groupBy(this.layersCollection.toJSON(), function(layer) {
          if (layer.layer_group) {
            return layer.layer_group.name;
          } else {
            return;
          }
        });

        this.setState({ layers: this.layersList });
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
        var layer = _.findWhere(this.layersCollection.toJSON(), {slug: element.id});
        var options = {
          layer_slug: element.value,
          sql: layer.query,
          cartocss: layer.css
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
