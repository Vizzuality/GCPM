(function(App) {

  'use strict';

  App.Collection = App.Collection || {};

  App.Collection.Layers = Backbone.Collection.extend({
    layers: [
      {
        id: 1,
        slug: 'project-markers',
        name: 'Project markers',
        type: 'marker',
        description: 'Project markers',
        color: 'red',
        opacity: 1,
        order: 1000,
        active: false,
        published: true
      },
      {
        id: 2,
        slug: 'people-markers',
        name: 'People markers',
        type: 'marker',
        description: 'People markers',
        color: 'red',
        opacity: 1,
        order: 1000,
        active: false,
        published: true
      },
      {
        id: 3,
        slug: 'event-markers',
        name: 'Events markers',
        type: 'marker',
        description: 'Events markers',
        color: 'red',
        opacity: 1,
        order: 1000,
        active: false,
        published: true
      },
      {
        id: 4,
        slug: 'org-project-markers',
        name: 'Project markers',
        type: 'marker',
        description: 'Project markers',
        color: 'red',
        opacity: 1,
        order: 1000,
        active: false,
        published: true
      },
      {
        id: 5,
        slug: 'org-people-markers',
        name: 'People markers',
        type: 'marker',
        description: 'People markers',
        color: 'red',
        opacity: 1,
        order: 1000,
        active: false,
        published: true
      },
      {
        id: 6,
        slug: 'org-event-markers',
        name: 'Events markers',
        type: 'marker',
        description: 'Events markers',
        color: 'red',
        opacity: 1,
        order: 1000,
        active: false,
        published: true
      }
    ],

    initialize: function() {
      this.getLayers();
    },

    comparator: function(d) {
      return d.attributes.order ? d.attributes.order * 1000 : d.attributes.name;
    },

    // Reset the collection with the default data
    getLayers: function() {
      this.reset(this.layers);
      this.sort();
    },

    toggleLayers: function(activeLayers) {
      _.map(activeLayers, function(slug) {
        var layer = this.findWhere({
          slug: slug
        });
        layer.set({ active: true });
      }.bind(this))
    }


  });


})(this.App);
