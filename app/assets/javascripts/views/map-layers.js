(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapLayers = App.Helper.Tooltip.extend({

    el: '#map-layers',

    events: {
      'click .btn-map-layer' : 'onClickLayer'
    },

    initialize: function() {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.listeners();
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
      }.bind(this))
    },


    /**
     * UI EVENTS
     * - onClickLayer
     */
    onClickLayer: function(e) {
      e & e.preventDefault();
      this.model.set('layer', $(e.currentTarget).data('layer'));
      console.log(this.model.toJSON());
    },

  });

})(this.App);
