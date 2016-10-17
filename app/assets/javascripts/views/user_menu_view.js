(function(App) {

  'use strict';

  App.View.UserMenu = Backbone.View.extend({

    el: '.js-user-menu',

    events: {
      'click': 'handleUserMenu'
    },

    initialize: function() {
    },

    handleUserMenu: function() {
      this.trigger('click', this);
    }

  });

})(this.App);
