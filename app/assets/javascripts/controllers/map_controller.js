(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Map = App.Controller.Page.extend({

    index: function(params) {
      console.log(params);
      // this.map = App.View.Map({ el: '#map' });
      // this.layersSpec = App.Collection.Layers();
      // this.layersSpec.fetch({ data: params }).done(this._addLayers);
    },

    _addLayers: function() {
      this.map.renderLayers(this.layersSpec.toJSON());
    }

  });


})(this.App);
