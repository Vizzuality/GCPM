(function(App) {

  'use strict';

  App.View.Legends = Backbone.View.extend({

    template: HandlebarsTemplates['legends'],

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
