(function(App) {

  'use strict';

  App.View.Breadcrumbs = Backbone.View.extend({

    events: {
      'click a.js-breadcrumb': 'fireEvent'
    },

    template: HandlebarsTemplates['breadcrumbs'],

    initialize: function(settings) {
      this.data = (settings && settings.data) || [];
    },

    updateData: function(data) {
      this.data = data || [];
      this.render();
    },

    render: function() {
      this.$el.html(this.template({ data: this.data }));
      return this;
    },

    fireEvent: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.trigger('change', {
        name: e.currentTarget.innerHTML,
        value: e.currentTarget.getAttribute('data-value')
      });
    }

  });

})(this.App);
