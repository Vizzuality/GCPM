(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.Map = Backbone.View.extend({

    el: '#map',

    mapOptions: {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 3
    },

    events: {

    },

    initialize: function() {
      this.setMap();
      this.setBasemap();
    },

    /**
     * - setMap
     * Load the map
     */
    setMap: function() {
      this.map = L.map(this.el.id, this.mapOptions);      
      console.log(this.map);
    },

    /**
     * - setBaselayer
     * Load the basemap
     */
    setBasemap: function() {
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }


  });

})(this.App);
