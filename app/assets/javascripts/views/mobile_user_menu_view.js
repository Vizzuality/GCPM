(function(App) {

  'use strict';

  App.View.MobileUserMenu = Backbone.View.extend({

    events: {
      'click .js-mobile-user-menu': 'toggleMenuContent'
    },

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$mobileContent = this.$el.find('.menu-content');
      this.$defaultContent = this.$mobileContent.filter('.-default');
    },

    toggleMenuContent: function() {
      this.$mobileContent.toggleClass('-hidden');
    },

    toogleToDefaultContent: function() {
      this.$mobileContent.toggleClass('-hidden', true);
      this.$defaultContent.toggleClass('-hidden', false);
    }

  });

})(this.App);
