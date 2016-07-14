(function(App) {

  'use strict';

  App.View = App.View || {};
  
  App.View.Map = Backbone.View.extend({

    el: '#map',

    defaults: {
      map: {
        zoom: 3,
        center: [0, 0],
        scrollWheelZoom: false
      },
      basemap: {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        options: {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
      }
    },


    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);

      this.createMap();
    },

    /**
     * Instantiates a Leaflet map object
     */
    createMap: function() {
      if (!this.map) {
        this.map = L.map(this.el.id, this.options.map);

        this.setBasemap();

      } else {
        console.info('Map already exists.');
      }
    },

    /**
     * Destroys the map and clears all related event listeners
     */
    removeMap: function() {
      if (this.map) {
        this.map.remove();
        this.map = null;
      } else {
        console.info('Map doesn\'t exist yet.');
      }
    },

    /**
     * Add a basemap to map
     * @param {String} basemapUrl http://{s}.tile.osm.org/{z}/{x}/{y}.png
     */
    setBasemap: function() {
      if (!this.map) {
        throw 'Map must exists.';
      }
      if (this.basemap) {
        this.map.removeLayer(this.basemap);
      }

      this.basemap = L.tileLayer(this.options.basemap.url, this.options.basemap.options).addTo(this.map);
    },

    /**
     * Remove basemap from mapView
     */
    unsetBasemap: function() {
      if (this.basemap) {
        this.map.removeLayer(this.basemap);
      } else {
        console.info('Basemap doesn\`t exist.');
      }
    },

    /**
     * Render or remove layers by Layers Collection
     */
    renderLayers: function() {
      var layersData = this.layers.toJSON();
      _.each(layersData, function(layerData) {
        if (layerData.active) {
          this.addLayer(layerData);
        } else {
          this.removeLayer(layerData);
        }
      }, this);
      this.fitBounds();
    },

    /**
     * Add a layer instance to map
     * @param {Object} layerData
     */
    addLayer: function(layerData) {
      if (typeof layerData !== 'object' ||
        !layerData.id || !layerData.type) {
        throw 'Invalid "layerData" format.';
      }

      if (!this.map) {
        throw 'Create a map before add a layer.';
      }
      
      var layer = this.model.get(layerData.id);

      if (!!layer) {
        this.removeLayer(layerData);
        layer = null;
      }

      var layerInstance;
      if (!layer) {
        switch(layerData.type) {
          case 'cartodb':
            var data = _.pick(layerData, ['sql', 'cartocss', 'interactivity', 'bounds']);
            var options = { sublayers: [data] };
            layerInstance = new App.Helper.CartoDBLayer(this.map, options);
            layerInstance.create(function(layer) {
              layer.setOpacity(layerData.opacity);
              layer.setZIndex(1000-layerData.order);
            }.bind(this));
          break;

          case 'marker':
            var options = { locations: this.locations.getMapLocations() };
            layerInstance = new App.Helper.MarkerLayer(this.map, options);
            layerInstance.create(function(layer) {
              layer.setOpacity(layerData.opacity);
              layer.setZIndex(1000-layerData.order);
            }.bind(this));
          break;

          default:
            layerInstance = null;
        }

        if (layerInstance) {
          this.model.set(layerData.id, layerInstance);
        } else {
          throw 'Layer type hasn\'t been defined or it doesn\'t exist.';
        }

      } else {
        if (layer.layer) {
          layer.layer.setOpacity(layerData.opacity);
          layer.layer.setZIndex(1000-layerData.order);
        }
        console.info('Layer "' + layerData.id + '"" already exists.');
      }
    },

    /**
     * Remove a specific layer on map
     * @param  {Object} layerData
     */
    removeLayer: function(layerData) {
      var layerInstance = this.model.get(layerData.id);

      if (layerInstance) {
        this.model.set(layerData.id, null);
        layerInstance.remove();
      }
    },

  });

})(this.App);