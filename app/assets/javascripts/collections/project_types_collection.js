(function(App) {

  'use strict';

  App.Collection.ProjectTypes = Backbone.Collection.extend({

    url: '/api/project-types'

  });

})(this.App);
