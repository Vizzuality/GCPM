(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Map = App.Controller.Page.extend({

    index: function(params) {
      var layersActived = [2];

      var layersSpec = this.layersSpec = new App.Collection.LayersSpec();
      var map = this.map = new App.View.Map({
        el: '#map',
        collection: this.layersSpec
      });

      layersSpec.on('change, reset', function() {
        console.log('reset');
        map.renderLayers();
      });

      layersSpec.fetch().done(function() {
        // This method trigger an event called 'reset'
        layersSpec.filterByIds(layersActived);
      });

      this._initMapComponents();
    },

    _initMapComponents: function() {
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
