(function(App) {

  'use strict';

  var blubbleSizes = {
    big: 90,
    medium: 65,
    small: 45
  };

  var locations = new App.Collection.Locations();

  var layerFacade = {

    getLayer: function(params) {
      var deferred = new $.Deferred();
      var fetchParams = params;

      if (params.country) {
        fetchParams['countries[]'] = params.country;
        fetchParams.group = 'points';
      } else if (params.region) {
        fetchParams['regions[]'] = params.region;
        fetchParams.group = 'countries';
      }

      locations
        .fetch({ data: fetchParams })
        .done(function() {
          var layer;
          var geoJson = locations.toGeoJSON();
          if (params.country) {
            layer = App.helper.markerClusterLayer(geoJson, params);
          } else {
            layer = App.helper.bubbleLayer(geoJson, params, layerFacade);
          }
          deferred.resolve(layer);
        });

      return deferred.promise();
    },

    getPointLayer: function(params) {
      var deferred = new $.Deferred();
      var LocationsCollection = App.Collection.Locations.extend({
        url: '/api/map/projects/' + params.vars[0]
      });
      var locations = new LocationsCollection();
      locations
        .fetch()
        .done(function() {
          var layer = App.helper.pointsLayer(locations.toGeoJSON());
          deferred.resolve(layer);
        });
      return deferred.promise();
    }

  };

  App.facade.layer = _.extend(layerFacade, Backbone.Events);

})(this.App);
