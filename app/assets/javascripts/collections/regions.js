(function(App) {

  'use strict';

  App.Collection = App.Collection || {};
  App.Collection.Regions = Backbone.Collection.extend({
    url: '/api/regions',
  });

})(this.App);
