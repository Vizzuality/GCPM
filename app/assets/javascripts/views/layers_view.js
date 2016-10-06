(function(App) {

  'use strict';

  App.View.Layers = Backbone.View.extend({

    template: HandlebarsTemplates['layers'],

    initialize: function(settings) {
      this.data = (settings && settings.data)||[];
    },

    updateData: function(data) {
      this.data = data||[];
      this.render();
    },

    render: function() {
      this.$el.html(this.template({ data: this.data }));
      return this;
    }

  });

})(this.App);
