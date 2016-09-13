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

      if (params.country) {
        fetchParams['countries[]'] = params.country;
        fetchParams.group = 'points';
      } else if (params.region) {
        fetchParams['regions[]'] = params.region;
        fetchParams.group = 'countries';
      }

      fetchParams.type = params.data;

      locations
        .fetch({ data: fetchParams || {} })
        .done(function() {
          var layer;
          var geoJson = locations.toGeoJSON();
          var optionsCircle = {
            radius: 12,
            fillColor: "#b85fff",
            color: "#9440d7",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
          };

          if (params.country) {
            layer = L.geoJson(geoJson, {
              pointToLayer: function (feature, latlng) {
                return createMarker(feature, latlng, optionsCircle);
              }
            });
          } else {
            layer = createBubbleLayer(geoJson, params);
          }
          deferred.resolve(layer);
        });

      return deferred.promise();
    }

  };

  function createMarker(feature, latlng, optionsCircle) {
    if (feature.properties.is_project_lead) {
      var options = Object.assign({}, optionsCircle, {icon: createIconMarker()});
      return L.marker(latlng, options);
    } else {
      return L.circleMarker(latlng, optionsCircle);
    }
  }

  function createIconMarker() {
    return new L.divIcon({
      iconSize: [12, 12],
      className: 'c-marker -icon',
      html: '<svg class="icon icon-Oval"><use xlink:href="#icon-Oval"></use></svg>'
    });
  }

  function createBubbleLayer(geoJson, params) {
    var pruneCluster = new PruneClusterForLeaflet();

    pruneCluster.PrepareLeafletMarker = function(leafletMarker, data) {
      leafletMarker.setIcon(data.icon);
      leafletMarker.off('click').on('click', function() {
        var eventName = null;
        if (!params.region && !params.country) {
          eventName = 'region';
        } else if (params.region && !params.country) {
          eventName = 'country';
        }
        var newState = Object.assign(data.feature.properties, params);
        if (eventName) {
          layerFacade.trigger(eventName + ':change', newState);
        }
      });
    };

    pruneCluster.BuildLeafletIcon = function(feature) {
      var location = feature.geometry.coordinates;
      var bubleSize = blubbleSizes.small;
      if (feature.properties.count >= 100 &&
        feature.properties.count < 999) {
        bubleSize = blubbleSizes.medium;
      } else if (feature.properties.count > 999) {
        bubleSize = blubbleSizes.big;
      }
      var className = 'bubble-icon ' +
        (params.data === 'events' ? '-orange' : '-blue');
      var bubbleIcon = L.divIcon({
        iconSize: [bubleSize, bubleSize],
        className: className,
        html: feature.properties.count
      });
      var marker = new PruneCluster.Marker(location[0], location[1]); // lat, lng
      marker.data.icon = bubbleIcon;
      marker.data.feature = feature;
      return marker;
    };

    pruneCluster.originalIcon = pruneCluster.BuildLeafletClusterIcon;

    pruneCluster.BuildLeafletClusterIcon = function(cluster) {
      var icon = pruneCluster.originalIcon(cluster);
      var className = (params.data === 'events' ? '-orange' : '-blue');
      icon.options.className += ' ' + className;
      return icon;
    };

    _.each(geoJson.features, function(feature) {
      pruneCluster.RegisterMarker(pruneCluster.BuildLeafletIcon(feature));
    });

    return pruneCluster;
  }

  App.facade.layer = _.extend(layerFacade, Backbone.Events);

})(this.App);
