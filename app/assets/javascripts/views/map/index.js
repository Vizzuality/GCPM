(function(App) {

  'use strict';

  var basemapsSpec = {
    nokiaTerrain: {
      url: 'https://4.maps.nlp.nokia.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24',
      options: {}
    },
    customDetail: {
      url: 'https://cartocdn-ashbu.global.ssl.fastly.net/simbiotica/api/v1/map/simbiotica@87e21c6d@632ee45870a97b639be881c43cd903b8:1467196236654/1/{z}/{x}/{y}.png'
    }
  };

  App.View = App.View || {};

  App.View.Map = Backbone.View.extend({

    defaults: {
      map: {
        zoom: 3,
        center: [0, 0],
        scrollWheelZoom: false
      },
      basemap: 'nokiaTerrain'
    },

    model: new (Backbone.Model.extend({
      defaults: {}
    })),

    params: new (Backbone.Model.extend()),

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      this._instancedlayers = {};

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);
      this.params.set(settings.params, { silent: true });

      this.createMap();

      this.listeners();
    },

    listeners: function() {
      // this.layers.on('sync reset change', this.renderLayers.bind(this));
      App.Events.on('params:update', function(params){
        this.params.clear().set(params, { silent: true });
        this.renderLayers();
      }.bind(this));
    },


    /************
     * MAP
     * - createMap
     * Instantiates a Leaflet map object
     */
    createMap: function() {
      if (!this.map) {
        if (!!this.$el.data('map')) {
          this.removeMap();
        }

        this.map = L.map(this.el.id, this.options.map);
        this.$el.data('map', this.map);

        this.setBasemap();
      } else {
        console.info('Map already exists.');
      }
    },

    /**
     * - removeMap
     * Destroys the map and clears all related event listeners
     */
    removeMap: function() {
      this.$el.data('map').remove();
      this.$el.data('map', null);
    },


    /************
     * BASEMAP
     * - setBasemap
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
      var basemapConfig = basemapsSpec[this.options.basemap];
      this.basemap = L.tileLayer(basemapConfig.url, basemapConfig.options).addTo(this.map);
    },

    /**
     * - unsetBasemap
     * Remove basemap from mapView
     */
    unsetBasemap: function() {
      if (this.basemap) {
        // this.map.removeLayer(this.basemap);
      } else {
        console.info('Basemap doesn\'t exist.');
      }
    },


    /************
     * LAYERS
     * - renderLayers
     * Render or remove layers by Layers Collection
     */
    renderLayers: function() {
      // At beginning clear all layers
      this.clearLayers();

      var LayersDic = {
        tile: App.View.MarkerLayer,
        carto: App.View.CartoLayer,
        marker: App.View.MarkerLayer
      };

      // Add all layers
      _.each(this.collection.models, function(layerModel) {
        var layerType = layerModel.attributes.type;
        if (LayersDic[layerType]) {
          var currentLayerObj = new LayersDic[layerType]({
            params: this.params,
            config: layerModel.attributes.config
          });

          currentLayerObj.create().done(_.bind(function(layer) {
            // Carto create function returns directly the layer
            if (layerType === "carto") {
              currentLayerObj.layer = layer;
            }
            this.currentLayer = currentLayerObj.layer;
            this.addLayer();
            this._instancedlayers[layerModel.attributes.id] = currentLayerObj;
            if(layerType === 'marker') {
              this._fitBounds(this.currentLayer);
            }
          }, this));
        }
      }, this);
    },

    /**
     * - renderLayers
     * Add layer to the map and its correspondant events
     */
    addLayer: function() {
      this.currentLayer.addTo(this.map)
        .on('mouseover', function(data) {
          var pos = this.map.latLngToContainerPoint(data.latlng);
          this.tooltip = new App.View.Tooltip({map: this.map, data: data, pos: pos});
        }.bind(this))
        .on('mouseout click', function(data) {
          this.tooltip.remove();
        }.bind(this));
    },

    /**
     * - clearLayers
     * Remove all layers from the map
     */
    clearLayers: function() {
      _.each(this._instancedlayers, function(layerInstanced) {
        this.map.removeLayer(layerInstanced.layer);
      }, this);
    },

    /**
     * - _fitBounds
     * Fit bounce to see all the markers
     */
    _fitBounds: function(layer) {
      this.map.fitBounds(layer.getBounds(), {
        paddingTopLeft: [30,30],
        paddingBottomRight: [30,30],
        maxZoom: 10
      });
    }

  });

})(this.App);
