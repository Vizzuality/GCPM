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
        var htmlContent = '';

        if (feature.properties.province_state || feature.properties.city) {
          htmlContent = '<p>' + feature.properties.city + ', '
            + feature.properties.province_state + '</p>';
        } else {
          htmlContent = '<a href="/investigators/' + feature.properties.investigator_slug + '">'
            + feature.properties.investigator_name + '</a>';
        }
        layer.bindPopup(htmlContent);
      }
    });
  };

})(this.App);
