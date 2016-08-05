(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapSortby = App.Helper.Tooltip.extend({

    el: '#map-sortby',

    events: {
      'click .btn-map-sortby' : 'onClickSortby'
    },

    initialize: function() {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.listeners();
    },


    listeners: function() {
      App.Events.on('Sortby/toggle', function(e) {

        var $currentTarget = $(e.currentTarget);
        var offsets = $currentTarget.offset();

        this.model.set('currentTarget', e.currentTarget);

        this.$el.css({
          top: offsets.top + $currentTarget.innerHeight() + 'px',
          left: offsets.left + $currentTarget.innerWidth() + 'px'
        });

        // Position arrow
        this.$el.find('.tooltip-arrow').css({
          right: $currentTarget.innerWidth()/2
        });

        this.toggle();
      }.bind(this))
    },


    /**
     * UI EVENTS
     * - onClickSortby
     */
    onClickSortby: function(e) {
      e & e.preventDefault();
      this.model.set('sortby', $(e.currentTarget).data('sortby'));
      console.log(this.model.toJSON());
    },

  });

})(this.App);
