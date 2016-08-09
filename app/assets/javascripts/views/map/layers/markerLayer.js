(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MarkerLayer = App.Helper.Layer.extend({

    createLayer: function() {
      var markers = new App.Collection.Markers({
        type: this.params.get('type') || 'projects',
        apiUrl: this.options.apiUrl
      });

      markers
        .fetch({
          data: this.params.toJSON()
        })
        .done(function(){
          var options = {
            markers: markers.toJSON(),
            type: this.params.get('type') || 'projects'
          };

          var layer = new App.Helper.MarkerLayer(this.map, options);
          /* Changing the model, the listener will react and call the addLayer() method */
          this.model.set("layer", layer);

        }.bind(this));
    }

  });

})(this.App);
