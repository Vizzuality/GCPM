(function(App) {

  'use strict';

  App.Model.LayerSpec = Backbone.Model.extend({

    createLayer: function() {
      var deferred = new $.Deferred();

      if (this.attributes.type === 'bubble') {
        var bubblesLayer = new App.Helper.BubblesLayer();
        bubblesLayer
          .fetchLayer({ group: 'countries' })
          .done(_.bind(function(layerInstance) {
            this.set({ layer: layerInstance }, { trigger: false });
            deferred.resolve(this.attributes.layer);
          }, this));
      }

      return deferred.promise();
    }

  });

})(this.App);
