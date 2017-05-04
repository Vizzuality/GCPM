/* global PruneCluster, PruneClusterForLeaflet */
(function(App) {

  'use strict';

  var clusterSizes = {
    big: 60,
    medium: 45,
    small: 30
  };

  /**
   * Creating marker layer for country detail
   * showing project leaders and researchers
   * @param  {Object} geoJson
   * @return {Object}
   */
  App.helper.pointsClusterLayer = function(geoJson) {
    var pruneCluster = new PruneClusterForLeaflet();
    var infowindowTemplate = HandlebarsTemplates['infowindow'];

    pruneCluster.BuildLeafletIcon = function(feature) {
      var location = feature.geometry.coordinates;
      var marker = new PruneCluster.Marker(location[0], location[1] + 360); // lat, lng
      marker.data.feature = feature;
      return marker;
    };

    pruneCluster.PrepareLeafletMarker = function(leafletMarker, data) {
      var className = data.feature.properties.is_project_lead ? '-alternative' : '';
      var infowindowData = data.feature.properties;
      if(infowindowData.type !== 'point'){
        infowindowData[infowindowData.type] = infowindowData.id || infowindowData.location_id;
        className = '-alternative';
      }
      var pointIcon = new L.divIcon({
        iconSize: [15, 15],
        className: 'point-icon ' + className,
        html: ''
      });

      var htmlContent = infowindowTemplate(infowindowData);
      leafletMarker.setIcon(pointIcon);
      leafletMarker.bindPopup(htmlContent);
    };

    pruneCluster.originalIcon = pruneCluster.BuildLeafletClusterIcon;

    pruneCluster.Cluster.Size = 50;

    pruneCluster.BuildLeafletClusterIcon = function(cluster) {
      var size = clusterSizes.small;
      if (cluster.totalWeight > 99) {
        size = clusterSizes.medium;
      } else if (cluster.totalWeight > 999) {
        size = clusterSizes.big;
      }
      var icon = pruneCluster.originalIcon(cluster);
      icon.options.iconSize = new L.Point(size, size, null);
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
