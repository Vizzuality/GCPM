(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Map = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Map.prototype, {

    initialize: function(params) {
      this.fc = App.facade.layer;

      this.state = new StateModel();
      this.layersSpec = new App.Collection.LayersSpec();
      this.map = new App.View.Map({
        el: '#map'
        // options: this.getMapOptions()
      });

      // Setting listeners
      this.setEvents();

      // Setting firs state
      this.setState(params);
    },

    setEvents: function() {
      App.on('Router:change', this.setState, this);
      this.state.on('change', this.drawLayer, this);
      // this.fc.on('region:change', function(properties) {
      //   App.trigger('Router:update', { region: properties.iso });
      // }, this);
    },

    getState: function() {
      return this.state.attributes;
    },

    setState: function(params) {
      var state = params;
      if (!params.data) {
        state.data = 'projects';
      }
      if (!params.region) {
        delete state.region;
      }
      if (!params.country) {
        delete state.country;
      }
      this.state.clear({ silent: true }).set(state);
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
        this.currentLayer = layer;
        this.map.addLayer(this.currentLayer);
        layer.FitBounds(); // Cluster prune method to fitbounds
      }.bind(this));
      App.trigger('Map:change', this.getState());
    },

    /**
     * Get default map options from params
     * @return {Object}
     */
    // getMapOptions: function() {
    //   var mapSettings = _.pick(this.state.attributes, 'zoom', 'lat', 'lng');
    //   if (Object.keys(mapSettings).length > 0) {
    //     return {
    //       center: [mapSettings.lat, mapSettings.lng],
    //       zoom: mapSettings.zoom
    //     };
    //   }
    //   return {};
    // }

  });

})(this.App);
