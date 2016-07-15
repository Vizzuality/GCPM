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
    },

    start: function() {
      Backbone.history.stop();
      Backbone.history.start({ pushState: true });
    },

    mapPage: function() {
      var layersCollection = new App.Collection.Layers();

      // var locationsModel = new (Backbone.Model.extend({ defaults: { category: null }}))();

      // var locationsCollection = new App.Collection.LocationsCollection({ categories: locationsModel});

      var mapView = new App.View.Map({
        layers: layersCollection,
        // locations: locationsCollection,
        // categories: locationsModel,
      });

      layersCollection.getData();
      // locationsCollection.getData({
      //   format: 'geojson'
      // });

      // this.locationsView = new App.View.LocationsView({
      //   layers: layersCollection,
      //   locations: locationsCollection,
      //   model: locationsModel
      // });
      // this.locationView = new App.View.LocationView({
      //   locations: locationsCollection
      // });

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


