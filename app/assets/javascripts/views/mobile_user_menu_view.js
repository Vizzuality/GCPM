(function(App) {

  'use strict';

  App.View.MobileUserMenu = Backbone.View.extend({

    events: {
      'click .js-mobile-user-menu': 'toggleMenuContent',
      'click .js-mobile-notifications': 'toggleMenuContentNotifications'
    },

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$userActions = this.$el.find('.user-actions');
      this.$notifications = this.$el.find('.notifications');
      this.$defaultContent = this.$el.find('.menu-content').filter('.-default');
    },

    toggleMenuContent: function() {
      this.$userActions.toggleClass('-hidden');
      this.$defaultContent.toggleClass('-hidden');
    },

    toggleMenuContentNotifications: function() {
      this.$notifications.toggleClass('-hidden');
      this.$defaultContent.toggleClass('-hidden');
    },

    toogleToDefaultContent: function() {
      this.$userActions.toggleClass('-hidden', true);
      this.$notifications.toggleClass('-hidden', true);
      this.$defaultContent.toggleClass('-hidden', false);
    }

  });

})(this.App);
