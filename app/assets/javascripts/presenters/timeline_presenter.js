(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({
    defaults: {
      year: 2013
    }
  });

  App.Presenter.Timeline = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Timeline.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.layersCollection = new App.Collection.Layers();
      this.timeline = new App.View.Timeline({ el: '#timeline' });

      this.layersCollection.fetch().done(function(){
        this.setEvents();
        this.setSubscriptions();

        this.renderTimeline();
        this.setState(params);
      }.bind(this))
    },

    setEvents: function() {
      this.state.on('change', this.checkTimeline, this);

      this.timeline.on('change', function(year) {
        var newState = {
          year: year,
          cartoLayer: 'human-development-index-' + year
        }
        this.setState(newState);
        App.trigger('Timeline:change', this.getState());
      }, this);
    },

    setSubscriptions: function() {
      App.on('Router:change Map:change', function(newState) {
        this.setState(newState);
      }.bind(this), this);

    },

    setState: function(newState) {
      this.state.set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    checkTimeline: function() {
      var slug = this.state.get('cartoLayer');
      var layer = this.layersCollection.getLayer(slug);
      var active = false;

      if (layer) {
        active = !!(layer.layer_groups && _.contains(_.pluck(layer.layer_groups, 'slug'), 'human-development-index'))
      }
      this.toggleTimeline(active);
    },

    renderTimeline: function() {
      var group = this.layersCollection.getGroup('human-development-index');
      this.timeline.render(group);
    },

    toggleTimeline: function(active) {
      this.timeline.setActive(this.state.get('year'));
      this.timeline.toggle(active);
    }

  });


})(this.App);
