/* global PruneCluster, PruneClusterForLeaflet */
(function(App) {

  'use strict';

  var blubbleSizes = {
    big: 90,
    medium: 70,
    small: 50
  };

  /**
   * Creating marker layer for country detail
   * showing project leaders and researchers
   * @param  {Object} geoJson
   * @return {Object}
   */
  App.helper.markerClusterLayer = function(geoJson, params) {
    var pruneCluster = new PruneClusterForLeaflet();
    var infowindowTemplate = HandlebarsTemplates['infowindow'];

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
      marker.data.feature = feature;
      return marker;
    };

    pruneCluster.PrepareLeafletMarker = function(leafletMarker, data) {
      console.log(data.feature.properties)
      var htmlContent = infowindowTemplate(data.feature.properties);
      var icon = circleIcon;
      if (data.feature.properties.is_project_lead || params.data === 'events') {
        icon = markerIcon;
      }
      icon.options.className += ' -' + params.data;
      leafletMarker.setIcon(icon);
      leafletMarker.bindPopup(htmlContent);
    };

    pruneCluster.originalIcon = pruneCluster.BuildLeafletClusterIcon;

    pruneCluster.Cluster.Size = 20;

    pruneCluster.BuildLeafletClusterIcon = function(cluster) {
      var icon = pruneCluster.originalIcon(cluster);
      var bubleSize = blubbleSizes.small;
      if (cluster.totalWeight >= 100 &&
        cluster.totalWeight < 999) {
        bubleSize = blubbleSizes.medium;
      } else if (cluster.totalWeight > 999) {
        bubleSize = blubbleSizes.big;
      }
      icon.options.iconSize = new L.Point(bubleSize, bubleSize, null);
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
