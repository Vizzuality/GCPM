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
      var groups = _.uniq(_.filter(_.flatten(_.pluck(this.toJSON(), 'layer_groups')), function(group){
        return group.slug !== 'human-development-index';
      }), 'name');

      var layersGrouped = {};
      _.each(groups, function(group) {
        layersGrouped[group.name] = _.filter(this.toJSON(), function(layer) {
          return _.contains(_.pluck(layer.layer_groups, 'slug'), group.slug);
        });
      }.bind(this));

      return layersGrouped;
    },

    getGroup: function(groupSlug) {
      var group = _.filter(this.toJSON(), function(layer){
        return _.contains(_.pluck(layer.layer_groups, 'slug'), groupSlug);
      });
      return group;
    }

  });

})(this.App);
