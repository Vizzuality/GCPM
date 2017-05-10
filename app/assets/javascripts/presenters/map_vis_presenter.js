(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var CountryModel = Backbone.Model.extend({
    setUrl: function(iso) {
      var sql = "SELECT st_asgeojson(bbox_the_geom) "+
                "FROM canceratlas_downloadabledata "+
                "WHERE iso3='" + iso + "'";

      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql + '&api_key=' + gon.carto_key;
    }
  });



  App.Presenter.MapVis = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.MapVis.prototype, {

    initialize: function(params, options) {
      this.fc = App.facade.layer;
      this.options = _.extend({}, options || {});

      this.state = new StateModel(params);
      this.country = new CountryModel();

      this.view = new App.View.Map({
        el: '#map',
        options: _.extend({}, {
          zoom: 3,
          minZoom: 3,
          center: [20, 0],
          basemap: 'secondary'
        }, this.options.map)
      });

      this.setEvents();
      this.setSubscriptions();

      this.addPoints();
      // this.addCountries();
    },

    setEvents: function() {
      this.state.on('change', function() {
        this.addPoints();
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

    getData: function(data) {
      switch (data) {
        case 'projects':
          return 'projects';
        case 'events':
          return 'events';
        case 'people':
          return 'people'
        default:
          return 'projects'
      }
    },

    /**
     * Render layer
     * @param {params} Object
     */
    addPoints: function() {
      var map = this.view.map;
      var attributes = _.extend({}, this.state.attributes, {
        data: this.getData(this.state.attributes.data)
      });

      if (this.currentLayer) {
        map.removeLayer(this.currentLayer);
      }
      this.fc.getPointLayer(attributes).done(function(layer) {
        this.currentLayer = layer;
        map.addLayer(layer);
        setTimeout(function() {
          if (layer && layer.getBounds() && !this.state.get('iso')) {
            map.fitBounds(layer.getBounds(), {
              paddingTopLeft: [100, 100],
              paddingBottomRight: [100, 200]
            });
          }

          if (this.state.get('iso')) {
            this.country.setUrl(this.state.get('iso'));
            this.country.fetch()
              .done(function(data){
                var st_asgeojson = JSON.parse(data.rows[0].st_asgeojson);
                var countryEnvelop = L.geoJson(st_asgeojson);
                map.fitBounds(countryEnvelop.getBounds());
              }.bind(this));
          }

        }.bind(this), 100);
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
    }

  });

})(this.App);
