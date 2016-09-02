(function(App) {

  'use strict';

  var basemapSpec = {
    default: {
      url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      options: {}
    },
    noLabel: {
      url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
      options: {}
    }
  };

  App.View.Map = Backbone.View.extend({

    defaults: {
      center: [0, 0],
      scrollWheelZoom: false,
      basemap: 'default',
      zoom: 3
    },

    initialize: function(settings) {
      console.log('new map');
      this.options = _.extend({}, this.defaults, settings.options || {});
      this.createMap();
    },

    /**
     * Creating leaflet map
     */
    createMap: function() {
      this.map = L.map(this.el.id, this.options);
      this.setBasemap();
      this.map.on('moveend', function() {
        this.trigger('Map:change', this.getState());
      }.bind(this));
    },

    /**
     * Communicate map status
     * @return {[type]} [description]
     */
    getState: function() {
      var center = this.map.getCenter();
      return {
        zoom: this.map.getZoom(),
        lat: center.lat,
        lng: center.lng
      };
    },

    /**
     * Add basemap to map
     */
    setBasemap: function() {
      var basemapConfig = basemapSpec[this.options.basemap || 'default'];
      if (!this.map || !(this.map instanceof L.Map)) {
        throw new Error('There isn\'t a valid map object');
      }
      if (this.basemap) {
        this.map.removeLayer(this.basemap);
      }
      this.basemap = L.tileLayer(basemapConfig.url, basemapConfig.options);
      this.basemap.addTo(this.map);
    },

    /**
     * Add layer on map
     * @param {Object} layerInstance A valid Leaflet layer
     */
    addLayer: function(layerInstance) {
      if (this.map && this.map instanceof L.Map) {
        this.map.addLayer(layerInstance);
      }
    },

    /**
     * Remove layer on map
     * @param {Object} layerInstance A valid Leaflet layer
     */
    removeLayer: function(layerInstance) {
      if (this.map && this.map instanceof L.Map) {
        this.map.removeLayer(layerInstance);
      }
    }

  });

})(this.App);
