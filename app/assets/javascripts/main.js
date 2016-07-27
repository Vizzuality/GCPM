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
      // this._cartodbHack();
      this.listeners();
    },

    listeners: function() {
      this.listenTo(this.router, 'route:map', this.mapPage);
      this.listenTo(this.router, 'route:countries', this.countryPage);
    },

    start: function() {
      Backbone.history.stop();
      Backbone.history.start({ pushState: true });

      /* We initialize the mobile header */
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

      // Sync layers
      layersCollection.toggleLayers([
        params.type || 'project-markers'
      ]);

      this.initGlobalViews();
    },

    countryPage: function() {
      var params = this.router.getParams();

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


      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
      });

      layersCollection.toggleLayers([
        params.type || 'project-markers'
      ]);

      this.initGlobalViews();
    },

    initGlobalViews: function() {
    },

    /**
     * Cartodb Handlebars hack.
     */
    _cartodbHack: function() {
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      });
    },


  });

})(this.App);
