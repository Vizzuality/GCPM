(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CountryDataMap = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CountryDataMap.prototype, {

    initialize: function(params) {
      this.fc = App.facade.layer;

      this.state = new StateModel(params);

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
      this.setMap();
    },

    setEvents: function() {

    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
      App.on('Remote:load', this.setMap, this);
    },

    setState: function(newState) {
      this.state
        .set(newState, { silent: true });
    },

    getState: function() {
      return this.state.attributes;
    },

    setMap: function() {
      if (this.state.get('data') === 'data') {
        this.countryDataMap = new App.View.Map({
          el: '#countryDataMap',
          options: {
            zoom: 2,
            minZoom: 1,
            maxZoom: 10,
            center: [20, 0],
            basemap: 'secondary'
          }
        });
        this.addPoints();
      }
    },

    /**
     * Render layer
     * @param {params} Object
     */
    addPoints: function() {
      var map = this.countryDataMap.map;
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
    }
  });

})(this.App);
