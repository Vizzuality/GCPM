(function(App) {

  'use strict';

  App.Collection = App.Collection || {};
  App.Collection.Markers = Backbone.Collection.extend({
    url: '/assets/jsons/markers.json',
  });

})(this.App);
