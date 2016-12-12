(function(App) {

  'use strict';

  App.View.FilterBar = Backbone.View.extend({

    template: HandlebarsTemplates['filter_bar'],

    initialize: function() {
      this.data = [];
      this.render();
    },

    updateFilters: function(data) {
      this.data = data;
      this.render();
      this.$el.toggleClass('-active', !!this.data.length);
    },

    render: function() {
      this.$el.html(this.template({
        filters: this.data
      }));
    }

  });

})(this.App);
