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
    el: 'body',

    events: {
      'click a[data-magic]': 'isMagicLink'
    },

    initialize: function() {
      this.$content = $('#content');
      this.router = new App.Router();
      this.listeners();
    },

    listeners: function() {
      this.listenTo(this.router, 'route', this.initCommonViews);
      this.listenTo(this.router, 'route:map', this.mapPage);
      this.listenTo(this.router, 'route:countries', this.countriesPage);
      this.listenTo(this.router, 'route:country', this.countryPage);

      // Listening magic links
      App.Events.on('remote:load', this.replaceContent);
    },

    start: function() {
      Backbone.history.start({ pushState: true });
    },

    stop: function() {
      Backbone.history.stop();
    },

    update: function() {
      console.log('update please');
    },

    /**
     * Use data-magic attribute with remote: true
     * @param  {Event}  e
     */
    isMagicLink: function(e) {
      var href = e.currentTarget.getAttribute('href');
      this.router.navigate(href);
    },

    initCommonViews: function() {
      new App.View.MobileHeader();
    },

    replaceContent: function(data) {
      var contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.innerHTML = data.content;
      }
    },

    mapPage: function() {
      var params = this.router.getParams(),
          layersCollection = new App.Collection.Layers();

      // // Views
      new App.View.Map({
        layers: layersCollection
      });

      new App.View.MapMenu();
      new App.View.MapFilters();
      new App.View.MapLayers();

      // Sync layers
      layersCollection.toggleLayers([
        params.type || 'projects'
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
