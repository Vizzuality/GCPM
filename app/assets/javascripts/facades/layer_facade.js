(function(App) {

  'use strict';

  var blubbleSizes = {
    big: 90,
    medium: 65,
    small: 45
  };

  var layerFacade = {

    getLayer: function(params) {
      var deferred = new $.Deferred();
      var locations = new App.Collection.Locations();
      var fetchParams = params;

      if (params['countries[]']) {
        fetchParams.group = 'points';
      } else if (params['regions[]']) {
        fetchParams.group = 'countries';
      }

      if (!params['regions[]']) {
        delete fetchParams['regions[]'];
      }

      if (!params['countries[]']) {
        delete fetchParams['countries[]'];
      }

      locations
        .fetch({ data: fetchParams })
        .done(function() {
          var layer;
          var geoJson = locations.toGeoJSON();
          if (params['countries[]']) {
            layer = App.helper.markerClusterLayer(geoJson, params);
          } else {
            layer = App.helper.bubbleLayer(geoJson, params, layerFacade);
          }
          deferred.resolve(layer);
        });

      return deferred.promise();
    },

    getPointLayer: function(params) {
      var fetchParams = Object.assign(gon.server_params, { group: 'points' });
      var deferred = new $.Deferred();
      var locations = new App.Collection.Locations();
      locations
        .fetch({ data: fetchParams })
        .done(function() {
          var layer = App.helper.pointsLayer(locations.toGeoJSON());
          deferred.resolve(layer, markers);
        });
      return deferred.promise();
    }

  };

  App.facade.layer = _.extend(layerFacade, Backbone.Events);

})(this.App);
