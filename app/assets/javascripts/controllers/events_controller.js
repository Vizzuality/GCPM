(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Events = App.Controller.Page.extend({

    index: function(params) {
      // Map view
      var layersActived = [2, 4];

      var layersSpec = this.layersSpec = new App.Collection.LayersSpec();
      var map = new App.View.Map({
        el: '#map',
        collection: this.layersSpec,
        options: {
          basemap: 'customDetail',
          apiUrl: '/api/map/events/' + EVENT_ID
        }
      });

      layersSpec.on('change, reset', function() {
        map.renderLayers();
      });

      layersSpec.fetch().done(function() {
        // This method triggers an event called 'reset'
        layersSpec.filterByIds(layersActived);
      });


      new App.View.EventDetail();
    },

    new: function() {
      new App.View.AddNewEvent();
    }

  });


})(this.App);
