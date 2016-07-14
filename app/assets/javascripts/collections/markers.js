(function(App) {

  'use strict';

  App.Collection = App.Collection || {};
  App.Collection.Markers = Backbone.Collection.extend({
    url: '/assets/json/markers.json',
  });

})(this.App);
