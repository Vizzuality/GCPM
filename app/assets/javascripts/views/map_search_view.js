/* global google */
(function(App) {

  'use strict';

  App.View.MapSearch = Backbone.View.extend({

    initialize: function(settings) {
      var opts = (settings && settings.options) || {};
      this.options = _.extend({}, this.defaults, opts);

      if (!this.options.nocreate) {
        this.setSearchBox();
      }
    },

    setSearchBox: function() {
      var input = this.$('#map-search-input')[0];
      this.autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode']
      });
      this.autocomplete.addListener('place_changed', this.onPlaceSelected.bind(this));
    },

    onPlaceSelected: function() {
      var place = this.autocomplete.getPlace();
      if (place !== undefined && place.geometry) {
        if (place.geometry.viewport) {
          var p1 = L.latLng(place.geometry.viewport.f.f,place.geometry.viewport.b.f);
          var p2 = L.latLng(place.geometry.viewport.f.b,place.geometry.viewport.b.b);
          var bounds = L.latLngBounds(p1,p2);
          this.trigger('bounds', bounds);
        }

        if (place.geometry.location && !place.geometry.viewport) {
          this.trigger('center', place.geometry.location.lat(), place.geometry.location.lng());
        }
      }
    }

  });

})(this.App);
