(function(App) {

  'use strict';

  App.View.UserNav = Backbone.View.extend({

    events: {
      'click .c-user-profile-picture': 'toggleMenu'
    },

    initialize: function(params) {
      this.$el = $(params.el);
      this.user_data = JSON.parse(sessionStorage.getItem('user_data'));
      this.$el.find('.initials').text(this.user_data.user_initial);
      this.$el.find('.c-badge').text(this.user_data.user_project + this.user_data.user_event + 0);
    },

    toggleMenu: function(e) {
      this.$el.find('.c-user-dropdown-menu').toggle();
    }

  });

})(this.App);
