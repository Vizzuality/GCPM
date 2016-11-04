/* global ga*/
(function (App) {

  'use strict';

  var StateModel = Backbone.Model.extend({
    defaults: {
      year: 2013
    }
  });

  App.Presenter.Layers = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Layers.prototype, {

    initialize: function (params) {
      this.state = new StateModel();
      this.layersView = new App.View.Layers({
        el: '#layers'
      });
      this.fc = App.facade.cartoLayer;
      this.layersCollection = new App.Collection.Layers();

      this.setState(_.extend({},{ active: false },params));
      this.setLayers();
      this.setEvents();
      this.setSubscriptions();
    },

    setEvents: function () {
      this.state.on('change', function () {
        this.render();
      }, this);

      this.layersView.on('change', this.handleLayer.bind(this));
      this.layersView.on('close', this.closeLayer.bind(this));
    },

    setSubscriptions: function () {
      App.on('Actionbar:layers', this.toggleActive, this);
      App.on('Actionbar:change', function(){
        this.layersView.trigger('close');
        this.render();
      }, this);
      App.on('Map:change Router:change Timeline:change', this.setState, this);
      App.on('Router:change Timeline:change', function(params) {
        if (params.cartoLayer) {
          this.handleLayer({ id: params.cartoLayer });
        } else {
          this.handleLayer();
        }
      }.bind(this), this);
    },

    setLayers: function() {
      this.layersCollection.fetch().done(function() {
        this.layersList = {
          groups: {
            groups: true,
            elements: _.groupBy(this.layersCollection.getGroup('disability-adjusted-life-year'), function(layer) {
              return layer.layer_group.name;
            })
          },
          individual: {
            individual: true,
            elements: [
              {
                name: 'Human Development Index',
                slug: 'human-development-index'
              },
              {
                name: 'Mortality, ASR all years Globocan',
                slug: 'mortality-asr-all-years-globocan'
              },
              {
                name: 'Incidence, ASR all years Globocan',
                slug: 'incidence-asr-all-years-globocan'
              }
            ]
          }
        };

        this.setState({ layers: this.layersList });

        if (this.state.get('cartoLayer') && this.layersCollection.toJSON().length > 0) {
          this.handleLayer({id: this.state.get('cartoLayer')});
        }
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

      this.layersView.setElement('#layers');
      this.layersView.updateData(data);
    },

    handleLayer: function(element) {
      if (element) {
        // Harcode the human development index
        if (element.id == 'human-development-index') {
          element.id = element.id + '-' + this.state.get('year');
        }
        var layer = this.layersCollection.getLayer(element.id);
        ga('send', 'event', 'Map', 'Toggle', this.getLayerName(layer));

        var options = {
          sql: layer.query,
          cartocss: layer.css
        };

        /* Create layer */
        this.fc.getLayer(options).done(function(layer) {
          App.trigger('Layer:change', {layer: layer, name: element.id});
        }.bind(this));
      } else {
        App.trigger('Layer:remove', null);
      }
    },

    closeLayer: function() {
      this.getState().active && this.toggleActive();
    },

    toggleActive: function(){
      var active = this.getState().active ? false : true;
      var layerBtn = $('.js-actionbar-action[data-action=layers]');

      active ? layerBtn.addClass('-active') : layerBtn.removeClass('-active') ;

      this.setState({active: active});
    },

    // HELPER
    getLayerName: function(layer) {
      if (layer.layer_group) {
        return layer.layer_group.name + ' ' + layer.name
      }
      return layer.name
    }

  });

})(this.App);
