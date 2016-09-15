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
          if (params.country) {
            layer = createMarkerLayer(geoJson, params);
          } else {
            layer = createBubbleLayer(geoJson, params);
          }
          deferred.resolve(layer);
        });

      return deferred.promise();
    }

  };

  /**
   * Creating marker layer for country detail
   * showing project leaders and researchers
   * @param  {Object} geoJson
   * @return {Object}
   */
  function createMarkerLayer(geoJson) {
    var pruneCluster = new PruneClusterForLeaflet();

    var circleIcon = new L.divIcon({
      iconSize: [26, 26],
      className: 'circle-icon',
      html: ''
    });

    var ovalIcon = new L.divIcon({
      iconSize: [26, 36],
      className: 'oval-icon',
      html: '<svg class="icon icon-Oval"><use xlink:href="#icon-Oval"></use></svg>'
    });

    pruneCluster.BuildLeafletIcon = function(feature) {
      var location = feature.geometry.coordinates;
      var marker = new PruneCluster.Marker(location[0], location[1]); // lat, lng
      if (feature.properties.is_project_lead) {
        marker.data.icon = ovalIcon;
      } else {
        marker.data.icon = circleIcon;
      }
      marker.data.feature = feature;
      return marker;
    };

    pruneCluster.originalIcon = pruneCluster.BuildLeafletClusterIcon;

    pruneCluster.BuildLeafletClusterIcon = function(cluster) {
      var icon = pruneCluster.originalIcon(cluster);
      icon.options.iconSize = new L.Point(60, 60, null);
      return icon;
    };

    pruneCluster.getBounds = function() {
      var bounds = pruneCluster.Cluster.ComputeGlobalBounds();
      if (!bounds) {
        return bounds;
      }
      var southWest = L.latLng(bounds.maxLat, bounds.maxLng);
      var northEast = L.latLng(bounds.minLat, bounds.minLng);
      return L.latLngBounds(southWest, northEast);;
    };

    _.each(geoJson.features, function(feature) {
      pruneCluster.RegisterMarker(pruneCluster.BuildLeafletIcon(feature));
    });

    return pruneCluster;
  }

  /**
   * Creating buble marker layer for region and countries layer
   * @param  {Object} geoJson
   * @param  {Object} params
   * @return {Object}
   */
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
      icon.options.iconSize = new L.Point(60, 60, null);
      return icon;
    };

    pruneCluster.getBounds = function() {
      var bounds = pruneCluster.Cluster.ComputeGlobalBounds();
      if (!bounds) {
        return bounds;
      }
      var southWest = L.latLng(bounds.minLat, bounds.maxLng);
      var northEast = L.latLng(bounds.maxLat, bounds.minLng);
      return L.latLngBounds(southWest, northEast);;
    };

    _.each(geoJson.features, function(feature) {
      pruneCluster.RegisterMarker(pruneCluster.BuildLeafletIcon(feature));
    });

    return pruneCluster;
  }

  App.facade.layer = _.extend(layerFacade, Backbone.Events);

})(this.App);
