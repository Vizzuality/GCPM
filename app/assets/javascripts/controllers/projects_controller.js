(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Projects = App.Controller.Page.extend({

    index: function(params) {
      // Map view
      // Layer active 6 eventual until basemap fixed
      var layersActived = [2, 6];

      var layersSpec = this.layersSpec = new App.Collection.LayersSpec();
      var map = new App.View.Map({
        el: '#map',
        collection: this.layersSpec,
        options: {
          basemap: null,
          apiUrl: '/api/map/projects/' + PROJECT_ID
        }
      });

      layersSpec.on('change, reset', function() {
        map.renderLayers();
      });

      layersSpec.fetch().done(function() {
        // This method triggers an event called 'reset'
        layersSpec.filterByIds(layersActived);
      });

      new App.View.ProjectDetail();
    },

    new: function() {
      new App.View.AddNewProject();
    }

  });


})(this.App);
