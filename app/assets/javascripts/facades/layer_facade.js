(function(App) {

  'use strict';

  var blubbleSizes = {
    big: 200,
    medium: 140,
    small: 90
  };

  var locations = new App.Collection.Locations();

  var layerFacade = {

    getLayer: function(params) {
      var deferred = new $.Deferred();
      var fetchParams = _.pick(params, 'region');

      if (params.region) {
        fetchParams['regions[]'] = params.region;
        fetchParams.group = 'countries';
      }
      fetchParams.type = params.data;

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
            layer = createBubbleLayer(geoJson, params);
          }
          deferred.resolve(layer);
        });

      return deferred.promise();
    }

  };

  function createBubbleMarker(feature) {
    var location = feature.geometry.coordinates;
    var bubleSize = blubbleSizes.small;
    if (feature.properties.count >= 100 &&
      feature.properties.count < 999) {
      bubleSize = blubbleSizes.medium;
    } else if (feature.properties.count > 999) {
      bubleSize = blubbleSizes.big;
    }
    var bubbleIcon = L.divIcon({
      iconSize: [bubleSize, bubleSize],
      className: 'bubble-icon -blue',
      html: feature.properties.count
    });
    var marker = new PruneCluster.Marker(location[0], location[1]); // lat, lng
    marker.data.icon = bubbleIcon;
    marker.data.feature = feature;
    return marker;
  }

  function createBubbleLayer(geoJson, params) {
    var pruneCluster = new PruneClusterForLeaflet();
    pruneCluster.PrepareLeafletMarker = function(leafletMarker, data) {
      leafletMarker.setIcon(data.icon);
      leafletMarker.on('click', function() {
        var eventName = null;
        if (!params.region && !params.country) {
          eventName = 'region';
        } else if (params.region && !params.country) {
          eventName = 'country';
        }
        if (eventName) {
          layerFacade.trigger(eventName + ':change', data.feature.properties);
        }
      });
    };
    _.each(geoJson.features, function(feature) {
      pruneCluster.RegisterMarker(createBubbleMarker(feature));
    });
    return pruneCluster;
  }

  App.facade.layer = _.extend(layerFacade, Backbone.Events);

})(this.App);
