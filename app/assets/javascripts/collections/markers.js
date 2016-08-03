(function(App) {

  'use strict';

  App.Collection = App.Collection || {};
  App.Collection.Markers = Backbone.Collection.extend({
    url: 'http://localhost:3000/api/map',

    initialize: function(options) {
      this.options = options ? options : {};
    },

    parse: function(response) {
      return _.map(response, function(marker){
        var centroid = (marker.type == 'region') ? JSON.parse(marker.centroid).coordinates.reverse() :JSON.parse(marker.centroid).coordinates
        marker.centroid = centroid;
        return marker;
      })
    }

  });

})(this.App);
