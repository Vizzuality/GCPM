(function(App) {

  'use strict';

  App.Collection.Projects = Backbone.Collection.extend({

    url: '/api/projects',

    comparator: function(item) {
      return item.get('title');
    }

  });

})(this.App);
