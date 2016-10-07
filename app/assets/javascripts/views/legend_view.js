(function(App) {

  'use strict';

  App.View.Legend = Backbone.View.extend({

    template: HandlebarsTemplates['legend'],

    initialize: function(settings) {
      this.data = (settings && settings.data) ? settings.data : [];
      this.render();
    },

    updateData: function(data) {
      this.data = data||[];
      this.render();
    },

    render: function() {
      this.$el.html(this.template({ items: this.data }));
      return this;
    }

  });

})(this.App);
