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

    show: function() {
      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        el: "#map",
        layers: layersCollection,
        options: {
          basemap: 'customDetail'
        }
      });
    }

  });


})(this.App);
