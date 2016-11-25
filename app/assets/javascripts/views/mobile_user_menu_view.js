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
    },

    toggleMenuContent: function() {
      this.$mobileContent.toggleClass('-hidden');
    }

  });

})(this.App);
