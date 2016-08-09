(function(App) {

  'use strict';

  App.View = App.View || {};

  App.Helper.Layer = App.Helper.Class.extend({

    defaults: {},

    model: new (Backbone.Model.extend({
      defaults: {
        layer: {}
      }
    })),

    params: new (Backbone.Model.extend()),

    initialize: function(settings) {
      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);
      this.params.set(settings.params, { silent: true });

      this.map = settings.map;

      this.createLayer();
      this.listeners();
    },

    listeners: function() {
      // this.layers.on('sync reset change', this.renderLayers.bind(this));
      App.Events.on('params:update', function(params){
        this.params.clear().set(params, { silent: true });
        // this.addLayer();
      }.bind(this));
      // this.model.off('change:layer');
      this.model.on('change:layer', this.addLayer.bind(this));
    },


     /************
     * LAYERS
     * - addLayer
     * Create a layer
     */

    addLayer: function() {
      if (!this.map) {
        throw 'Create a map before add a layer.';
      }

      // if (!!this.layer) {
      //   this.removeLayer();
      // }

      /* 'layer' is an instance of a MarkerLayer class */
      var layer = this.model.get('layer');
      if (layer) {
        layer.create();
      }
    },


    //  /**
    //  * - addLayer
    //  * Add a layer instance to map
    //  * @param {Object} layerData
    //  */
    // addLayer: function(layerData) {

    //   var layerInstance;
    //   if (!layer) {
    //     switch(layerData.type) {
    //       case 'carto':
    //         var data = _.pick(layerData, ['sql', 'cartocss', 'interactivity', 'bounds']);
    //         var options = { sublayers: [data] };
    //         layerInstance = new App.Helper.CartoDBLayer(this.map, options);
    //         layerInstance.create(function(layer) {
    //           layer.setOpacity(layerData.opacity);
    //           layer.setZIndex(1000-layerData.order);
    //         }.bind(this));
    //       break;

    //       default:
    //         layerInstance = null;
    //     }
    //   } else {
    //     if (layer.layer) {
    //       layer.layer.setOpacity(layerData.opacity);
    //       layer.layer.setZIndex(1000-layerData.order);
    //     }
    //     console.info('Layer "' + layerData.id + '"" already exists.');
    //   }
    // },

    /**
     * - removeLayer
     * Remove a specific layer on map
     */
    removeLayer: function() {
      this.model.get('layer').remove();
    },

  });

})(this.App);
