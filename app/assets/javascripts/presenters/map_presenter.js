(function(App) {

  'use strict';

  App.Presenter.Map = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Map.prototype,  {

    initialize: function(params) {
      this.currentParams = params;
      this.layersSpec = new App.Collection.LayersSpec();
      this.fc = App.facade.layer;
      this.map = new App.View.Map({
        el: '#map',
        options: this.getMapOptions(params)
      });

      // Listeners
      this.map.on('Map:change', function(state) {
        App.trigger('Router:update', Object.assign(params, state));
      });

      // Triggers
      App.trigger('Router:update', Object.assign(params, this.map.getState()));

      // Draw first layer
      this.drawLayer();
    },

    /**
     * Render layer
     */
    drawLayer: function() {
      if (this.currentLayer) {
        this.map.removeLayer(this.currentLayer);
      }
      this.fc.getLayer(this.currentParams).done(function(layer) {
        var bounds = layer.getBounds();
        this.currentLayer = this.map.addLayer(layer);
        this.map.map.fitBounds(bounds);
      }.bind(this));
    },

    /**
     * Get default map options from params
     * @param  {Object} params
     * @return {Object}
     */
    getMapOptions: function(params) {
      var mapSettings = _.pick(params, 'zoom', 'lat', 'lng');
      if (Object.keys(mapSettings).length > 0) {
        return {
          center: [mapSettings.lat, mapSettings.lng],
          zoom: mapSettings.zoom
        };
      }
      return {};
    }

  });

})(this.App);
