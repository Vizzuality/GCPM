(function(App) {

  'use strict';

  App.View.Legend = Backbone.View.extend({

    template: HandlebarsTemplates['legend'],

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
          layer: this.layer
        }));
        return this;
      }
    }

  });

})(this.App);
