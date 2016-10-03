(function(App) {

  'use strict';

  App.helper.pointsLayer = function(geoJSON) {
    return L.geoJson(geoJSON, {
      pointToLayer: function(feature, latLng) {
        var pointIcon = new L.divIcon({
          iconSize: [15, 15],
          className: 'point-icon',
          html: ''
        });

        var location = L.latLng(latLng.lng, latLng.lat);
        var marker = L.marker(location, { icon: pointIcon });

        return marker;
      }
    });
  };

})(this.App);
