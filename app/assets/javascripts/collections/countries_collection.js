(function(App) {

  'use strict';

  App.Collection.Countries = Backbone.Collection.extend({

    url: '/api/countries',

    comparator: function(item) {
      return item.get('name');
    },

  });

})(this.App);
