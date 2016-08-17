(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  App.View.CartoLayer = App.Helper.Class.extend({

    defaults: {},

    /* TO-DO: template may change depending on section */
    template: HandlebarsTemplates['map-tooltip'],

    initialize: function(settings) {
      this.options = _.extend({}, this.defaults, settings || {});
      this.params = settings.params;
      this.layer = this.params.get('layer');
      // TO-DO: set the variables depending on params config coming from layersSpec.json
      // or admin layers tables
      if (this.layer) {
        this.carto = new App.Helper.CartoOptions({layer: this.layer});
        this.cartoOpts = this.carto.getCartoOptions();
        this.cartocss = settings.config.cartocss || this.cartoOpts.cartocss;
        this.sql = settings.config.sql || this.cartoOpts.sql;
        this.create();
      }
    },

    /************
     * LAYER
     * - create
     * Returns carto layer
     */
    create: function() {
      var mapconfig = {
        "version": "1.3.1",
        "layers": [{
          "type": "cartodb",
          "options": {
            "cartocss_version": "2.1.1",
            "cartocss": this.cartocss,
            "sql": this.sql
          }
        }]
      };

      var promise = $.ajax({
        crossOrigin: true,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        url: 'https://crm.carto.com/api/v1/map',
        data: JSON.stringify(mapconfig)
      });

      return promise.then(function(data) {
        var tileUrl = 'https://crm.carto.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png';
        var layer = L.tileLayer(tileUrl);
        return layer;
      });
    },

  });

})(this.App);
