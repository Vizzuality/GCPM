(function(App) {

  'use strict';

  // var bubblesLayerSpec = [
  //   {
  //     name: 'Number of projects',
  //     type: 'bubble',
  //     active: true
  //   },
  //   {
  //     name: 'Number of projects',
  //     type: 'bubble',
  //     active: false
  //   },
  //   {
  //     name: 'Number of projects',
  //     type: 'bubble',
  //     active: false
  //   }
  // ];

  var locations = new App.Collection.Locations();

  function createBubble(feature) {
    var location = feature.geometry.coordinates;
    var bubbleIcon = L.divIcon({
      className: 'bubble-icon',
      html: feature.properties.count
    });
    return L.marker(location, { icon: bubbleIcon });
  }

  App.facade.layer = {

    getLayer: function(params) {
      var deferred = new $.Deferred();
      var fetchParams = _.pick(params, 'region');

      if (params.region) {
        fetchParams['regions[]'] = params.region;
        fetchParams.group = 'countries';
      }
      fetchParams.type = params['data'];

      locations
        .fetch({ data: fetchParams || {} })
        .done(function() {
          var layer;
          var geoJson = locations.toGeoJSON();
          if (params.country) {
            layer = L.geoJson(geoJson, {
              pointToLayer: createMarker
            });
          } else {
            layer = L.geoJson(geoJson, {
              pointToLayer: createBubble
            });
          }
          deferred.resolve(layer);
        });

      return deferred.promise();
    }

  };


})(this.App);
