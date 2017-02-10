(function(App) {

  'use strict';

  App.Collection.Countries = Backbone.Collection.extend({

    url: '/api/countries',

    comparator: function(item) {
      return item.get('name');
    },

    getRegions: function() {
      return _.sortBy(_.uniq(_.map(this.toJSON(), function(country){
        return {
          region_iso: country.region_iso,
          region_name: country.region_name
        }
      }.bind(this)), 'region_iso'), 'region_name');
    }

  });

})(this.App);
