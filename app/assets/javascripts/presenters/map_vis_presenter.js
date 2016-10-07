(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.MapVis = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.MapVis.prototype, {

    initialize: function(params) {
      this.fc = App.facade.layer;

      this.state = new StateModel(params);
      this.view = new App.View.Map({
        el: '#map',
        options: {
          zoom: 2,
          minZoom: 1,
          maxZoom: 14,
          center: [20, 0]
        }
      });

      this.addCountries();
      this.addPoints();
    },

    /**
     * Render layer
     * @param {params} Object
     */
    addPoints: function() {
      var map = this.view.map;
      this.fc.getPointLayer(this.state.attributes).done(function(layer) {
        layer.addTo(map, 2);
        setTimeout(function() {
          map.fitBounds(layer.getBounds(), {
            padding: [100, 100]
          });
        }, 100);
      });
    },

    /**
     * Render countries layer as basemap
     */
    addCountries: function() {
      var map = this.view.map;
      App.helper.countriesLayer().done(function(layer) {
        layer.addTo(map, 1);
      });
    }

  });

})(this.App);
