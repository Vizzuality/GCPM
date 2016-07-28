(function(App) {

  'use strict';
  /**
   * Main Application View
   */
  App.MainView = Backbone.View.extend({

    /**
     * Main DOM element
     * @type {Object}
     */
    el: document.body,

    initialize: function() {
      this.router = new App.Router();
      this.listeners();
    },

    listeners: function() {
      this.listenTo(this.router, 'route', this.initCommonViews);
      this.listenTo(this.router, 'route:map', this.mapPage);
      this.listenTo(this.router, 'route:countries', this.countriesPage);
      this.listenTo(this.router, 'route:country', this.countryPage);
    },

    start: function() {
      this.router.start();
    },

    update: function() {
      console.log('update instances please');
    },

    initCommonViews: function() {
      new App.View.MobileHeader();
    },

    mapPage: function() {
      var params = this.router.getParams(),
          layersCollection = new App.Collection.Layers();

      // Views
      var mapView = new App.View.Map({
        layers: layersCollection,
      });
      var mapMenuView = new App.View.MapMenu();
      var mapFiltersView = new App.View.MapFilters();
      var mapLayersView = new App.View.MapLayers();

      // Sync layers
      layersCollection.toggleLayers([
        params.type || 'project-markers'
      ]);
    },

    countriesPage: function() {
      var params = this.router.getParams();

      /* Countries index search view */
      var regionsCollection = new App.Collection.Regions();
      var regionsView = new App.View.SearchList({
        searchList: regionsCollection,
        options: {
          isTwoLevels: true,
          template: HandlebarsTemplates['countries-list'],
          innerSearchListName: 'countries',
          itemSearchedCategory: 'country_name'
        }
      });

      regionsCollection.fetch();
    },

    countryPage: function() {
      var params = this.router.getParams();

      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
      });

      layersCollection.toggleLayers([
        params.type || 'org-project-markers'
      ]);
    }

  });

})(this.App);
