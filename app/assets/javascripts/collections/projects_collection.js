(function(App) {

  'use strict';

  App.Collection.Projects = Backbone.Collection.extend({

    url: '/api/projects'

  });

})(this.App);
