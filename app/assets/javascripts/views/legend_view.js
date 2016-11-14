(function(App) {

  'use strict';

  App.View.Legend = Backbone.View.extend({

    template: HandlebarsTemplates['legend'],

    events: {
      'click .js-btn-info': 'onClickInfo'
    },

    initialize: function(settings) {
      this.data = (settings && settings.data) ? settings.data : [];
      this.render();
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
    }
  });

})(this.App);
