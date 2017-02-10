(function(App) {

  'use strict';

  App.View.Toolbar = Backbone.View.extend({

    template: HandlebarsTemplates[ gon.isMobile ? 'toolbar_mobile' : 'toolbar'],

    events: {
      'click .js-toolbar-action': 'fireAction'
    },

    initialize: function() {
      this.activeFilters = 0;
      this.render();
      this.cache();
    },

    cache: function() {
      this.$filterBubble = this.$el.find('.js-notification-bubble');
    },

    render: function() {
      this.$el.html(this.template());
    },

    updateActiveFilters: function(activeFilters) {
      this.activeFilters = activeFilters;
      this.$filterBubble
        .html(this.activeFilters)
        .toggle(!!this.activeFilters)
    },

    fireAction: function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      var $currentTarget = $(e.currentTarget);
      this.trigger('action', $currentTarget.data('action'));
    }

  });

})(this.App);
