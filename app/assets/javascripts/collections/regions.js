(function(App) {

  'use strict';

  App.Collection = App.Collection || {};
  App.Collection.Regions = Backbone.Collection.extend({
    url: '/assets/jsons/regions.json',

    initialize: function(options) {
      this.options = options ? options : {};
    }

  });

})(this.App);
