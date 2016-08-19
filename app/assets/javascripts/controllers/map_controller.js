(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Map = App.Controller.Page.extend({

    index: function(params) {
      this.params = params;

      var layersSpec = this.layersSpec = new App.Collection.LayersSpec();
      var map = this.map = new App.View.Map({
        el: '#map',
        collection: this.layersSpec,
        params: this.params
      });

      layersSpec.on('change, reset', function() {
        map.renderLayers();
      });

      this.setCollection();

      this._initMapComponents();

      App.Events.on('params:update', this.setCollection.bind(this));
    },

    setCollection: function() {
      var layersActived = [2];

      if (this.params['layer']) layersActived.push(5);
      this.layersSpec.fetch().done(function() {
        // This method triggers an event called 'reset'
        this.layersSpec.filterByIds(layersActived);
      }.bind(this));
    },

    _initMapComponents: function() {
      new App.View.MapMenu({
        params: this.params
      });

      new App.View.MapTypes({
        params: this.params
      });

      new App.View.MapFilters({
        params: this.params
      });

      new App.View.MapLayers({
        params: this.params
      });

      new App.View.MapSortby({
        params: this.params
      });
    }

  });


})(this.App);
