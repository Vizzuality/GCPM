(function(App) {

  'use strict';

  App.Collection.LayersSpec = Backbone.Collection.extend({

    model: App.Model.LayerSpec,

    activateAll: function() {
      this.each(function(model) {
        model.set('active', true);
      });
    },

    deactivateAll: function() {
      this.each(function(model) {
        model.set('active', false);
      });
    }

  });

})(this.App);
