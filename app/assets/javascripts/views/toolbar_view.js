(function(App) {

  'use strict';

  App.View.Toolbar = Backbone.View.extend({

    template: HandlebarsTemplates['toolbar'],

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
      this.$el.append(this.template());
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
    },

    toggleOptions: function() {
      this.$el.toggleClass('-active');
      var $plus = this.$el.find('.icon-plus');
      var $close = this.$el.find('.icon-close');

      if (this.$el.hasClass('-active')) {
        $plus.toggleClass('-hidden', true);
        $close.toggleClass('-hidden', false);
      } else {
        $plus.toggleClass('-hidden', false);
        $close.toggleClass('-hidden', true);
      }
    }

  });

})(this.App);
