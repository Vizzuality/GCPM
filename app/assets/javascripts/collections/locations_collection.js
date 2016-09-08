(function(App) {

  'use strict';

  App.Collection.Locations = Backbone.Collection.extend({

    url: '/api/map',

    toGeoJSON: function() {
      return {
        type: 'FeatureCollection',
        features: _.map(this.models, function(m) {
          var location = JSON.parse(m.attributes.centroid);
          // TODO: don't make this here
          if (m.attributes.type === 'region') {
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
