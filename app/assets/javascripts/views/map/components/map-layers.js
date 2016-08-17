(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapLayers = App.Helper.Tooltip.extend({

    el: '#map-layers',

    model: new (Backbone.Model.extend({
      defaults: {
      }
    })),

    events: {
      'click .btn-map-layer' : 'onClickLayer'
    },

    initialize: function(settings) {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.listeners();

      if (settings.params.layer) {
        this.model.set('layer', settings.params.layer);
      }
    },


    listeners: function() {
      App.Events.on('Layers/toggle', function(e) {

        var $currentTarget = $(e.currentTarget);
        var offsets = $currentTarget.offset();

        this.model.set('currentTarget', e.currentTarget);

        // Position tooltip
        this.$el.css({
          top: offsets.top + $currentTarget.innerHeight(),
          left: offsets.left
        });

        // Position arrow
        this.$el.find('.tooltip-arrow').css({
          left: $currentTarget.innerWidth()/2
        });

        this.toggle();
      }.bind(this));

      this.model.on('change:layer', this.changeLayer.bind(this));
    },

    changeLayer: function() {
      this.$el.find('li').removeClass('-selected');
      this.$el.find('li[data-layer="'+ this.model.get('layer') +'"]').addClass('-selected');

      this.model.get('layer') === 'none' ?
        App.Events.trigger('filters:delete', 'layer') :
        App.Events.trigger('filters:update', { 'layer': this.model.get('layer') });
    },


    /**
     * UI EVENTS
     * - onClickLayer
     */
    onClickLayer: function(e) {
      e & e.preventDefault();
      this.model.set('layer', $(e.currentTarget).data('layer'));
    },

  });

})(this.App);
