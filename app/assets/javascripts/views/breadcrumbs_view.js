(function(App) {

  'use strict';

  App.View.Breadcrumbs = Backbone.View.extend({

    events: {
      'click a.js-breadcrumb': 'fireEvent'
    },

    template: HandlebarsTemplates['breadcrumbs'],

    initialize: function(settings) {
      this.navTree = (settings && settings.navTree) || {};
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    fireEvent: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.trigger('change', {
        level: e.currentTarget.getAttribute('data-name'),
        iso: e.currentTarget.getAttribute('data-value')
      });
    }

  });

})(this.App);
