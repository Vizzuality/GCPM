(function(App) {

  'use strict';

  App.Collection.Locations = Backbone.Collection.extend({

    url: '/api/map',

    model: App.Model.Location,

    parse: function(data) {
      return _.filter(data, function(d) {
        return !!d.centroid && d.iso !== 'AN';
      });
    },

    toGeoJSON: function() {
      return {
        type: 'FeatureCollection',
        features: _.map(this.models, function(m) {
          return {
            type: 'Feature',
            geometry: JSON.parse(m.attributes.centroid),
            properties: m.attributes
          };
        })
      };
    }

  });

})(this.App);
