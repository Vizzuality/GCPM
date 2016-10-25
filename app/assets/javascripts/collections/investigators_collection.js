(function(App) {

  'use strict';

  App.Collection.Investigators = Backbone.Collection.extend({

    url: '/api/investigators?token='+window.AUTH_TOKEN

  });

})(this.App);
