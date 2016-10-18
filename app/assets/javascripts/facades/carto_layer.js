(function(App) {

  'use strict';

  var cartoLayerFacade = {

    getLayer: function(params) {
      this.db = params.db || 'crm';
      this.cartocss = params.cartocss;
      this.sql = params.sql;

      return this.create();
    },

    /* Returns carto layer */
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
        url: 'https://' + this.db + '.carto.com/api/v1/map',
        data: JSON.stringify(mapconfig)
      });

      return promise.then(function(data) {
        var tileUrl = 'https://' + this.db + '.carto.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png';
        var layer = L.tileLayer(tileUrl);
        return layer;
      }.bind(this));
    }

  };

  App.facade.cartoLayer = _.extend(cartoLayerFacade, Backbone.Events);

})(this.App);
