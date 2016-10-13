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
          maxZoom: 10,
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
        map.addLayer(layer);
        setTimeout(function() {
          if (layer && layer.getBounds()) {
            map.fitBounds(layer.getBounds(), {
              paddingTopLeft: [100, 100],
              paddingBottomRight: [100, 200]
            });
          }
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
