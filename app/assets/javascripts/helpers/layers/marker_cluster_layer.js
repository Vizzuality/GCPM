/* global PruneCluster, PruneClusterForLeaflet */
(function(App) {

  'use strict';

  var blubbleSizes = {
    big: 90,
    medium: 65,
    small: 45
  };

  /**
   * Creating marker layer for country detail
   * showing project leaders and researchers
   * @param  {Object} geoJson
   * @return {Object}
   */
  App.helper.markerClusterLayer = function(geoJson) {
    var pruneCluster = new PruneClusterForLeaflet();

    var circleIcon = new L.divIcon({
      iconSize: [26, 26],
      className: 'circle-icon',
      html: ''
    });

    var markerIcon = new L.divIcon({
      iconSize: [26, 36],
      className: 'marker-icon',
      html: '<svg class="icon icon-marker"><use xlink:href="#icon-marker"></use></svg>'
    });

    pruneCluster.BuildLeafletIcon = function(feature) {
      var location = feature.geometry.coordinates;
      var marker = new PruneCluster.Marker(location[0], location[1]); // lat, lng
      if (feature.properties.is_project_lead) {
        marker.data.icon = markerIcon;
      } else {
        marker.data.icon = circleIcon;
      }
      marker.data.feature = feature;
      return marker;
    };

    pruneCluster.originalIcon = pruneCluster.BuildLeafletClusterIcon;

    pruneCluster.Cluster.Size = 20;

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
      var southWest = L.latLng(bounds.minLat, bounds.maxLng);
      var northEast = L.latLng(bounds.maxLat, bounds.minLng);
      return L.latLngBounds(southWest, northEast);
    };

    _.each(geoJson.features, function(feature) {
      pruneCluster.RegisterMarker(pruneCluster.BuildLeafletIcon(feature));
    });

    return pruneCluster;
  };

})(this.App);
