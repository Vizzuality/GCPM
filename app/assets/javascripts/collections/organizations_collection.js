(function(App) {

  'use strict';

  App.Collection.Organizations = Backbone.Collection.extend({

    url: '/api/organizations',

    comparator: function(item) {
      return item.get('name');
    },

  });

})(this.App);
