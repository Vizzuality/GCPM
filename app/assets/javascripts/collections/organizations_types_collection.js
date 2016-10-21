(function(App) {

  'use strict';

  App.Collection.OrganizationTypes = Backbone.Collection.extend({

    url: '/api/organization-types',

    comparator: function(item) {
      return item.get('name');
    },

  });

})(this.App);
