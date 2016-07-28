(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapLayers = App.Helper.Tooltip.extend({

    el: '#map-layers-tooltip',

    // map-layers

    initialize: function() {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.listeners();
    },

    listeners: function() {
      // Doesn't work but we don't need it as we binded the close function to
      // clicks on the document
      // Backbone.Events.on('MapMenu/action', this.hide.bind(this));
      Backbone.Events.on('Layers/toggle', function(e) {
        if(!this.initiator) {
          this.initiator = e.target;
          var buttonClientRect = e.currentTarget.getBoundingClientRect();
          this.$el.css({
            top:  (buttonClientRect.top + buttonClientRect.height) + 'px',
            left: (buttonClientRect.left + buttonClientRect.width / 2) + 'px'
          });
        }

        this.toggle();
      }.bind(this))
    },

    // render: function() {
    //   this.renderChosen();
    //   this.renderPickADate();
    //   return this;
    // },
    //
    // renderChosen: function() {
    //   this.$el.find('.chosen-select').chosen({
    //     width: '100%',
    //     allow_single_deselect: true,
    //     inherit_select_classes: true,
    //     no_results_text: "Oops, nothing found!"
    //   });
    // },
    //
    // renderPickADate: function() {
    //   // this.$el.find('.pickadate-input').pickadate();
    // }

  });

})(this.App);
