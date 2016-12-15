(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Map = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Map.prototype, {

    initialize: function(params, settings, viewSettings) {
      this.fc = App.facade.layer;
      this.options = settings || {};
      this.state = new StateModel();
      this.layersSpec = new App.Collection.LayersSpec();
      this.map = new App.View.Map({
        el: '#map',
        options: _.extend({}, {
          minZoom: 2,
          maxZoom: 14,
          basemap: 'main'
        }, viewSettings)
      });

      this.setSubscriptions();
      this.setEvents();

      // Setting first state
      this.setState(params);

      this.options.disable && this.disableMap();
    },

    setEvents: function() {
      this.state.on('change', function(newState) {
        this.updateClassName();
        this.drawLayer();
        App.trigger('Map:change', this.getState());
      }, this);

      if (!this.options.noInteractivity) {
        this.fc.on('region:change', function(state) {
          if (state.type === 'region') {
            this.setState({ 'regions[]': state.iso, data: state.data }, true);
          }
        }, this);

        this.fc.on('country:change', function(state) {
          if (state.type === 'country') {
            this.setState({
              'regions[]': state['regions[]'],
              data: state.data,
              'countries[]': state.iso
            }, true);
          }
        }, this);
      }
    },

    setSubscriptions: function() {
      App.on('Router:change', this.setState, this);
      App.on('TabNav:change Breadcrumbs:change FilterForm:change', function(state) {
        this.setState(state, true);
      }, this);
      App.on('Layer:change', this.addCartoLayer, this);
      App.on('Layer:remove', this.removeCartoLayer, this);
    },

    getState: function() {
      return this.state.attributes;
    },

    setState: function(params, merge) {
      var newState = merge ? _.extend({}, this.getState(), params) : params;

      newState = _.pick(newState, 'data', 'regions[]', 'countries[]', 'cancer_types[]',
        'organization_types[]', 'organizations[]', 'project_types[]', 'funding_sources[]',
        'start_date', 'end_date', 'cartoLayer');

      if (!newState.data) {
        newState.data = 'projects';
      }

      if (!newState.start_date) {
        delete newState.start_date;
      }

      if (!newState.end_date) {
        delete newState.end_date;
      }

      this.state.clear({ silent: true }).set(newState);
    },

    updateClassName: function() {
      var mapElement = this.map.$el;
      mapElement
        .removeClass('-projects')
        .removeClass('-events')
        .removeClass('-people');
      mapElement.addClass('-' + this.getState().data || '');
    },

    /**
     * Render layer
     * @param {params} Object
     */
    drawLayer: function() {
      if (this.currentLayer) {
        this.map.removeLayer(this.currentLayer);
      }
      this.fc.getLayer(this.getState()).done(function(layer) {

        if (layer) {
          var bounds = layer.getBounds();
          this.currentLayer = layer;
          this.map.addLayer(this.currentLayer);
          if (bounds && !this.options.noAnimateBounds) {
            this.map.map.fitBounds(bounds, {
              padding: [50, 50]
            });
          }
        }

      }.bind(this));
    },

    /**
     * Add layer
     */
    addCartoLayer: function(layerOptions) {
      if (this.cartoLayer) {
        this.map.removeLayer(this.utfGrid);
        this.map.removeLayer(this.cartoLayer);
      }
      this.cartoLayer = layerOptions.layers.layer;
      this.utfGrid = layerOptions.layers.utfGrid;

      this.map.addLayer(this.cartoLayer);
      this.addUtfGridLayer();

      this.setState({
        cartoLayer: layerOptions.name
      }, true);
      App.trigger('Map:change', _.extend({}, this.getState(), {
        cartoLayer: layerOptions.name
      }));
    },

    addUtfGridLayer: function() {
      this.map.addLayer(this.utfGrid, {
        resolution: 2
      });

      this.utfGrid.on('click', function (e) {
        if (e.data) {
          var data = {
            title: e.data.country_name ? e.data.country_name : null,
            value: e.data.value ? e.data.value : 'No data',
            latLng: e.latlng
          };

          this.map.addCartoTooltip(data);
        }
      }.bind(this));
    },

    /**
     * Remove layer
     */
    removeCartoLayer: function() {
      this.map.removeLayer(this.cartoLayer);
      this.cartoLayer = null;
      this.setState({
        cartoLayer: null
      }, true);

      App.trigger('Map:change', _.extend({}, this.getState(), {
        cartoLayer: null
      }));
    },

    disableMap: function() {
      var map = this.map.map;

      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      (map.tap) ? map.tap.disable() : null;
    }

  });

})(this.App);
