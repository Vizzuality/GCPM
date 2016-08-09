(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Map = App.Controller.Page.extend({

    index: function(params) {
      console.log(params);
      this.map = new App.View.Map({ el: '#map' });
      this.layersSpec = new App.Collection.LayersSpec();
      this.layersSpec.fetch({ data: params }).done(this._addLayers.bind(this));

      this._setMapComponents();
    },

    _addLayers: function() {
      debugger;
      var layersSpec = this.layersSpec.toJSON();
      this.map.collection = layersSpec;
      this.map.renderLayers(this.map.collection);
    },

    _setMapComponents: function() {
      new App.View.MapMenu({
        params: this.params
      });

      // new App.View.MapTypes({
      //   params: this.params
      // });

      // new App.View.MapFilters({
      //   params: this.params
      // });

      // new App.View.MapLayers();
      // new App.View.MapSortby();
    }

  });


})(this.App);
