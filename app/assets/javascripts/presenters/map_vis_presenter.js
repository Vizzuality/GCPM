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
          center: [20, 0],
          basemap: 'secondary'
        }
      });
      this.datasWithLayer = ['projects', 'events', 'people'];

      this.setEvents();
      this.setSubscriptions();

      if (this.datasWithLayer.indexOf(params.data) > -1) {
        this.addPoints();
      }
      // this.addCountries();
    },

    setEvents: function() {
      this.state.on('change', function(newState) {
        if (this.datasWithLayer.indexOf(newState.get('data')) > -1) {
          this.addPoints();
        } else if (this.currentLayer) {
          this.view.map.removeLayer(this.currentLayer);
          this.showWholeMap();
        }
      }, this);
    },

    setSubscriptions: function() {
      App.on('Router:change', this.setState, this);
      App.on('TabNav:change', function(state) {
        this.setState(state, true);
      }, this);
    },

    setState: function(newState) {
      this.state.set(newState);
    },

    /**
     * Render layer
     * @param {params} Object
     */
    addPoints: function() {
      var map = this.view.map;
      if (this.currentLayer) {
        map.removeLayer(this.currentLayer);
      }
      this.fc.getPointLayer(this.state.attributes).done(function(layer) {
        this.currentLayer = layer;
        map.addLayer(layer);
        setTimeout(function() {
          if (layer && layer.getBounds()) {
            map.fitBounds(layer.getBounds(), {
              paddingTopLeft: [100, 100],
              paddingBottomRight: [100, 200]
            });
          }
        }, 100);
      }.bind(this));
    },

    /**
     * Render countries layer as basemap
     */
    addCountries: function() {
      var map = this.view.map;
      App.helper.countriesLayer().done(function(layer) {
        layer.addTo(map, 1);
      });
    },

    showWholeMap: function() {
      var center = L.latLng(20, 0);
      this.view.map.setView(center, 2);
    }

  });

})(this.App);
