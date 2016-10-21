(function(App) {

  'use strict';

  App.Collection.Layers = Backbone.Collection.extend({

    url: '/api/layers'

  });

})(this.App);
