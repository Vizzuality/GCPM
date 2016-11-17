(function(App) {

  'use strict';

  var mapGraphFacade = {
    _parseMapData: function(data) {
      var parseData = _.map(data, function(point) {
        return {
          geometry: {
            coordinates: {
              0: point.latitude,
              1: point.longitude
            },
            type: "Point"
          },
          properties: point,
          type: "Feature"

        };
      }.bind(this));

      this.geoData = {
        features: parseData,
        type: "FeatureCollection"
      }
    },

    _getPointLayer: function() {
      var deferred = new $.Deferred();
      var layer = App.helper.pointsLayer(this.geoData);

      deferred.resolve(layer);
      return deferred.promise();
    },

    addPointLayer: function(data, map) {
      this._parseMapData(data);

      this._getPointLayer().done(function(layer) {
        map.addLayer(layer);

        setTimeout(function() {
          if (layer && layer.getBounds()) {
            map.fitBounds(layer.getBounds());
          }
        }, 100);
      }.bind(this));
    },

  };

  App.facade.mapGraph = _.extend(mapGraphFacade, Backbone.Events);

})(this.App);
