(function(App) {

  'use strict';

  App.View.UserNav = Backbone.View.extend({

    template: HandlebarsTemplates['usernav'],

    events: {
      'click .js-userMenu': 'toggleMenu'
    },

    initialize: function(params) {
      this.$el = $(params.el);
      this.user_data = JSON.parse(sessionStorage.getItem('user_data'));
      this.$el.find('.initials').text(this.user_data ?
        this.user_data.user_initial :
        'U');
      this.$el.find('.c-badge').text(this.user_data ?
        (this.user_data.user_project + this.user_data.user_event + 0) :
        0);
      this.$el.find('.proj-even').append(this.template({user_data: this.user_data || {}}));
    },

    toggleMenu: function() {
      this.$el.find('.userMenuDropDown').toggle();
    }

  });

})(this.App);
