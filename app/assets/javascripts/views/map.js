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

    el: '#map',

    defaults: {
      map: {
        zoom: 3,
        // center: [0, 0],
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

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);
      this.params.set(settings.params, { silent: true });
      // this.layers = settings.layers;

      this.createMap();

      this.listeners();
    },

    listeners: function() {
      // this.layers.on('sync reset change', this.renderLayers.bind(this));
      App.Events.on('params:update', function(params){
        this.params.clear().set(params, { silent: true });
        this.setMarkers();
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
        this.setMarkers();
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
        this.map.removeLayer(this.basemap);
      } else {
        console.info('Basemap doesn\'t exist.');
      }
    },


    setMarkers: function() {

      this.removeLayer({
        id: 'marker-layer'
      })

      var markers = new App.Collection.Markers();
      markers
        .fetch({
          data: this.params.toJSON()
        })
        .done(function(){
          var options = {
            markers: markers.toJSON()
          };

          var layerInstance = new App.Helper.MarkerLayer(this.map, options);

          layerInstance.create();

          this.setLayer(layerInstance, {
            id: 'marker-layer'
          });

        }.bind(this));
    },


    /************
     * LAYERS
     * - renderLayers
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
    },

    /**
     * - addLayer
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

            this.setLayer(layerInstance, layerData);
          break;

          default:
            layerInstance = null;
            this.setLayer(layerInstance, layerData);
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
     * - setLayer
     * Store the layer in the model
     * @param  {Object} layerData
     */
    setLayer: function(layerInstance, layerData) {
      if (layerInstance) {
        this.model.set(layerData.id, layerInstance);
      } else {
        throw 'Layer type hasn\'t been defined or it doesn\'t exist.';
      }
    },

    /**
     * - removeLayer
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
