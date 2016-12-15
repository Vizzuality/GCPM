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
          "user_name": "crm",
          "type": "cartodb",
          "options": {
            "cartocss_version": "2.3.0",
            "cartocss": this.cartocss,
            "sql": this.sql,
            "interactivity": ["country_name", "value"]
          }
        }]
      };

      var promise = $.ajax({
        url: 'https://' + this.db + '.cartodb.com/api/v1/map',
        data: {
          config: decodeURIComponent(JSON.stringify(mapconfig))
        }
      });

      return promise.then(function(data) {
        var tileUrl = 'https://' + this.db + '.carto.com/api/v1/map/' + data.layergroupid + '/0/{z}/{x}/{y}';
        var layer = new L.tileLayer(this.getUrl('png', tileUrl));
        var utfGrid = new L.UtfGrid(this.getUrl('grid.json', tileUrl));

        return {
          layer: layer,
          utfGrid: utfGrid
        };
      }.bind(this));
    },

    getUrl: function(format, minUrl) {
      var url = minUrl + '.' + format;

      if (format === 'grid.json') {
        return url + '?callback={cb}';
      }

      return url;
    }

  };

  App.facade.cartoLayer = _.extend(cartoLayerFacade, Backbone.Events);

})(this.App);
