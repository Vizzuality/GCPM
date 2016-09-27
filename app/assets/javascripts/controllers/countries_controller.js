(function(App) {

  'use strict';

  App.Controller.Countries = function() {};

  _.extend(App.Controller.Countries.prototype, {

    index: function(params) {
      new App.Presenter.CountriesList(params);
    },

    show: function(params) {
      this.params = params;
      var layersActived = [2, 6];
      var layersSpec = this.layersSpec = new App.Collection.LayersSpec();
      var options = {
        basemap: null,
        apiUrl: '/api/map/?group=points&countries[]=' + COUNTRY_ID
      };
      // Map view
      var layersCollection = new App.Collection.Layers();
      var map = new App.View.Map({
        el: '#map',
        collection: this.layersSpec,
        params: this.params,
        options: options
      });

      layersSpec.on('change, reset', function() {
        map.renderLayers();
      });

      layersSpec.fetch().done(function() {
        // This method triggers an event called 'reset'
        layersSpec.filterByIds(layersActived);
      });
    }

  });

})(this.App);
