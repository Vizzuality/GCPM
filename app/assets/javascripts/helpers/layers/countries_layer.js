(function(App) {

  'use strict';

  var defaultStyles = {
    color: '#fff',
    opacity: 0.7,
    weight: 1,
    fill: true,
    fillOpacity: 0.1
  };

  var hoverStyles = {
    color: '#f57823',
    opacity: 1,
    weight: 3,
    fill: true,
    fillOpacity: 0.1
  };

  App.helper.countriesLayer = function() {
    var deferred = new $.Deferred();
    var countriesLayer = null;
    $.get('/data/countries.json', function(countriesGeoJSON) {
      var countriesLayer = L.geoJson(countriesGeoJSON, {
        style: function() {
          return defaultStyles;
        },
        onEachFeature: function(feature, layer) {
          layer.on('mouseover', function() {
            layer.setStyle(hoverStyles);
          }).on('mouseout', function() {
            layer.setStyle(defaultStyles);
          });
        }
      });
      deferred.resolve(countriesLayer);
    });
    return deferred.promise(countriesLayer);
  };

})(this.App);
