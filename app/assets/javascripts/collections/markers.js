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
        marker.centroid = JSON.parse(marker.centroid).coordinates.reverse();
        return marker;
      })
    }

  });

})(this.App);
