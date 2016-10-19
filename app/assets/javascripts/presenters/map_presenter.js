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
        // options: Object.assign({
        //   minZoom: 2,
        //   maxZoom: 14,
        //   basemap: 'main'
        // }, viewSettings)
        options: _.extend({
          minZoom: 2,
          maxZoom: 14,
          basemap: 'main'
        }, viewSettings)
      });

      this.setSubscriptions();
      this.setEvents();

      // Setting first state
      this.setState(params);
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
      // var newState = merge ? Object.assign({}, this.getState(), params) : params;
      var newState = merge ? _.extend(this.getState(), params) : params;

      newState = _.pick(newState, 'data', 'regions[]', 'countries[]', 'cancer_types[]',
        'organization_types[]', 'organizations[]', 'project_types[]',
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
        this.map.removeLayer(this.cartoLayer);
      }
      this.cartoLayer = layerOptions.layer;
      this.map.addLayer(this.cartoLayer);
      // App.trigger('Map:change', Object.assign(this.getState(), {
      //   cartoLayer: layerOptions.name
      // }));
      App.trigger('Map:change', _.extend(this.getState(), {
        cartoLayer: layerOptions.name
      }));
    },

    /**
     * Remove layer
     */
    removeCartoLayer: function() {
      this.map.removeLayer(this.cartoLayer);
      this.cartoLayer = null;
      // App.trigger('Map:change', Object.assign(this.getState(), {
      //   cartoLayer: null
      // }));
      App.trigger('Map:change', _.extend(this.getState(), {
        cartoLayer: null
      }));
    }

  });

})(this.App);
