(function(App) {

  'use strict';

  App.View.FilterBar = Backbone.View.extend({

    template: HandlebarsTemplates['filter_bar'],

    initialize: function() {
      this.data = [];
      this.dataValue = 'projects'
      this.render();
    },

    updateFilters: function(data, dataValue) {
      this.data = data;
      this.dataValue = dataValue;
      this.render();
      this.$el.toggleClass('-active', !!this.data.length);
    },

    render: function() {
      var obj = {
        filters: this.data,
        all: this.dataValue != 'events'
      };
      this.$el.html(this.template(obj));
    }

  });

})(this.App);
