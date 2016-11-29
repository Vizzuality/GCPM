(function(App) {

  'use strict';

  App.View.UserActionsMobile = Backbone.View.extend({

    events: {
      'click .js-btn-more': 'handleClick',
      'click .js-btn-back': 'handleClick'
    },

    initialize: function() {

      this.cache();
    },

    cache: function() {
      this.$actionMenu = this.$el.find('.c-user-actions-mobile');
      this.$html = $('html');
      this.$body = $('body');
    },

    handleClick: function() {
      this.trigger('click');
    },

    toggleActionsMenu: function() {
      this.$actionMenu.toggleClass('-active');
      this.$html.toggleClass('-no-overflow');
      this.$body.toggleClass('-no-overflow');
    }

  });

})(this.App);
