(function(App) {

  'use strict';

  App.View.Legend = Backbone.View.extend({

    template: HandlebarsTemplates[ gon.isMobile ? 'legend_mobile' : 'legend'],

    events: {
      'click .js-btn-info': 'onClickInfo',
      'click .js-legend-close': 'hideLayersWindow'
    },

    initialize: function(settings) {
      this.data = (settings && settings.data) ? settings.data : [];

      this.render();
      this.setEvents();
    },

    setEvents: function() {
      $(document).on('click', this.handleDocumentClick.bind(this));
    },

    updateData: function(data, layer) {
      this.data = data||[];
      this.layer = layer;

      this.render();
    },

    render: function() {
      if (this.data.length) {
        this.$el.html(this.template({
          items: this.data,
          layer: this.formatLayer(this.layer)
        }));
        return this;
      }
    },

    onClickInfo: function() {
      // We will probably need to check if there is layer_group info before
      var info = this.layer.info;
      this.trigger('info', info);
    },

    // HELPER
    formatLayer: function(layer) {
      if (layer && layer.layer_group) {
        layer.name = layer.layer_group.name + ' ' + layer.name
      }
      return layer;
    },

    handleDocumentClick: function(e) {
      // Controls whether it's a mobile or not
      if (gon.isMobile ? this.$el.find('.js-action-legend').length > 0 :
        this.$el.find('.js-actionbar-action').length > 0) {
        var isContained = this.el.contains(e.target);
        !isContained && this.hideLayersWindow();
      }
    },

    hideLayersWindow: function() {
      this.trigger('close');
    }
  });

})(this.App);
