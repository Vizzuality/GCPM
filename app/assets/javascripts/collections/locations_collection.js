(function(App) {

  'use strict';

  App.Collection.Locations = Backbone.Collection.extend({

    url: '/api/map',

    toGeoJSON: function() {
      var locations = _.filter(this.models, function(m) {
        return !!m.attributes.centroid;
      });
      return {
        type: 'FeatureCollection',
        features: _.map(locations, function(m) {
          var location = JSON.parse(m.attributes.centroid);
          // TODO: don't make this here
          if (m.attributes.type === 'region' || m.attributes.type === 'point') {
            location.coordinates = location.coordinates.reverse();
          }
          return {
            type: 'Feature',
            geometry: location,
            properties: m.attributes
          };
        })
      };
    }

  });

})(this.App);
