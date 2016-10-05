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
  App.helper.pointsClusterLayer = function(geoJson) {
    var pruneCluster = new PruneClusterForLeaflet();

    pruneCluster.BuildLeafletIcon = function(feature) {
      var location = feature.geometry.coordinates;
      var className = feature.properties.is_project_lead ? '-alternative' : '';
      var pointIcon = new L.divIcon({
        iconSize: [15, 15],
        className: 'point-icon ' + className,
        html: ''
      });
      var marker = new PruneCluster.Marker(location[0], location[1]); // lat, lng
      marker.data.icon = pointIcon;
      marker.data.feature = feature;
      return marker;
    };

    pruneCluster.originalIcon = pruneCluster.BuildLeafletClusterIcon;

    pruneCluster.BuildLeafletClusterIcon = function(cluster) {
      var icon = pruneCluster.originalIcon(cluster);
      icon.options.iconSize = new L.Point(30, 30, null);
      icon.options.className += ' -points-cluster-icon';
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
