(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Events = App.Controller.Page.extend({

    index: function(params) {
      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        el: '#map',
        layers: layersCollection,
        options: {
          basemap: 'customDetail',
          apiUrl: '/api/map/events/'+EVENT_ID
        }
      });

      layersCollection.toggleLayers([
        params.type || 'org-project-markers'
      ]);

      new App.View.EventDetail();
    },

    new: function() {
      new App.View.AddNewEvent();
    }

  });


})(this.App);
