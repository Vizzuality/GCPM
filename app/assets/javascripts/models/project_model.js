(function(App) {

  'use strict';

  App.Model.Project = Backbone.Model.extend({

    urlRoot: '/api/projects',

  });

})(this.App);
