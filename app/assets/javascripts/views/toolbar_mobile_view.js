(function(App) {

  'use strict';

  App.View.ToolbarMobile = Backbone.View.extend({


    events: {
      'click .js-more-tools': 'handleClick',
      'click .js-close-tools': 'handleClick'
    },

    initialize: function() {
      this.$plus = this.$el.find('.icon-plus');
      this.$close = this.$el.find('.icon-close');
    },

    handleClick: function() {
      this.trigger('click');
    },

    toggleTools: function(active) {
      this.$el.toggleClass('-active', active);
      this.$plus.toggleClass('-hidden', active);
      this.$close.toggleClass('-hidden', !active);
    }

  });

})(this.App);
