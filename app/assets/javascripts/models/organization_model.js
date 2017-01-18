(function(App) {

  'use strict';

  App.Model.Organization = Backbone.Model.extend({

    urlRoot: '/api/organizations',

  });

})(this.App);
