(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.UserDropdownMenu = Backbone.View.extend({

    el: '.user-avatar',

    // Events not working, that's why listeners are set up
    events: {
      'click .user-avatar': 'toggleDropdown'
    },

    initialize: function() {
      this.listeners();
    },

    listeners() {
      var avatar = document.getElementsByClassName('user-avatar')[0];
      avatar.addEventListener('click', this.toggleDropdown);
    },

    toggleDropdown: function(e) {
      e.preventDefault();
      var dropdownMenu = document.querySelector('.js-user-dropdown-menu');
      dropdownMenu.classList.toggle('-open');
    }

  });

})(this.App);
