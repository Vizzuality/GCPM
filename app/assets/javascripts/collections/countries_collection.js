(function(App) {

  'use strict';

  App.Collection.Countries = Backbone.Collection.extend({

    url: '/api/countries',

    comparator: function(item) {
      return item.get('name');
    },

    getRegions: function() {
      return _.map(this.toJSON(), function(country){
        return {
          region_iso: country.region_iso,
          region_name: country.region_name
        }
      }.bind(this));
    }

  });

})(this.App);
