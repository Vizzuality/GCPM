(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapSortby = App.Helper.Tooltip.extend({

    el: '#map-sortby',

    model: new (Backbone.Model.extend({
      defaults: {
        sortby: 'created asc'
      }
    })),

    events: {
      'click .btn-map-sortby' : 'onClickSortby'
    },

    initialize: function(settings) {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      this.params = settings.params;

      // Inits
      this.listeners();

      if (this.params.sortby) {
        this.model.set('sortby', this.params.sortby);
      }
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
      }.bind(this));

      this.model.on('change:sortby', this.changeSortBy.bind(this));
    },

    changeSortBy: function() {
      this.$el.find('li').removeClass('-selected');
      this.$el.find('li[data-sortby="'+this.model.get('sortby')+'"]').addClass('-selected');

      App.Events.trigger('filters:update', {
        sortby: this.model.get('sortby')
      });
    },


    /**
     * UI EVENTS
     * - onClickSortby
     */
    onClickSortby: function(e) {
      e & e.preventDefault();
      var sortby = $(e.currentTarget).data('sortby');
      this.model.set({ sortby: sortby });
    },

  });

})(this.App);
