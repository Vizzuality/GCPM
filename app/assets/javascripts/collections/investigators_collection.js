(function(App) {

  'use strict';

  App.Collection.Investigators = Backbone.Collection.extend({

    url: '/api/organizations'

  });

})(this.App);
