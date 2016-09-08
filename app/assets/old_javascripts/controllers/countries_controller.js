(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Countries = App.Controller.Page.extend({

    index: function(params) {
      /* Countries index search view */
      var regionsCollection = new App.Collection.Regions();
      var regionsView = new App.View.SearchList({
        searchList: regionsCollection,
        options: {
          template: HandlebarsTemplates['countries-list'],
          innerSearchListName: 'countries',
          itemSearchedCategory: 'country_name',
          isTwoLevels: true
        }
      });

      regionsCollection.fetch();
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
