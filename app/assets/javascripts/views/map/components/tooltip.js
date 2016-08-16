(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  App.View.Tooltip = App.Helper.Class.extend({

    defaults: {},

    /* TO-DO: template may change depending on section */
    template: HandlebarsTemplates['map-tooltip'],

    initialize: function(settings) {
      this.options = _.extend({}, this.defaults, settings || {});
      this.tooltipEl = $('#map-tooltip');
      this.pos = settings.pos;
      this.data = settings.data.layer.options.data;

      this.create();
    },

    /************
     * TOOLTIP
     * - create
     * Renders tooltip on expecified position
     */
    create: function() {
      this.tooltipEl
        .css({
          left: this.pos.x,
          top: this.pos.y
        })
        .html(this.template(this.data))
        .addClass('-active');
    },

    /**
     * - remove
     * Remove tooltip
     */
    remove: function() {
      this.tooltipEl
        .html('')
        .removeClass('-active');
    }

  });

})(this.App);
