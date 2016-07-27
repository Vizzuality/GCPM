(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MobileHeader = Backbone.View.extend({

    el: '.c-header',

    events: {
      'click .js-hamburger-menu': 'toggleDrawer'
    },

    initialize: function() {
      this.drawer = document.querySelector('.js-mobile-drawer');
    },

    toggleDrawer: function(e) {
      e.preventDefault();
      this.drawer.classList.toggle('-opened');
    }

  });

})(this.App);
