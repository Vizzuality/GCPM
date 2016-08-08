(function(App) {

  'use strict';

  App.Model = App.Model || {};

  App.Model.Investigator = Backbone.Model.extend({

    url: '/api/investigators',

    parse: function(data) {
      return data;
    }

  });

})(this.App);
