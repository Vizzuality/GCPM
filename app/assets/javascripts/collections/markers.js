(function(App) {

  'use strict';

  App.Collection = App.Collection || {};
  App.Collection.Markers = Backbone.Collection.extend({
    url: '/assets/jsons/',

    initialize: function(options) {
      this.options = options ? options : {};
      this.setUrl();
    },

    setUrl: function() {
      this.url += this.options.type + '.json'
    }

  });

})(this.App);
