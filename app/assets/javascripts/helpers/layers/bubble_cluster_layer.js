/* global PruneCluster, PruneClusterForLeaflet */
(function(App) {

  'use strict';

  var blubbleSizes = {
    big: 90,
    medium: 65,
    small: 45
  };

  /**
   * Creating buble marker layer for region and countries layer
   * @param  {Object} geoJson
   * @param  {Object} params
   * @return {Object}
   */
  function createClusterBubbleLayer(geoJson, params, layerFacade) {
    var pruneCluster = new PruneClusterForLeaflet();

    pruneCluster.PrepareLeafletMarker = function(leafletMarker, data) {
      leafletMarker.setIcon(data.icon);
      leafletMarker.off('click').on('click', function() {
        var eventName = null;
        if (!params['regions[]'] && !params['countries[]']) {
          eventName = 'region';
        } else if (params['regions[]'] && !params['countries[]']) {
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
      return L.latLngBounds(southWest, northEast);
    };

    _.each(geoJson.features, function(feature) {
      pruneCluster.RegisterMarker(pruneCluster.BuildLeafletIcon(feature));
    });

    return pruneCluster;
  }

  App.helper.BubbleClusterLayer = createClusterBubbleLayer;

})(this.App);
