(function(App) {

  'use strict';

  App.Collection = App.Collection || {};

  App.Collection.LayersSpec = Backbone.Collection.extend({
    url: '/data/layersSpec.json'
  });


})(this.App);
