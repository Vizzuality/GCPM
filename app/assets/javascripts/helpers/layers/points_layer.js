(function(App) {

  'use strict';

  App.helper.pointsLayer = function(geoJSON) {
    return L.geoJson(geoJSON, {
      pointToLayer: function(feature, latLng) {
        var className = feature.properties.is_project_lead ? '-alternative' : '';
        var pointIcon = new L.divIcon({
          iconSize: [15, 15],
          className: 'point-icon ' + className,
          html: ''
        });

        var location = L.latLng(latLng.lng, latLng.lat);
        var marker = L.marker(location, { icon: pointIcon });

        return marker;
      },
      onEachFeature: function (feature, layer) {
        // TODO: change href feature.properties.title by feature.properties.id
        layer
          .bindPopup('<a href="/investigators/' + feature.properties.title + '">' + feature.properties.title + '</a>');
      }
    });
  };

})(this.App);
