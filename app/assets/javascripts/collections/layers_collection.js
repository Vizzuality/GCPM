(function(App) {

  'use strict';

  App.Collection.Layers = Backbone.Collection.extend({

    url: '/api/layers',

    getLayer: function(slug) {
      if (!slug) { return null }

      var layer = _.findWhere(this.toJSON(), {slug: slug});
      return layer;
    },

    getGroups: function() {
      var groups = _.groupBy(
        _.filter(this.toJSON(), function(layer){
          return layer.layer_group
        }), function(layer) {
        return layer.layer_group.name;
      });

      return groups;
    },

    getGroup: function(groupSlug) {
      var group = _.filter(this.toJSON(), function(layer){
        return layer.layer_group && layer.layer_group.slug === groupSlug
      });
      return group;
    }

  });

})(this.App);
