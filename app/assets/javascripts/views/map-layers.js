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
      Backbone.Events.on('Layers/toggle', function(e) {

        var $target = $(e.currentTarget);
        var offsets = $target.offset();

        this.$el.css({
          top: offsets.top + $target.innerHeight() + 'px',
          left: offsets.left + 'px'
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
      console.log($(e.currentTarget).data('layer'));
    },

  });

})(this.App);
