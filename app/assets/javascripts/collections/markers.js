(function(App) {

  'use strict';

  App.Collection = App.Collection || {};
  App.Collection.Markers = Backbone.Collection.extend({
    
    url: '/api/map',

    initialize: function(options) {
      this.options = options ? options : {};

      if (this.options.apiUrl) {
        this.url = this.options.apiUrl;
      }
    },

    parse: function(response) {
      return _.map(response, function(marker){
        // Get the centroid of the location
        var centroid = JSON.parse(marker.centroid);
        if (marker.type == 'region') {
          marker.centroid = (!!centroid) ? centroid.coordinates.reverse() : null;
        } else {
          marker.centroid = (!!centroid) ? centroid.coordinates : null;
        }

        return marker;
      }.bind(this));
    }

  });

})(this.App);
